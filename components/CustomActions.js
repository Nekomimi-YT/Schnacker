import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native'; 
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default class CustomActions extends Component {

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
 
    if(status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
 
      if (!result.cancelled) {
        this.setState({
          image: result
        });  
      }
    }
  }

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY, Permissions.CAMERA);
 
    if(status === 'granted') {
      let result = await ImagePicker.launchCameraAsync()
        .catch(error => console.log(error));
 
      if (!result.cancelled) {
        this.setState({
          image: result
        });  
      }
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
    if(status === 'granted') {
      let result = await Location.getCurrentPositionAsync({})
        .catch(error => console.log(error));
 
      if (result) {
        this.setState({
          location: result
        });
      }
    }
  }

  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage;
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto;
          case 2:
            console.log('user wants to get their location');
            return this.getLocation;
          default:
        }
      },
    );
  };

  render () {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
       <View style={[styles.wrapper, this.props.wrapperStyle]}>
         <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
       </View>
     </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
 });

 CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
 };

 CustomActions = connectActionSheet(CustomActions);