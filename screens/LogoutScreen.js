import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function LogoutScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        navigation.replace('Login');
      } catch (error) {
        Alert.alert('Logout Error', error.message);
      }
    };

    logout();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
