import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as amplitude from './AmplitudeAPI';

import {default as Text} from "./CustomText"

const Popup = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      style={{ alignItems:'center', justifyContent: 'center', }}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
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
      </View>

    </Modal>
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'  // 흐린 배경 설정
  },
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
