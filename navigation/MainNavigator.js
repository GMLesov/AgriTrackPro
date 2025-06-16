import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import AnimalScreen from '../screens/AnimalScreen';
import CropScreen from '../screens/CropScreen';
import TaskScreen from '../screens/TaskScreen';
import LogoutScreen from '../screens/LogoutScreen';
import ManagerDashboard from '../screens/ManagerDashboard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ role }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Animals" component={AnimalScreen} />
      <Tab.Screen name="Crops" component={CropScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      {role === 'manager' && (
        <Tab.Screen name="Dashboard" component={ManagerDashboard} />
      )}
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      setRole(storedRole || 'worker');
    };
    fetchRole();
  }, []);

  if (role === null) return null; // Could show a splash screen here

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {(props) => <MainTabs {...props} role={role} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
