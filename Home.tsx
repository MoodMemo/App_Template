import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image, Modal } from 'react-native';
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
import PushNotification from "react-native-push-notification";



const Home = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순', '감정 순', '이름 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  
  const handleFixButton = () => {
    setFixModalVisible(true);
  };
  const handleFixModalClose = () => {
    setFixModalVisible(false);
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleContainer}>
        {/* 드롭다운 컴포넌트 */}
        <Text style={styles.title}>지금 나의 감정은?</Text>
      </View>
      <View style={styles.options}>
        <Dropdown options={options} onSelectOption={handleOptionSelect} />
        <TouchableOpacity onPress={handleFixButton}>
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
    },
    titleContainer: {
      marginTop: 84, // Dropdown과 title 사이 간격 조절
      alignItems: 'center', // 가로 정렬
    },
    title: {
      fontFamily: 'Pretendard',
      fontWeight: '400',
      fontSize: 24,
      lineHeight: 28.8,
      marginBottom: 20, // title과 Dropdown 사이 간격 조절
    },
    options: {
      flexDirection: 'row', // 옵션들을 가로로 배치
      justifyContent: 'space-between', // 옵션들 사이 간격을 동일하게 배치
      alignItems: 'center', // 옵션들을 세로로 가운데 정렬
      marginHorizontal: 28,
    },
    button: {
      position: 'absolute',
      bottom: 20,
      alignItems: 'center',
      backgroundColor: '#EFEFEF',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
    },
    fixModalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      width: 393,
      height: 785,
      flexShrink: 0,
      borderRadius: 16,
      marginTop: 67,
    },
  });

export default Home;