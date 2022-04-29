import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {getFirestore, setDoc, doc, collection} from 'firebase/firestore'; 
import { db } from '../config/firebase';
const auth = getAuth();




export default function SignUpScreen({navigation}) {


const [value, setValue] = React.useState({
    email: '',
    password: '',
    error: ''
  })
  async function signUp() {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email and password are mandatory.'
      })
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, value.email, value.password)
      .then(async cred => {
        
        navigation.navigate('Sign In'),

        await setDoc(doc(db, "users", cred.user.uid), {
          Organic: 0,
          Garbage: 0,
          Recycling: 0
        })
        
      }
        );
      
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      })
    }
}
  return (
    <View style={styles.container}>
      <Text>Signup screen!</Text>

      {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

      <View style={styles.controls}>
        <TextInput
          placeholder='Email'
          containerStyle={styles.control}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon
            name='envelope'
            size={16}
          />}
        />

        <TextInput
          placeholder='Password'
          containerStyle={styles.control}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon
            name='key'
            size={16}
          />}
        />

        <Button title="Sign up" buttonStyle={styles.control} onPress={signUp} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    controls: {
      flex: 1,
    },
  
    control: {
      marginTop: 10
    },
  
    error: {
      marginTop: 10,
      padding: 10,
      color: '#fff',
      backgroundColor: '#D54826FF',
    }
  });