import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { Button, Tab } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';
import { Dimensions } from 'react-native';
import {setDoc, doc, getDoc} from 'firebase/firestore'; 
import { db } from '../config/firebase';

import {
  PieChart,LineChart,
} from "react-native-chart-kit";




function Profile() {
  
 
  const { user } = useAuthentication();
  const auth = getAuth();
  
  const screenWidth = Dimensions.get("window").width;
/*
  const data = getData()
  console.log(data)
  data.then(data2 => console.log(data2));
*/
  // Promise.allSettled([data]).then((results) => results.forEach((result) => console.log(result.status)));



  return (
      <View>
      <Text>Welcome {user?.email}!</Text>

      <Button title="Sign Out" onPress={() => signOut(auth)}/>
  </View>
  )
}

export default Profile