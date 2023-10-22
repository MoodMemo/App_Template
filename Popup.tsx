import React, { useState, useEffect } from 'react';
import {View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as amplitude from './AmplitudeAPI';
import Modal from 'react-native-modal';
import axios, { AxiosResponse, CancelToken } from 'axios';


import {default as Text} from "./CustomText"

import AutumnEventCoinModal from './AutumnEventCoinModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Popup = ({ visible, onClose }) => {
  const [isEventModalVisible, setIsEventModalVisible]=useState(false);
  const [isFirstStampToday,setIsFirstStampToday]=useState(false);
  const [autumnEventStampDate,setAutumnEventStampDate] = useState('');
  
  useEffect(()=>{
    const url = 'http://3.34.55.218:5000/time';
    axios.get(url).then((response)=>{
      var month=response.data.month;
      var day=response.data.day;
      AsyncStorage.getItem('@UserInfo:AutumnEventStampDate').then((value)=>{
        var date=value.split('/');
        var date_now=new Date(new Date(2023,month-1,day).getTime() + (9*60*60*1000))
        var date_stamp=new Date(new Date(2023,Number(date[0])-1,Number(date[1])).getTime() + (9*60*60*1000));
        let totalDays=Math.floor((date_now.getTime()-date_stamp.getTime())/(1000*3600*24));
        if(totalDays>0){
          console.log(value);
          console.log(totalDays,'일');
          console.log('date_now: ',date_now);
          console.log('date_stamp: ',date_stamp);
          setIsFirstStampToday(true);
          AsyncStorage.setItem('@UserInfo:AutumnEventStampDate',month.toString()+'/'+day.toString());
        }
      })
    }).catch((error)=>{
      console.error('Failed to GET Server Time');
    })
  },[]);

  return (
    <>
    <Modal isVisible={visible}
    animationIn={"fadeIn"}
    animationInTiming={200}
    animationOut={"fadeOut"}
    animationOutTiming={200}
    onBackdropPress={() => {
      amplitude.confirmPushedStampFinModal();
      onClose();
    }}
    onModalHide={()=>{setIsEventModalVisible(true);}}>
        <View style={diaryStyles.lodingModal}>
          <Image 
            source={require('./assets/write_0904.png')}
            style={{ width: 92, height: (105 * 92) / 92 , marginTop: 40,}}></Image>
          <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 20, fontWeight: 'bold' }}>스탬프가 등록됐다</Text>
            <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 20, fontWeight: 'bold' }}>무</Text>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 20, fontWeight: 'bold' }}>!</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1,}}>
              <TouchableOpacity style={diaryStyles.cancelBtn} 
              onPress={() => {onClose(); amplitude.confirmPushedStampFinModal();}}
              >
                <Text style={{ color: '#72D193', fontSize: 16, fontWeight: '600',}}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>          
        </View>
    </Modal>
    <Modal isVisible={isEventModalVisible&&isFirstStampToday}
    animationIn={"fadeIn"}
    animationInTiming={200}
    animationOut={"fadeOut"}
    animationOutTiming={200}
    onBackdropPress={() => {
      amplitude.test1();//은행잎 획득 모달 끔
      setIsEventModalVisible(!isEventModalVisible);
    }}
    onModalHide={()=>{setIsFirstStampToday(false);}}>
      <AutumnEventCoinModal isModalVisible={isEventModalVisible} setIsModalVisible={setIsEventModalVisible} type="stamp"/>
    </Modal>
    </>
  );
}



const diaryStyles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadedImage: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  lodingModal: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 흐린 배경 설정
    backgroundColor: '#FFFAF4', 
    // justifyContent: 'space-between', // 상하로 딱 붙이기
    // justifyContent: 'space-around', 
    // alignItems: 'flex-start', 
    // alignItems: 'center', // 가운데 정렬

    flexDirection: 'column',
    borderRadius: 12, 
    paddingHorizontal: 16,
    width: 270, 
    height: 250,
    shadowColor: 'black',
    shadowRadius: 50,           // 그림자 블러 반경
    elevation: 5, 
  },
  cancelBtn: {
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#344054', 
    padding: 8,
    marginBottom: 16,
    backgroundColor: 'white', 
    borderColor: '#72D193',
    borderWidth:1,
    borderRadius: 8,
    flex: 1,
  },
  finishLodingModal: {
    backgroundColor: '#FFFAF4', 
    justifyContent: 'space-between', // 상하로 딱 붙이기
    alignItems: 'center', // 가운데 정렬
    flexDirection: 'column',
    borderRadius: 12, 
    paddingHorizontal: 16,
    width: 343, 
    height: 284,
    shadowColor: 'black',
    shadowRadius: 50,           // 그림자 블러 반경
    elevation: 5, 
  },
  confirmBtn: {
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#72D193', 
    borderRadius: 8,
    flex: 1,
  },
  cancelOut2EditBtn: {
    borderColor: '#D0D5DD', borderWidth: 1,
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#ffffff', 
    borderRadius: 8,
    flex: 1,
  },
  editDiary: {
    fontSize: 16, 
    color: '#212429', 
    margin: 0, 
    marginBottom:7, 
    paddingVertical: 5, 
    paddingLeft: 15, 
    paddingRight: 15, 
    borderColor: '#F0F0F0', 
    borderWidth:1, 
    borderRadius: 5, 
    paddingHorizontal:10, 
    flex:1
  }
});


const styles = StyleSheet.create({
  popup: {
    width: 343,
    boxShadow: '0px 8px 8px -4px rgba(16, 24, 40, 0.04)',
    // padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12
  },
  upArea: {
    paddingTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  downArea: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  popUpText: {
    color: '#101828',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#72D193',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
  },
});

export default Popup;
