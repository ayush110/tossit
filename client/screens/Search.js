import { useState, useEffect, useRef } from "react";
import { Platform, View, Text, StyleSheet, Image, Button } from "react-native";
// import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";

import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { getAuth } from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  FieldValue,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import axios from "axios";

export default function Search() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = async () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
      let formdata = new FormData();
      formdata.append("photo", {
        uri: photo.uri,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const url = "http://127.0.0.1:5000/predict";

      fetch(url, {
        method: "POST",
        headers: {
          //'Accept': 'application/json',
          "Content-Type": "application/json",
        },
        body: formdata,
      })
        .then((res) => res.json())
        .then((res) => {
          setPrediction(res["class"]);
          classOfImage = res["class"];
        })
        .catch((error) => {
          console.error(error);
        });

      console.log(classOfImage);
    };

    //     const user = getAuth().currentUser;

    //     const docSnap = await getDoc(doc(db, "users", user.uid));
    //     const date = new Date().toLocaleString();
    //     let lineData = {};
    //     if ("linegraph" in docSnap.data()) {
    //       lineData = docSnap.data()["linegraph"];
    //     } else {
    //       let linegraph = {};
    //       await setDoc(doc(db, "users", user.uid), linegraph, { merge: true });
    //     }

    //     let newTotal = 0;

    //     if (docSnap.exists() && classOfImage in docSnap.data()) {
    //       newTotal = docSnap.data()[classOfImage] + 1;
    //     } else {
    //       newTotal = 1;
    //     }

    //     let docData = {};
    //     docData[classOfImage] = newTotal;

    //     let day = date.split(" ")[0].slice(0, -1);

    //     let Garbage = 0;
    //     let Recycling = 0;
    //     let Organic = 0;

    //     let lineGraphData = {
    //       linegraph: {
    //         [day]: {
    //           Recycling: Recycling,
    //           Garbage: Garbage,
    //           Organic: Organic,
    //         },
    //       },
    //     };

    //     if (day in lineData) {
    //       lineGraphData = {
    //         linegraph: {
    //           [day]: {
    //             Recycling: lineData[day]["Recycling"],
    //             Garbage: lineData[day]["Garbage"],
    //             Organic: lineData[day]["Organic"],
    //           },
    //         },
    //       };
    //       lineGraphData["linegraph"][day][classOfImage] += 1;
    //       await setDoc(doc(db, "users", user.uid), lineGraphData, {
    //         merge: true,
    //       });
    //     } else {
    //       lineGraphData["linegraph"][day][classOfImage] += 1;
    //       await setDoc(doc(db, "users", user.uid), lineGraphData, {
    //         merge: true,
    //       });
    //     }

    //     await setDoc(doc(db, "users", user.uid), docData, { merge: true });
    //     await updateDoc(
    //       doc(db, "users", user.uid),
    //       { Timestamp: serverTimestamp() },
    //       { merge: true }
    //     );
    //   }
    // };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
