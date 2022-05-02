import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { Button, Tab } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';
import { Dimensions } from 'react-native';
import {setDoc, doc, getDoc} from 'firebase/firestore'; 
import { db } from '../config/firebase';

import {
  PieChart,
} from "react-native-chart-kit";


async function getData() {
  const userTemp = getAuth().currentUser;
  const docSnap = await getDoc(doc(db, "users", userTemp.uid));

  return [
    {
      name: "Garbage",
      population: docSnap.data()['Garbage'],
      color: "#021012",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Recycling",
      population: docSnap.data()['Organic'],
      color: "light green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Compost",
      population: docSnap.data()['Recycling'],
      color: "light blue",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];
}

function Profile() {

  const { user } = useAuthentication();
  const auth = getAuth();
  
  const screenWidth = Dimensions.get("window").width;

  const data = getData()
  data.then(data2 => console.log(data2));
  // Promise.allSettled([data]).then((results) => results.forEach((result) => console.log(result.status)));



  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
      <View>
      <Text>Welcome {user?.email}!</Text>

      <Button title="Sign Out" onPress={() => signOut(auth)}/>


      <PieChart
        data={getData()}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        bgColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 50]}
        absolute
      />


      </View>
  )
}

export default Profile