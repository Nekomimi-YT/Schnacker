import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native'; 
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends Component {

  // access user images on device
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    try {
      if(status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
  
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // access camera, take photo, access that photo
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY, Permissions.CAMERA);
    try {
      if(status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
  
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // access user device location
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
      if(status === 'granted') {
        let result = await Location.getCurrentPositionAsync({})
          .catch(error => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);  
        if (result) {
          this.props.onSend({ 
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude
            }
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

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
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };

  render () {
    return (
      <TouchableOpacity 
        style={[styles.container]} 
        accessible={true}
        accessibilityLabel='Send images or location'
        accessibilityHint='Open a menu to send a photo from your camera, media library or share your location.'
        accessibilityRole='button'
        onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 20,
    borderColor: '#8A95A5',
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: '#090C08',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
 });

 CustomActions.contextTypes = {
  actionSheet: PropTypes.func
 };

 CustomActions = connectActionSheet(CustomActions);