import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Chat extends Component {
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