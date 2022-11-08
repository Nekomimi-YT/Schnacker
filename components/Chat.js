import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }

    const firebaseConfig = {
      apiKey: "AIzaSyAtxv7-Zb2QEFC8m8X9GXmTUStVKeLEdwc",
      authDomain: "test1-firestore-9c2af.firebaseapp.com",
      projectId: "test1-firestore-9c2af",
      storageBucket: "test1-firestore-9c2af.appspot.com",
      messagingSenderId: "766452589307",
      appId: "1:766452589307:web:a8165d68fb7697ff09865e"
    };

    // Initialize Firebase
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  /*
  - use prop name for nav header  
  - setState to static message so all elements of the UI can be viewed
  - use name prop to personalize online system message */

  componentDidMount(){
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
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
      })
    }

  //appends the new message sent to the previousState
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

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
    let { bgColor } = this.props.route.params;
    const { messages } = this.state;
    return (
      <View style={[{backgroundColor: bgColor}, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={ messages }
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
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