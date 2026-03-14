import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, Keyboard } from "react-native";

export default function addItem(props) {

    const [item, setItem] = useState('');

    return (
        <View>
            <Text style={styles.text}>Entre com o próximo item</Text>
            <TextInput
                value={item}
                onChangeText={(textVal) => {
                    setItem(textVal);
                }}
                style={styles.input}
            />
            <Button
                onPress={() => {
                    props.addItem(item);
                    setItem('');
                    Keyboard.dismiss();
                }}
                title="Salvar" />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderBottomColor: 'black',
        backgroundColor: '#f4f4f4',
        margin: 4,
    },
    text: {
        fontWeight: 700,
    }
});