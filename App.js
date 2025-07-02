import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import React from 'react';
import MainNavigator from './navigation/MainNavigator';

export default function App() {
  useEffect(() => {
    async function getPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Notification permission not granted');
      }
    }

    getPermissions();
  }, []);

  return <MainNavigator />;
}
