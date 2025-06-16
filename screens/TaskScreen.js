import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, Switch,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [worker, setWorker] = useState('');
  const [task, setTask] = useState('');
  const [day, setDay] = useState('');
  const route = useRoute();
  const role = route.params?.role || 'worker';

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(data);
    });

    return unsubscribe;
  }, []);

  const assignTask = async () => {
    if (!worker || !task || !day) return;

    const newTask = {
      worker,
      task,
      day,
      completed: false,
      note: '',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'tasks'), newTask);
      setWorker('');
      setTask('');
      setDay('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const toggleCompletion = async (id, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, { completed: !currentStatus });
    } catch (err) {
      console.error('Error updating completion:', err);
    }
  };

  const updateNote = async (id, newNote) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, { note: newNote });
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Assignments</Text>

      {role === 'manager' && (
        <>
          <TextInput style={styles.input} placeholder="Worker Name" value={worker} onChangeText={setWorker} />
          <TextInput style={styles.input} placeholder="Task Description" value={task} onChangeText={setTask} />
          <TextInput style={styles.input} placeholder="Day (e.g., Monday)" value={day} onChangeText={setDay} />
          <Button title="Assign Task" onPress={assignTask} />
        </>
      )}

      <Text style={styles.subtitle}>Rota</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>👷 {item.worker}</Text>
            <Text>🗓 {item.day} - {item.task}</Text>
            <View style={styles.row}>
              <Text>✅ Done:</Text>
              <Switch
                value={item.completed}
                onValueChange={() => toggleCompletion(item.id, item.completed)}
              />
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Notes / Feed / Harvest Amount"
              value={item.note}
              onChangeText={(text) => updateNote(item.id, text)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { marginTop: 20, fontSize: 16, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 5
  },
  noteInput: {
    borderWidth: 1, borderColor: '#aaa', padding: 6, marginTop: 6, borderRadius: 5, backgroundColor: '#fff'
  },
  record: {
    marginVertical: 5, padding: 10, backgroundColor: '#e0f7fa', borderRadius: 5
  },
  row: {
    flexDirection: 'row', alignItems: 'center', marginTop: 5
  },
});
