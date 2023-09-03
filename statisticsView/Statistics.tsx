import React, { useState } from 'react';
import { Dimensions, Image, View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch, Linking, StatusBar} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from '../src/localDB/document';
import * as repository from '../src/localDB/document';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as amplitude from '../AmplitudeAPI';


const test = () => {
  console.log('hello');
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Statistics = () => {

    // const handleOpenLink = async () => {
    //     const url = 'http://pf.kakao.com/_xhGnxgxj'; // 원하는 웹 링크
    
    //     // 웹 링크를 열기 위해 Linking.openURL()을 사용합니다.
    //     const supported = await Linking.canOpenURL(url);
    
    //     if (supported) {
    //       await Linking.openURL(url);
    //     } else {
    //       console.log("Don't know how to open URL: " + url);
    //     }
    //   };
   
  

    return (
      <View style={{backgroundColor:'#FFFFFF',flex:1}}>
        {/* <StatusBar
            backgroundColor="#FFFFFF"
            barStyle={'dark-content'}
        /> */}
        <View style={styles.titleContainer}>
        {/* 드롭다운 컴포넌트 */}
            <Text style={styles.title}>dd</Text>
        </View>
        <Image 
                source={require('../assets/magnifyingMoo.png')}
                style={{ width: 154*0.5, height: (154 * 192)*0.5 / 154 , position: 'relative', bottom: '15.7%', left: windowWidth-110, overflow: 'hidden'}}></Image>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    titleContainer: {
        backgroundColor: '#FAFAFA',
        height: 133,
        borderBottomRightRadius: 43,
        // alignItems: 'center', // 가로 정렬
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
    confirmBtn: {
        alignSelf: 'center',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#72D193', 
        borderRadius: 8,
        flex: 1,
        
    },
    memoContent: { 
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'column',
        display: 'flex',
        // width: 320,
        paddingHorizontal: 16,
        paddingVertical: 10,
        // gap: 6,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // borderRadius: 6,
      },
  });

export default Statistics;