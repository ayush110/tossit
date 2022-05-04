import React, {useState, useEffect} from 'react'
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




function Profile() {
  useEffect(()=>{
    getData();
  })
  
  const [pieData, setPieData] = useState([0,0,0])
  const { user } = useAuthentication();
  const auth = getAuth();
  
  const screenWidth = Dimensions.get("window").width;
/*
  const data = getData()
  console.log(data)
  data.then(data2 => console.log(data2));
*/
  // Promise.allSettled([data]).then((results) => results.forEach((result) => console.log(result.status)));

const getData = async () => {
  const userTemp = getAuth().currentUser;
  await getDoc(doc(db, "users", userTemp.uid)).then((docSnap) =>{
    let garbage = docSnap.data()['Garbage']
    let recycling = docSnap.data()['Recycling']
    let organic = docSnap.data()['Organic']
    
    setPieData([garbage, recycling, organic])

    
  }
    
  );
};

const dataPie = [
  {
    name: "Garbage",
    population: pieData[0],
    color: "#021012",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Recycling",
    population: pieData[1],
    color: "light green",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Compost",
    population: pieData[2],
    color: "light blue",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }
];

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
        data={dataPie}
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