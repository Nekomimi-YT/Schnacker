/*Start page displays an input box that saves the input value to the state
When the button is clicked, this state is passed Chat.js as a prop 
for the navigation display*/

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import ChatButton from './ChatButton';

export default class Start extends Component {

  constructor(props) {
    super(props),
    this.state = { 
      name: '',
      bgColor: '',
    }
  }

  render() {
    const { name, bgColor } = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground 
          source={require('../assets/Background_Image.png')}
          resizeMode='cover'
          style={styles.image}>
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Schnacker</Text>
            <View 
              style={styles.viewOne}
              accessible={true}
              accessibilityLabel='Enter your chat username.'>
              <TextInput 
                value={this.state.name}
                style={styles.textInput}
                onChangeText={(name) => this.setState({ name })}
                placeholder={'Your Name'}
              />
              <View style={styles.viewTwo}>
                <Text style={styles.text}>Choose Background Color</Text>
                <View style={styles.viewThree}>
                  {/*Create buttons using TouchableOpacity*/}
                  <TouchableOpacity 
                    style={[styles.box, styles.bgDark]}
                    accessible={true}
                    accessibilityLabel='Almost black'
                    accessibilityHint='Choose almost black as the chat screen background color.'
                    accessibilityRole='button'
                    onPress={() => this.setState({
                      bgColor: '#090C08',
                      }) 
                    }
                  >
                  </TouchableOpacity>
                  <TouchableOpacity  
                    style={[styles.box, styles.bgBrown]}
                    accessible={true}
                    accessibilityLabel='Purple brown'
                    accessibilityHint='Choose purple brown as the chat screen background color.'
                    accessibilityRole='button'
                    onPress={() => this.setState({
                      bgColor: '#474056',
                    })
                  }>
                  </TouchableOpacity>
                  <TouchableOpacity  
                    style={[styles.box, styles.bgBlue]}
                    accessible={true}
                    accessibilityLabel='Silver blue'
                    accessibilityHint='Choose silver blue as the chat screen background color.'
                    accessibilityRole='button'
                    onPress={() => this.setState({
                      bgColor: '#8A95A5',
                    })
                  }>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.box, styles.bgGreen]}
                    accessible={true}
                    accessibilityLabel='Pale green'
                    accessibilityHint='Choose pale green as the chat screen background color.'
                    accessibilityRole='button'
                    onPress={() => this.setState({
                      bgColor: '#B9C6AE',
                    })
                  }>
                  </TouchableOpacity>
              </View>
              </View>
              {/*Create a button using a Pressable component*/}
              <ChatButton 
                onPress={() => this.props.navigation.navigate('Chat', { name: name, bgColor: bgColor })}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  viewOne: {
    width: '88%',
    height: '44%',
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  textInput: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#757083',
    borderRadius: 4,
    width: '88%',
    alignSelf: 'center',
    padding: 8,
    fontSize: 16,
    fontWeight: '300',
    //opacity: '50%', Cannot use this property on Android - Causes error
    color: '#757083',
  },
  viewTwo: {
    width: '88%',
    marginTop: 8,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    //opacity: '100%', Cannot use this property on android - Causes error
  },
  viewThree: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
  },
  box: {
    height: 36,
    width: 36,
    margin: 8,
    borderRadius: 18,
  },
  bgDark: {
    backgroundColor: '#090C08'
  },
  bgBrown: {
    backgroundColor: '#474056'
  },
  bgBlue: {
    backgroundColor: '#8A95A5'
  },
  bgGreen: {
    backgroundColor: '#B9C6AE'
  },
});