import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

//Buttons cannot be styled in native-react - using component Pressable
//to create a Button component for the Start page

export default function ChatButton(props) {
  const {onPress, title = 'Start Chatting' } = props;
  return (
    <Pressable 
      style={styles.chatButton}
      onPress={onPress}
      >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '88%',
    height: 50,
    borderRadius: 2,
    backgroundColor: '#757083',
    elevation: 3
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF'
  },
});
