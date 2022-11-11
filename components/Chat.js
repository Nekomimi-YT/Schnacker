import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // retrieves and parses messages from AsyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /* componentDidMount functionality:
    - Uses prop name for navigation header on chat view
    - Retrieves previous messages from AsyncStorage
    - Authorizes user anonymously using firestore */

  componentDidMount(){
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // calls function to get messages from AsyncStorage    
    this.getMessages();

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data (no avatar yet-https://placeimg.com/140/140/any)
      this.setState({
        uid: user.uid,
        messages: [], //commenting this out for now - trying to get the AsyncStorage to show up
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

  componentWillUnmount() {
    this.unsubscribeChatMessagesUser();
    this.authUnsubscribe();
  }

  // adds message and data to firebase 
  addMessage = () => {
    firebase.firestore().collection('messages').add({
      text: this.state.messages,
      createdAt: new Date(),
      user: this.state.user
    });
  }   
  
  // appends the new message to the previousState and calls both database saving 
  // and AsyncStorage saving functions
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessage();
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
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
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
  
  // rendering the Gifted Chat component and Android keyboard fix
  render() {
    let { bgColor, name } = this.props.route.params;
    const { messages } = this.state;
    return (
      <View style={[{backgroundColor: bgColor}, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
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