import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

export default function CropScreen() {
  const [crops, setCrops] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [plantDate, setPlantDate] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const route = useRoute();
  const role = route.params?.role || 'worker';

  useEffect(() => {
    const q = query(collection(db, 'crops'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCrops(data);
    });

    return unsubscribe;
  }, []);

  const addCrop = async () => {
    if (!name || !type || !plantDate || !harvestDate || !fertilizer) return;

    const newCrop = {
      name,
      type,
      plantDate,
      harvestDate,
      fertilizer,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'crops'), newCrop);
      setName('');
      setType('');
      setPlantDate('');
      setHarvestDate('');
      setFertilizer('');
    } catch (err) {
      console.error('Error adding crop:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Records</Text>

      {role === 'manager' && (
        <>
          <TextInput style={styles.input} placeholder="Crop Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Type (e.g., maize)" value={type} onChangeText={setType} />
          <TextInput style={styles.input} placeholder="Planting Date" value={plantDate} onChangeText={setPlantDate} />
          <TextInput style={styles.input} placeholder="Harvest Date" value={harvestDate} onChangeText={setHarvestDate} />
          <TextInput style={styles.input} placeholder="Fertilizer Plan" value={fertilizer} onChangeText={setFertilizer} />
          <Button title="Add Crop" onPress={addCrop} />
        </>
      )}

      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>🌱 {item.name} ({item.type})</Text>
            <Text>📅 Plant: {item.plantDate} | Harvest: {item.harvestDate}</Text>
            <Text>🧪 Fertilizer: {item.fertilizer}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 5,
  },
  record: {
    marginVertical: 5, padding: 10, backgroundColor: '#f0f8ff', borderRadius: 5,
  },
});
