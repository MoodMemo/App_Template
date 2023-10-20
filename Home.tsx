import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, StyleSheet, Touchable, TouchableOpacity, SafeAreaView, Image, StatusBar, Platform } from 'react-native';
import Modal from "react-native-modal";
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
import StampOnBoarding from './StampOnBoarding';
// import PushNotification from "react-native-push-notification";
import * as amplitude from './AmplitudeAPI';
import * as repository from './src/localDB/document';
import realm from './src/localDB/document';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StatusBarStyle} from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';

import {default as Text} from "./CustomText"
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({name,first}:any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isFirstStamp,setIsFirstStamp]=useState(false);
  const [isStampTemplateAdded,setIsStampTemplateAdded]=useState(true);

  useEffect(() => {
    // AsyncStorage에서 userName 값을 가져와서 설정
    AsyncStorage.getItem('@UserInfo:addedStampTemplate')
      .then((value) => {
        if(value!=='true'){
          setIsStampTemplateAdded(false);
        }
    }).catch((error) => {
      console.error("Error fetching addedStampTemplate:", error);
    });
    AsyncStorage.getItem('@UserInfo:userName')
      .then((value) => {
        if (value) {
          setUserName(value);
        }
      })
      .catch((error) => {
        console.error("Error fetching userName:", error);
      });
    AsyncStorage.getItem('@UserInfo:firstStamp')
    .then((value) => {
      if (value==='true') {
        setIsFirstStamp(true);
      }
      else{
        setIsFirstStamp(false);
      }
    })
    .catch((error) => {
      console.error("Error fetching firstStamp:", error);
    });
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
    console.log(isStampTemplateAdded,'isStampTemplateAdded',first);
  }, []);

  const addStampTemplate = () => {
    repository.createCustomStamp({
      stampName: "불안",
      emoji: "😖"
    });
    repository.createCustomStamp({
      stampName: "걱정",
      emoji: "😨"
    });
    repository.createCustomStamp({
      stampName: "황당",
      emoji: "😦"
    });
    repository.createCustomStamp({
      stampName: "졸림",
      emoji: "😴"
    });
    repository.createCustomStamp({
      stampName: "귀찮음",
      emoji: "😮‍💨"
    });
    repository.createCustomStamp({
      stampName: "후회",
      emoji: "😢"
    });
    repository.createCustomStamp({
      stampName: "배고픔",
      emoji: "🍗"
    });
    repository.createCustomStamp({
      stampName: "나른함",
      emoji: "😑"
    });
    repository.createCustomStamp({
      stampName: "후회",
      emoji: "😢"
    });
    repository.createCustomStamp({
      stampName: "웃김",
      emoji: "😄"
    });
    repository.createCustomStamp({
      stampName: "신기함",
      emoji: "😮"
    });
    repository.createCustomStamp({
      stampName: "후회",
      emoji: "😢"
    });
    repository.createCustomStamp({
      stampName: "감동",
      emoji: "🥹"
    });
    repository.createCustomStamp({
      stampName: "요리",
      emoji: "🍽️"
    });
    repository.createCustomStamp({
      stampName: "운동",
      emoji: "💪"
    });
    repository.createCustomStamp({
      stampName: "아이디어",
      emoji: "💡"
    });
    repository.createCustomStamp({
      stampName: "투두",
      emoji: "✅"
    });
  };

  const handleStampTemplateAddedTrue = () => {
    setIsStampTemplateAdded(true);
    AsyncStorage.setItem('@UserInfo:addedStampTemplate','true');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleFixButton = () => {
    amplitude.showCustomStampList();
    setFixModalVisible(true);
  };

  const handleFixModalClose = () => {
    amplitude.exitCustomStampList();
    setFixModalVisible(false);
  };
  console.log('aa',name);
  return (
    <>
    <StatusBar
        backgroundColor="#FFFAF4"
        barStyle='dark-content'
      />
    {isFirstStamp===false ? (<View style={styles.view}>
    <View style={styles.titleContainer}>
      {/* 드롭다운 컴포넌트 */}
      <Text style={styles.title}>지금 어떤 기분이냐무~?{'\n'}{`${name===undefined ? userName : name}`}의{'\n'}감정을 알려줘라무!</Text>
    </View>
    <Image source={require('./assets/colorMooMedium.png')} style={styles.mooImage}/>
    <View style={styles.options}>
      <Dropdown options={options} onSelectOption={handleOptionSelect} />
      <TouchableOpacity style={styles.fixButton} onPress={handleFixButton}>
        {/* <Image source={require('./assets/edit.png')} /> */}
        <MCIcon name='trash-can' color="#495057" style={{ fontWeight: 'bold', fontSize: 20}}/>
      </TouchableOpacity>
    </View>
    {/* 감정 스탬프 뷰 */}
    <StampView/>
    {/* 스탬프 설정 모달 */}
    <StampList visible={fixModalVisible} closeModal={handleFixModalClose}/>
  </View>) : (<StampOnBoarding/>)}
  <Modal isVisible={!first&&!isStampTemplateAdded}
      animationIn={"fadeIn"}
      animationInTiming={200}
      animationOut={"fadeOut"}
      animationOutTiming={200}
      backdropColor='#CCCCCC'//'#FAFAFA'
      backdropOpacity={0.8}
      style={{
          alignItems:'center'
      }}>
          <View style={{
              backgroundColor:"#FFFAF4",
              width:'90%',
              height:'60%',
              justifyContent:'center',
              alignItems:'center',
              borderRadius:10
          }}>
              <View style={{
                  justifyContent:'center',
                  alignItems:'center',
                  marginTop:20,
                  }}>
                    <TouchableOpacity disabled={true} style={{
                    // position: 'absolute',
                    // bottom: 350,
                    width: 250,
                    height: 160,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#72D193',
                    borderRadius: 7,
                    marginHorizontal:'5%'
                    }}>
                      <Text style={{fontSize: 19, color:"#FFFFFF", paddingBottom: 5,paddingTop:5}}>{userName}에게</Text>
                      <Text style={{fontSize: 19, color:"#FFFFFF", paddingBottom: 5,paddingTop:5}}>새로운 스탬프들을 준비했다무!</Text>
                      <Text style={{fontSize: 19, color:"#FFFFFF", paddingBottom: 5,paddingTop:5}}>Moo가 준비한 스탬프들을</Text>
                      <Text style={{fontSize: 19, color:"#FFFFFF", paddingBottom: 5,paddingTop:5}}>추가해보겠냐무?</Text>
                </TouchableOpacity>
                    <View style={{
                    // position: 'absolute',
                    // left:180,
                    // bottom: 310,
                    marginTop:-3,
                    width:0,
                    height:0,
                    borderTopWidth:20,
                    borderTopColor:'#72D193',
                    borderLeftWidth:20,
                    borderLeftColor:'#FFFFFF00',
                    borderRightWidth:20,
                    borderRightColor:'#FFFFFF00',
                    borderBottomWidth:20,
                    borderBottomColor:'#FFFFFF00',
                    }}/>
                    <Image source={require('./assets/colorMooMedium.png')} style={{
                      width: 90,
                      height: 393*89/363,
                      transform: [{ rotate: '25deg' }],}}/>
              </View>
              <View style={{
                  paddingHorizontal: "5%",
                  marginTop:30,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                  }}>
                  <TouchableOpacity onPress={async ()=>{
                      amplitude.cancelAddStampTemplate(); //스탬프 템플릿 추가 안 함
                      handleStampTemplateAddedTrue();
                      }}
                      style={styles.cancelBtn}>
                      <Text style={{fontSize: 19}}>아냐 괜찮아</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async ()=>{
                      amplitude.confirmAddStampTemplate(); //스탬프 템플릿 추가함
                      handleStampTemplateAddedTrue();
                      realm.write(addStampTemplate);
                  }}
                  style={styles.clearBtn}>
                      <Text style={{fontSize: 19}}>응 좋아!</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
  </>
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
    cancelBtn: {
      alignSelf: 'center',
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#FF0000', 
      padding: 7,
      marginBottom: 16,
      backgroundColor: 'white', 
      borderColor: '#FF0000',
      borderWidth:1,
      borderRadius: 8,
      flex: 1,
      marginHorizontal:10,
    },
    clearBtn: {
      alignSelf: 'center',
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#344054',
      padding: 7,
      marginBottom: 16,
      backgroundColor: 'white', 
      borderColor: '#72D193',
      borderWidth:1,
      borderRadius: 8,
      flex: 1,
      marginHorizontal:10,
    },
  });

export default Home;
