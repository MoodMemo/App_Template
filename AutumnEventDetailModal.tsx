import React, { useState } from 'react';
import { Image, useWindowDimensions, ImageBackground, View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import DatePicker from 'react-native-date-picker';
import PushNotification from "react-native-push-notification";
import MaterialAllIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as amplitude from './AmplitudeAPI';

import {default as Text} from "./CustomText"

const AutumnEventDetailModal = ({isModalVisible,setIsModalVisible}:any) => {

    return(
      <View style={{width:360,height:580,top:-30}}>
      <Image source={require('./assets/autumn_event_modal_background.png')} style={{position:'absolute',resizeMode:'stretch',alignSelf:'center',width:400,height:700}}/>
      <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:15, marginLeft:20, marginRight:20, marginBottom:15}}>
            <View style={{flexDirection:'row'}}>
                <MaterialAllIcons name='wallet-giftcard' color={'#FFA24D'} size={35}/>
                <Text style={[styles.text,{marginLeft:10,marginTop:(Platform.OS==='android' ? 5 : 8)}]}>무드메모 <Text style={styles.coloredText}>가을 이벤트</Text> 안내</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setIsModalVisible(!isModalVisible);
              amplitude.cancelEventInfoModalByBackDrop();//이벤트 배너 끔
            }}>
                <MaterialAllIcons name='close' color={'#FFFFFF'} size={35}/>
            </TouchableOpacity>
        </View>
        <View>
          <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={true}>
          <View style={{alignItems:'center',marginTop:10}}>
            <Text style={{fontWeight:'100',color:'#212429',fontSize:15}}>가을을 맞아 무드메모에서 특별한 이벤트를 준비했어요!</Text>
            <Text style={{fontWeight:'100',color:'#212429',fontSize:15,marginTop:10}}>무에게 은행잎을 가져다주고, 다양한 선물을 가져가세요!</Text>
            <Text style={{fontWeight:'100',color:'#212429',fontSize:15,marginTop:10,marginBottom:30}}>이벤트 기간 : 10/24(화) ~ 11/13(월)</Text>
          </View>
          <View style={styles.eventModalDetailBlockView}>
            <Text style={{fontWeight:'100',color:'#212429',fontSize:15,marginTop:20,marginBottom:20}}>은행잎 획득 조건</Text>
            <View style={styles.eventModalTextBox}>
              <Text style={{color:'#212429',fontSize:14}}>(하루 1회) 스탬프 생성 완료 시</Text>
            </View>
            <View style={styles.eventModalTextBox}>
              <Text style={{color:'#212429',fontSize:14}}>(하루 1회) 일기 생성(작성) 완료 시</Text>
            </View>
          </View>
          <View style={styles.eventModalMarketBlockView}>
            <Text style={{fontWeight:'100',color:'#212429',fontSize:15,marginTop:20,marginBottom:25}}>은행잎 상점 상품 및 가격 안내</Text>
            {/* <View style={{flexDirection:'row', justifyContent:'space-between',width:'90%',marginBottom:15}}>
              <Text style={{color:'#212429',fontSize:14}}>감정 표현</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between',width:60}}>
                <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>5개</Text>
              </View>
            </View> */}
            <View style={{flexDirection:'row', justifyContent:'space-between',width:'90%',marginBottom:15}}>
              <Text style={{color:'#212429',fontSize:14}}>아몬드 빼빼로 <Text>(총 30개)</Text></Text>
              <View style={{flexDirection:'row', justifyContent:'space-between',width:60}}>
                <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>10개</Text>
              </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between',width:'90%',marginBottom:15}}>
              <Text style={{color:'#212429',fontSize:14}}>스타벅스 아이스 아메리카노 <Text>(총 15개)</Text></Text>
              <View style={{flexDirection:'row', justifyContent:'space-between',width:60}}>
                <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>15개</Text>
              </View>
            </View>
          </View>
          <Text style={{fontWeight:'100',color:'#212429',fontSize:17, marginLeft:20, marginBottom:10}}>유의사항</Text>
          <Text style={{fontWeight:'100',color:'#212429',fontSize:15, marginLeft:20,marginBottom:5}}>- 상품은 구매한 다음 주차 목요일에 일괄 발송됩니다.</Text>
        </ScrollView>
        </View>
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
      height:150,
      alignSelf:'center',
      alignItems:'center',
      borderColor:'#F9C649',
      borderRadius:10,
      borderWidth:1,
      marginBottom:30
    },
    eventModalMarketBlockView:
    {
      backgroundColor:'#FFFFFF',
      width: 320,
      height:150,
      alignSelf:'center',
      alignItems:'center',
      borderColor:'#F9C649',
      borderRadius:10,
      borderWidth:1,
      marginBottom:30
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
    }
  });

export default AutumnEventDetailModal;