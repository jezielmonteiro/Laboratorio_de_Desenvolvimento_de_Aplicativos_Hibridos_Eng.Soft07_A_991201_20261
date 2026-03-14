import { StatusBar } from 'expo-status-bar';
import { Keyboard, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import AddItem from './src/add';
import ListItems from './src/list';
import { v4 as uuidv4 } from 'uuid';
import "react-native-get-random-values";
import Toast from 'react-native-toast-message';

export default function App() {
  
  const [list, setList] = useState([]);

  const addItem = (text) => {

    if (text == '') {
      Toast.show({
        type: 'error',
        text1: 'Valor Vazio',
      });
    } else {
      const newItem = {
        id: uuidv4(),
        task: text,
      };
      setList([newItem, ...list]);
    }
  };

  const deleteItem = (id) => {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Lista To Do</Text>
        <AddItem addItem={addItem}></AddItem>
        <ListItems deleteItem={deleteItem} listItems={list}></ListItems>
        <StatusBar style="auto" />
        <Toast 
          position='top'
          bottomOffset={20}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '600',
  },
});