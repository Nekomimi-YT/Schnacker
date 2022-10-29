import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  //use prop name for nav header  
  //set.State to static message so all elemens of the UI can be viewed
  componentDidMount(){
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    this.setState ({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 2,
            text: 'This is a system message',
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


  render() {
    let { bgColor } = this.props.route.params;
    const { messages } = this.state;
    return (
      <View style={[{backgroundColor: bgColor}, styles.container]}>
        <GiftedChat
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
    flex: 1,
  },
});