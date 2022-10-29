import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    return (
      <View style={[{backgroundColor: bgColor}, styles.container]}>
        <Text style={{color:'orange'}}>Chat Screen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});