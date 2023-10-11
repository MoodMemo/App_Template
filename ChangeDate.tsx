import React, { useState } from 'react';
import { useWindowDimensions, View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';

import * as amplitude from './AmplitudeAPI';

import {default as Text} from "./CustomText"

const ChangeDate = () => {
    const [showingBirthday,setShowingBirthday] = useState('');
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [birthday, setBirthday] = useState(new Date());

    const formatDate = (rawDate:Date) => {
        let date = new Date(rawDate);
        return `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')}`
    }

    AsyncStorage.getItem('@UserInfo:birthShow').then(data => {
        setShowingBirthday(String(data));
    })

    return (
        <View>
            <View style={{paddingBottom: 30,}}>
                <TouchableOpacity onPress={() => {
                    amplitude.setProfileBirthday();
                    setIsDatePickerVisible(!isDatePickerVisible);
                }}
                style={{paddingBottom:10}}>
                    <Text style={{fontSize:20, paddingHorizontal:10, color: '#666666'}}>{showingBirthday}</Text>
                </TouchableOpacity>
                <Divider style={{backgroundColor:'#E2E2E2',width:'100%'}}/>
                <Divider style={{backgroundColor:'#E2E2E2',width:'100%'}}/>
                <Divider style={{backgroundColor:'#E2E2E2',width:'100%'}}/>
            </View>
            <Modal isVisible={isDatePickerVisible}
                animationIn={"fadeIn"}
                animationInTiming={200}
                animationOut={"fadeOut"}
                animationOutTiming={200}
                onBackdropPress={() => {
                    setIsDatePickerVisible(!isDatePickerVisible);
                }}
                backdropColor='#CCCCCC'//'#FAFAFA'
                backdropOpacity={0.8}
                style={{
                    alignItems:'center'
                }}>
                <View style={{
                        backgroundColor:"#FFFFFF",
                        width:340,
                        height:340,
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                        paddingTop: 20,
                        justifyContent:'space-between',
                        //alignItems:'center',
                        borderRadius:10
                        }}>
                    <View style={{
                        paddingBottom: 20,
                        }}>
                            <Text style={{fontSize: 19, color:"#495057"}}>생일 입력</Text>
                    </View>
                    <View style={{
                        paddingBottom: 20,
                        alignItems:'center',
                        }}>
                        <DatePicker date={birthday}
                        onDateChange={(changedDate) => {
                            setBirthday(changedDate);}}
                        mode='date'
                        theme='light'/>
                    </View>
                    <TouchableOpacity style={{alignItems:'center',}}
                    onPress={async ()=>{
                        await AsyncStorage.setItem('@UserInfo:birthShow', formatDate(birthday));
                        setIsDatePickerVisible(!isDatePickerVisible);
                    }}>
                        <Text style={{paddingBottom: 20, fontSize: 19,}}>저장</Text>
                    </TouchableOpacity>  
                </View>     
            </Modal>
        </View>
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
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 10,
      paddingBottom: 15
    },
    input: {
      fontSize:20,
      color: '#666666',
      width: '100%',
      padding: 10,
      marginBottom: 20,
      borderBottomWidth:1,
      borderBottomColor:'#E2E2E2',
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
  
export default ChangeDate;