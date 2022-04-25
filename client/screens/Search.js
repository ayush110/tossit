import { useState, useEffect} from "react";
import { Platform, View, Text, StyleSheet, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
export default function Search() {

   // The path of the picked image
  const [pickedImage, setPickedImage] = useState('');
  const [prediction, setPrediction] = useState('');
  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    
    // Explore the result
  
    if (!result.cancelled) {
      setPickedImage(result);
      console.log(pickedImage);
      /*let formData = new FormData();

      formData.append('image', {
      //  uri: Platform.OS === 'android' ? pickedImage.uri : pickedImage.uri.replace('file://', ''),
        uri: pickedImage
      //  type: pickedImage.type,
       
      });

      console.log(formData);

      let img = new FormData()
      img.append('image', fs.createReadStream('/C:/Users/ayush/Downloads/10179760-gr.jpg'));

      axios.post('http://127.0.0.1:8000/predict', img, {
        headers: {'Content-Type': 'multipart/form-data'}, })
            .then(function (response) {
                setPrediction(response)
                
            })
            .catch(function (error) {
                console.log(error, 'error');
            });*/
    
            const image = {
              uri: result.uri,
              type: 'image/jpg',
              name: 'formData'
            }
            console.log(image)
            // Instantiate a FormData() object
            const imgBody = new FormData();
            // append the image to the object with the title 'image'
            imgBody.append('image', image);
            const url = `http://127.0.0.1:8000/predict`;
            // Perform the request. Note the content type - very important
            let response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
              body: imgBody
              }).then(res => res.json()).then(results => {
                // Just me assigning the image url to be seen in the view
               console.log(results)
            }).catch(error => {
              console.error(error);
            });
            console.log(response)
    }
        }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
  
    if (!result.cancelled) {
      setPickedImage(result);
      
      
      axios.post('http://127.0.0.1:8000/predict/', {
          result
            })
            .then(function (response) {
                setPrediction(response)
               
            })
            .catch(function (error) {
                console.log(error, 'error');
            });
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={showImagePicker} title="Select an image" />
        <Button onPress={openCamera} title="Open camera" />
      </View>

      <View style={styles.imageContainer}>
        {
          pickedImage !== '' && <Image
            source={{ uri: pickedImage.uri }}
            style={styles.image}
          />
          
        }
        <Text>{prediction}</Text>
      </View>
    </View>
  );
    };

    
const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      width: 400,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    imageContainer: {
      padding: 30
    },
    image: {
      width: 400,
      height: 300,
      resizeMode: 'cover'
    }
  });

  