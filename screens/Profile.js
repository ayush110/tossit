import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { Button, Tab } from 'react-native-elements';
import { getAuth, signOut } from 'firebase/auth';
function Profile() {
    const { user } = useAuthentication();
  const auth = getAuth();
  return (
      <View>
    <Text>Welcome {user?.email}!</Text>

      <Button title="Sign Out" onPress={() => signOut(auth)}/>
      </View>
  )
}

export default Profile