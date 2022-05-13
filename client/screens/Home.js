import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { Button, Tab } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './Search';
import Profile from './Profile';
import { Dimensions } from 'react-native';
import {setDoc, doc, getDoc} from 'firebase/firestore'; 
import { db } from '../config/firebase';

import {
  PieChart,LineChart,
} from "react-native-chart-kit";


const Stack = createStackNavigator();

export default function HomeScreen() {
  useEffect(()=>{
    getData();
  })
  
  const [pieData, setPieData] = useState([0,0,0])
  const [lineData, setLineData] = useState({})
  
  const screenWidth = Dimensions.get("window").width;

  const getData = async () => {
    const userTemp = getAuth().currentUser;
    await getDoc(doc(db, "users", userTemp.uid)).then((docSnap) =>{
      let garbage = docSnap.data()['Garbage']
      let recycling = docSnap.data()['Recycling']
      let organic = docSnap.data()['Organic']
      
      setPieData([garbage, recycling, organic])

      if ('linegraph' in docSnap.data()) {
        setLineData(docSnap.data()['linegraph']);
      }
      else {
        setLineData({});
      }
    });
  };

  const dataPie = [
    {
      name: "Garbage",
      population: pieData[0],
      color: "#808080",
      legendFontColor: "black",
      legendFontSize: 15
    },
    {
      name: "Recycling",
      population: pieData[1],
      color: "#ADD8E6",
      legendFontColor: "black",
      legendFontSize: 15
    },
    {
      name: "Compost",
      population: pieData[2],
      color: "#013220",
      legendFontColor: "black",
      legendFontSize: 15
    }
  ];

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2 // optional, default 3
  }

  const tempDate = new Date().toLocaleString();
  let date = tempDate.split(', ')[0];
  let day = parseInt(date.split('/')[0]);
  let month = parseInt(date.split('/')[1]);
  let year = parseInt(date.split('/')[2]);
  let lineGraphLabels = []
  let recycleLineData = []
  let garbageLineData = []
  let compostLineData = []

  for (let i=0; i<7; i++) {
    if (day < 0) {
      month -= 1
      if (month <= 0) {
        month = 12;
        year -= 1;
      }
      day = [31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30][month-1]
    }
    date = ('' + day) + '/' + ('' + month)+ '/' + ('' + year);
    lineGraphLabels.push(date);
    day -= 1;
    
    if (date in lineData) {
      recycleLineData.push(lineData[date]['Recycling']);
      garbageLineData.push(lineData[date]['Garbage']);
      compostLineData.push(lineData[date]['Organic']);
    }
    else {
      recycleLineData.push(0);
      garbageLineData.push(0);
      compostLineData.push(0);
    }

  }
  lineGraphLabels = lineGraphLabels.reverse();
  recycleLineData = recycleLineData.reverse();
  garbageLineData = garbageLineData.reverse();
  compostLineData = compostLineData.reverse();


  return (
      <View>
     
      <Text>Waste Disposal Data</Text>

      <PieChart
        data={dataPie}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor="transparent"
        paddingLeft={"15"}
        //center={[10, 50]}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />


<LineChart
    data={{
      labels: lineGraphLabels,
      datasets: [
        {
          data: recycleLineData,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2 // optional
        },
        {
          data: garbageLineData,
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // optional
          strokeWidth: 2 // optional
        },
        {
          data: compostLineData,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // optional
          strokeWidth: 2 // optional
        },
      ],
      legend: ["Recycling", "Garbage", "Compost"]
    }}
    width={screenWidth - 10} // from react-native
    height={220}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={chartConfig}
    //bezier   only for curved line
    style={{
      marginVertical: 8,
      justifyContent: "center",
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 16
    }}
  />

      </View>
  )

}
