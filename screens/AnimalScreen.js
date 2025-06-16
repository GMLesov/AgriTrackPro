import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';

export default function AnimalScreen() {
  const [animals, setAnimals] = useState([]);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [feeding, setFeeding] = useState('');
  const [time, setTime] = useState('');
  const [vaccination, setVaccination] = useState('');
  const route = useRoute();
  const role = route.params?.role || 'worker';

  useEffect(() => {
    const q = query(collection(db, 'animals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnimals(data);
    });

    return unsubscribe;
  }, []);

  const addAnimal = async () => {
    if (!name || !species || !feeding || !time || !vaccination) return;

    const newAnimal = {
      name, species, feeding, time, vaccination,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'animals'), newAnimal);
      setName('');
      setSpecies('');
      setFeeding('');
      setTime('');
      setVaccination('');
    } catch (err) {
      console.error('Error adding animal:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Records</Text>

      {role === 'manager' && (
        <>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Species" value={species} onChangeText={setSpecies} />
          <TextInput style={styles.input} placeholder="Feeding Quantity" value={feeding} onChangeText={setFeeding} />
          <TextInput style={styles.input} placeholder="Feeding Time (HH:MM)" value={time} onChangeText={setTime} />
          <TextInput style={styles.input} placeholder="Vaccination Date (YYYY-MM-DD)" value={vaccination} onChangeText={setVaccination} />
          <Button title="Add Animal" onPress={addAnimal} />
        </>
      )}

      <FlatList
        data={animals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>🐄 {item.name} ({item.species})</Text>
            <Text>🍽 {item.feeding} at {item.time}</Text>
            <Text>💉 Vaccination: {item.vaccination}</Text>
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
    marginVertical: 5, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5,
  },
});
