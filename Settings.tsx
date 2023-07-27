import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import SettingsComponent from './SettingsComponent';

const Settings = () => {
    const settingsOptions=[
      {title:"채널톡 연동", onPress: () => {}},
      {title:"개인정보 설정", onPress: () => {}},
      {title:"알림 설정", onPress: () => {}},
      {title:"개발자에게 문의하기", onPress: () => {}},
      {title:"개발자에게 커피 사주기", onPress: () => {}},
    ]
    return (
      <SettingsComponent settingsOptions={settingsOptions}/>
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

export default Settings;