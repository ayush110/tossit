import { useState, useEffect} from "react";
import { Platform, View, Text, StyleSheet, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import {setDoc, doc, getDoc} from 'firebase/firestore'; 
import { db } from '../config/firebase';
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
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    
    // Explore the result
  
    if (!result.cancelled) {
      setPickedImage(result);
      // console.log(pickedImage);
      

      const url = 'http://127.0.0.1:8000/predict';
      let classOfImage = '';

      // Perform the request. Note the content type - very important
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          //'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'data': result.uri})
      }).then(res => res.json()).then(res => {
        setPrediction(res['class'])
        classOfImage = res['class']
      }).catch(error => {
        console.error(error);
      });

      console.log(classOfImage)
      const user = getAuth().currentUser;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      const date = new Date().toLocaleString()
      const lineData = docSnap.data()["linegraph"];

      
      let newTotal = 0; 

      if (docSnap.exists() && classOfImage in docSnap.data()) {
        newTotal = docSnap.data()[classOfImage]+1
      } 
      else {
        newTotal = 1
      }

      let docData = {}
      docData[classOfImage] = newTotal;

      const lineGraphData = {
        Garbage: 0,
        Recycling: 0,
        Organic: 0
      }
      const newDate = date.split(' ')[0];

      if (newDate in lineData){
        console.log(true)
      } else{
        console.log(false)
        await setDoc(doc(db, "users", user.uid, "linegraph"), lineGraphData, { merge: true })
        
      }


      await setDoc(doc(db, "users", user.uid), docData, { merge: true })


      




            
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // setPrediction("NUMBER 2")
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
  
    if (!result.cancelled) {
      setPickedImage(result);
      // console.log(pickedImage);

      const url = 'http://127.0.0.1:8000/predict';

      // Perform the request. Note the content type - very important
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          //'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'data': result.uri})
        }).then(res => res.json()).then(res => setPrediction(res['class'])).catch(error => {
                                                        console.error(error);
                                                        });

      /* axios.post('http://127.0.0.1:8000/predict/', {
          result
            })
            .then(function (response) {
                setPrediction(response)
               
            })
            .catch(function (error) {
                console.log(error, 'error');
            }); */
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

  