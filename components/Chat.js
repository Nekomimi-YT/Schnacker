import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor() {
    super();

    //State includes messages, user id and full user details
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      loggedInText: '',
      isConnected: false,
      image: null,
      location: null
    }

    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAtxv7-Zb2QEFC8m8X9GXmTUStVKeLEdwc",
      authDomain: "test1-firestore-9c2af.firebaseapp.com",
      projectId: "test1-firestore-9c2af",
      storageBucket: "test1-firestore-9c2af.appspot.com",
      messagingSenderId: "766452589307",
      appId: "1:766452589307:web:a8165d68fb7697ff09865e"
    };

    
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  // saves message to AsyncStorage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // retrieves and parses messages from AsyncStorage
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // delete message function to use when testing 
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  /* componentDidMount functionality:
    - Uses prop name for navigation header on chat view
    - Retrieves previous messages from AsyncStorage
    - Authorizes user anonymously using firestore */

  componentDidMount(){
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (!connection.isConnected) {
        console.log('offline');
        this.setState({
          isConnected: false
        });
        // no connection: get messages from AsyncStorage    
        this.getMessages();
      } else {
        console.log('online');
        this.setState({
          isConnected: true
        });
         // connected: get messages from AsyncStorage 
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
        
          //update user state with user data
          this.setState({
            uid: user.uid,
            messages: [], 
            user: {
              _id: user.uid,
              name: name,
            },
            loggedInText: `Welcome back ${name}!`,
          });
    
          //console.log testing that anon auth was successful
          console.log(this.state.loggedInText);
    
          // create a reference to the active user's documents (messages)
          this.referenceChatMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
    
          // listen for message collection changes for current user
          this.unsubscribeChatMessagesUser = this.referenceChatMessagesUser.onSnapshot(this.onCollectionUpdate);
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribeChatMessagesUser();
      this.authUnsubscribe();
    };
  }

  // adds message and data to firebase 
  addMessages = () => {
    firebase.firestore().collection('messages').add({
      user: this.state.user,
      createdAt: new Date(),
      text: this.state.messages, 
      image: this.state.image || null,
      location: this.state.location || null,     
    });
  }   
  
  // appends the new message to the previousState and calls both database 
  // and AsyncStorage message-saving functions
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessages();
      //this.deleteMessages();
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data.uid, 
        createdAt: data.createdAt.toDate(),
        user: data.user,
        text: data.text,
      });
    });
    this.setState({
      messages: messages,
    });
  };

  // customizing the chat bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#838383',
          },
          left: {
            backgroundColor: '#FFFFFF'
          }
        }}
      />
    )
  }

  // render text input only if user is connected
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  // render the button to access image actions and geolocation
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // render a map in the chat bubble
  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  // rendering the Gifted Chat component and Android keyboard fix
  render() {
    let { bgColor, name } = this.props.route.params;
    const { messages } = this.state;
    return (
      <View style={[{backgroundColor: bgColor}, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={ messages }
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: name,
        }}
        />
        { Platform.OS === 'android' 
          ? <KeyboardAvoidingView behavior="height" /> 
          : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

/*  RECORD of data set-up
    this.setState ({
      messages: [
        {
          _id: 1,
          text: 'Are you there?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 2,
            text: `${name} is online`,
            createdAt: new Date(),
            system: true,
           },
        ],
      })*/