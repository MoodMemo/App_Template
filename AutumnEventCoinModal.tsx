import React, { useState, useEffect } from 'react';
import { Image, useWindowDimensions, ImageBackground, View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import DatePicker from 'react-native-date-picker';
import PushNotification from "react-native-push-notification";
import MaterialAllIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as amplitude from './AmplitudeAPI';

import {default as Text} from "./CustomText"

const AutumnEventCoinModal = ({isModalVisible,setIsModalVisible,type}:any) => {

    const [autumnEventCoin,setAutumnEventCoin] = useState(0);
    const [randomAutumnEventCoin,setRandomAutumnEventCoin] = useState(0);
    const [autumnEventLevel,setAutumnEventLevel] = useState(1);

    useEffect(()=>{
        if(type==='stamp'){
            AsyncStorage.getItem('@UserInfo:AutumnEventLevel').then((value) => {
                setAutumnEventLevel(Number(value));
            })
            var coin=Math.floor(Math.random()*2)+1;
            setRandomAutumnEventCoin(coin);
            AsyncStorage.getItem('@UserInfo:AutumnEventCoin').then((value) => {
                setAutumnEventCoin(Number(value));
                AsyncStorage.setItem('@UserInfo:AutumnEventCoin',(Number(value)+coin).toString());
                console.log(Number(value)+coin,'은행잎 있음');
            });
            AsyncStorage.getItem('@UserInfo:AutumnEventLevel').then((value) => {
                setAutumnEventLevel(Number(value));
            })
        }
        else{
            AsyncStorage.getItem('@UserInfo:AutumnEventLevel').then((value) => {
                setAutumnEventLevel(Number(value));
            })
            AsyncStorage.getItem('@UserInfo:AutumnEventCoin').then((value) => {
                setAutumnEventCoin(Number(value));
                AsyncStorage.setItem('@UserInfo:AutumnEventCoin',(Number(value)+1).toString());
                console.log(Number(value)+1,'은행잎 있음');
            });
        }
    },[]);

    return(
        <View style={{
            backgroundColor:"#FFFAF4",
            width:340,
            height:335,
            borderRadius:10,
            alignSelf:'center'
        }}>
            <View style={{
                alignSelf:'center',
                width:290,
                borderBottomWidth:1.5,
                borderBottomColor:'#FFCC4D',
                borderStyle:'solid',
                marginTop:30,
                alignItems:'center'}}>
                <Image source={require('./assets/autumn_event_coin.png')} style={{width:45,height:45*98/102}}/>
                <Text style={{color:'#212429',fontSize:20,marginTop:15,marginBottom:30}}>은행잎 {(type==='stamp' ? randomAutumnEventCoin : 1)}개를 획득했습니다!</Text>
            </View>
            <View style={{
                flexDirection:'row',
                justifyContent:'space-between',
                alignSelf:'center',
                width:200,
                marginTop:30,
            }}>
                <Text style={{color:'#212429',fontSize:18}}>이벤트 레벨</Text>
                <Text style={{color:'#FFCC4D',fontSize:18}}>Lv. {autumnEventLevel}</Text>
            </View>
            <View style={{
                flexDirection:'row',
                justifyContent:'space-between',
                alignSelf:'center',
                width:200,
                marginTop:20,
                marginBottom:25,
            }}>
                <Text style={{color:'#212429',fontSize:18}}>은행잎 현황</Text>
                <Text style={{color:'#FFCC4D',fontSize:18}}>{autumnEventCoin+(type==='stamp' ? randomAutumnEventCoin : 1)}개</Text>
            </View>
            <TouchableOpacity onPress={async ()=>{
                amplitude.test1() //은행잎 획득 모달 끔
                setIsModalVisible(!isModalVisible);
            }}
            style={styles.clearBtn}>
                <Text style={{fontSize: 19,color:'#FFFFFF'}}>확인</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    titleContainer: {
      backgroundColor: '#FFFAF4',
      height: 133,
      borderBottomRightRadius: 43,
      // alignItems: 'center', // 가로 정렬
    },
    title: {
      // fontFamily: 'Pretendard',
      color: '#212429',
      fontWeight: '400',
      // 폰트 크기 16px
      width: '100%',
      height: '100%',
      fontSize: 20,
      marginTop: 28,
      marginLeft: 28,
      marginRight: 200,
      marginBottom: 27, // title과 Dropdown 사이 간격 조절
    },
    mooImage: {
      // 이미지 원본 크기
      // width: 100,
      // height: 100,
      width: 80,
      height: 393*79/363 ,
      position: 'absolute',
      top: 55,
      right: 35,
      // 회전
      transform: [{ rotate: '25deg' }],
    },
    options: {
      flexDirection: 'row', // 옵션들을 가로로 배치
      justifyContent: 'space-between', // 옵션들 사이 간격을 동일하게 배치
      alignItems: 'center', // 옵션들을 세로로 가운데 정렬
      marginTop: 32,
      marginHorizontal: 28,
      marginBottom:12
    },
    fixButton: {
      width: 20,
      height: 20,
    },
    button: {
      bottom: '18%',
      width: '30%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 7,
      borderColor:'#72D193',
      borderWidth: 1
    },
    buttonText: {
      color: '#72D193',
      fontSize: 18,
      fontWeight: 'bold'
    },
    eventModalView: {
      width:375,
      height:375*1382/766,
    },
    eventModalDetailBlockView:
    {
      backgroundColor:'#FFFFFF',
      width:320,
      height:160,
      alignSelf:'center',
      alignItems:'center',
      borderColor:'#F9C649',
      borderRadius:10,
      borderWidth:1,
      marginBottom:20
    },
    eventModalMarketBlockView:
    {
      backgroundColor:'#FFFFFF',
      width: 320,
      height:250,
      alignSelf:'center',
      alignItems:'center',
      borderColor:'#F9C649',
      borderRadius:10,
      borderWidth:1,
      marginBottom:20
    },
    eventModalTextBox: {
      backgroundColor: '#FECB4C26',
      width:'90%',
      height:'20%',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:5,
      marginBottom:10
    },
    text: {
        color: '#212429',
        fontSize: 17,
        fontWeight: '800'
    },
    coloredText: {
        color: '#FFA24D',
        fontSize: 17,
        fontWeight: '800'
    },
    clearBtn: {
        alignSelf: 'center',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#FFCC4D',
        width:'90%',
        height:'14%', 
        marginBottom: 16,
        borderRadius: 8,
        marginHorizontal:20,
      },
  });

export default AutumnEventCoinModal;