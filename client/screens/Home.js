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
  let [datagraph, SetDataGraph] = useState([0,0,0,0,0,0,0])
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

async function getLabelData(date) {
  const userTemp = getAuth().currentUser;
  await getDoc(doc(db, "users", userTemp.uid)).then((docSnap) =>{
    let garbage = docSnap.data()['Garbage']
    let recycling = docSnap.data()['Recycling']
    let organic = docSnap.data()['Organic']
    
    SetDataGraph([garbage, recycling, organic])
  }
  );
 
 
}

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

function Last7Days () {
  var result = [];
  for (var i=6; i>=0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push( d.toLocaleString().split(' ')[0].slice(0,-1) )
  }

  return(result);
}
let dataSets = []
let firebaseLabels = Last7Days();
firebaseLabels.forEach(async (element, index) =>  {
  
  await getLabelData(element)
  dataSets.push(
    {
      data: [
      datagraph[0],
      datagraph[1],
      datagraph[2]
    ]
  }
  )

});




let label = Last7Days();
label.forEach((element, index) => {label[index] = element.slice(0,-5)});

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
      labels: label,
      datasets: [
        {
        data:[
          0,
          1,
          2,
          3,
          4,
          5,
          6
        ]
      },
      {
        data:[
          0,
          1,
          2
        ]
      },

    ]
    }}
    width={screenWidth - 10} // from react-native
    height={220}
    
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={chartConfig}
    bezier
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
