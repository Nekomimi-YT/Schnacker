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

  componentDidMount(){
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
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