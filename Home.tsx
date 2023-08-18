import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image, Modal, StatusBar } from 'react-native';
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
import PushNotification from "react-native-push-notification";
import * as amplitude from './AmplitudeAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StatusBarStyle} from 'react-native';

const Home = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

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

  return (
    <View style={styles.view}>
      {/* <StatusBar
        backgroundColor="#FFFAF4"
        barStyle={'dark-content'}
      /> */}
      <View style={styles.titleContainer}>
        {/* 드롭다운 컴포넌트 */}
        <Text style={styles.title}>지금의 감정은 어떠냐무~?{'\n'}{`${userName}`}의{'\n'}감정을 알려줘라무!</Text>
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
      fontSize: 16,
      marginTop: 21,
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
  });

export default Home;
