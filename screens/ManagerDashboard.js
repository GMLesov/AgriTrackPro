import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart } from 'react-native-chart-kit';

export default function ManagerDashboard() {
  const [animalCount, setAnimalCount] = useState(0);
  const [cropCount, setCropCount] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const animals = await getDocs(collection(db, 'animals'));
      const crops = await getDocs(collection(db, 'crops'));
      const tasks = await getDocs(collection(db, 'tasks'));

      setAnimalCount(animals.size);
      setCropCount(crops.size);
      setPendingTasks(tasks.docs.filter(doc => !doc.data().completed).length);
    };

    loadStats();
  }, []);

  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: ['Animals', 'Crops', 'Tasks'],
    datasets: [
      {
        data: [animalCount, cropCount, pendingTasks],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Manager Dashboard</Text>

      <BarChart
        data={chartData}
        width={screenWidth - 30}
        height={220}
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: () => '#000',
        }}
        style={styles.chart}
      />

      <Text style={styles.label}>🐄 Total Animals: {animalCount}</Text>
      <Text style={styles.label}>🌾 Total Crops: {cropCount}</Text>
      <Text style={styles.label}>📝 Pending Tasks: {pendingTasks}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginVertical: 4 },
  chart: { marginVertical: 20, borderRadius: 10 },
});
