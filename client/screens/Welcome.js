import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

export default function WelcomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.tossit}>toss it</Text>

      <View style={styles.buttons}>
        <Button title="Sign in" buttonStyle={styles.buttonx} onPress={() => navigation.navigate('Sign In')} />
        </View>
<View style={styles.buttons}>
        <Button title="Sign up" buttonStyle={styles.buttonx} onPress={() => navigation.navigate('Sign Up')} />
        </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',

  },
  tossit: {
    fontSize: 50,
    color: '#006400',
    marginBottom: 20,
  },
  buttons: {
    
    
  },
  buttonx: {
    width: 180,
    textDecorationColor: 'white',
    color: 'white',
    marginBottom: 10,
    borderColor: '#FFFFFF',
    backgroundColor: '#006400',
    borderRadius: 93,
  }
});