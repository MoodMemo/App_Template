import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import Modal from "react-native-modal";



const KakaoChannel = () => {

    const [channelId, setId] = useState('');

    return (
        <Modal>
            <View style={{ flex: 1 }}>
                <Text>I am the modal content!</Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    view: {
      position: 'relative',
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      flex:1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 20,
    },
    button: {
      position: 'absolute',
      bottom: 20,
      width: '90%',
      alignItems: 'center',
      backgroundColor: '#EFEFEF',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
    },
  });

export default KakaoChannel;