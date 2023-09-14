import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Touchable, TouchableOpacity, Image, Modal, StatusBar } from 'react-native';
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
import PushNotification from "react-native-push-notification";
import * as amplitude from './AmplitudeAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StatusBarStyle} from 'react-native';

import {default as Text} from "./CustomText"

const Home = ({name}:any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isFirstStamp,setIsFirstStamp]=useState(false);

  useEffect(() => {
    // AsyncStorage에서 userName 값을 가져와서 설정
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
    })
    .catch((error) => {
      console.error("Error fetching firstStamp:", error);
    });
  }, []);

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
      barStyle={'dark-content'}
    />
    {isFirstStamp===false ? (<View style={styles.view}>
    <View style={styles.titleContainer}>
      {/* 드롭다운 컴포넌트 */}
      <Text style={styles.title}>지금 어떤 기분이냐무~?{'\n'}{`${name===undefined ? userName : name}`}의{'\n'}감정을 알려줘라무!</Text>
    </View>
    <Image source={require('./assets/image16.png')} style={styles.mooImage}/>
    <View style={styles.options}>
      <Dropdown options={options} onSelectOption={handleOptionSelect} />
      <TouchableOpacity style={styles.fixButton} onPress={handleFixButton}>
        <Image source={require('./assets/edit.png')} />
      </TouchableOpacity>
    </View>
    {/* 감정 스탬프 뷰 */}
    <StampView />
    {/* 스탬프 설정 모달 */}
    <StampList visible={fixModalVisible} closeModal={handleFixModalClose}/>
  </View>) : (<View style={{justifyContent: 'center',
            flex:1,
            backgroundColor:'#FFFAF4'}}>
              <Image 
                source={require('./assets/colorMooMedium.png')}
                style={{ width: 123, height: (123 * 131) / 123 , position: 'relative', bottom: '6%', alignSelf:'center', overflow: 'hidden', transform:[{rotate:'11.91deg'}]}}></Image>
              <View style={{
                position:'relative'
              }}>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>지금의 감정은 어떠냐무~?</Text>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>{userName}의</Text>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>감정을 남겨보지 않겠냐무?</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={(async () => { 
                // Do something before delay
                await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                setIsFirstStamp(false);
                amplitude.userRegiFin_andStampGo() //스탬프 첫 입력 유도
                }
              )}>
                  <Text style={styles.buttonText}>감정 스탬프 남기러 가기!</Text>
              </TouchableOpacity>
            </View>)}
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
      fontSize: 18,
      marginTop: 28,
      marginLeft: 28,
      marginRight: 200,
      marginBottom: 27, // title과 Dropdown 사이 간격 조절
    },
    mooImage: {
      // 이미지 원본 크기
      width: 100,
      height: 100,
      position: 'absolute',
      top: 49.3,
      right: 28,
      // 회전
      transform: [{ rotate: '11.9deg' }],
    },
    options: {
      flexDirection: 'row', // 옵션들을 가로로 배치
      justifyContent: 'space-between', // 옵션들 사이 간격을 동일하게 배치
      alignItems: 'center', // 옵션들을 세로로 가운데 정렬
      marginTop: 32,
      marginHorizontal: 28,
    },
    fixButton: {
      width: 20,
      height: 20,
    },
    button: {
      position: 'absolute',
      bottom: '18%',
      width: '90%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#72D193',
      borderRadius: 7,
      marginHorizontal:'5%'
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
    },
  });

export default Home;
