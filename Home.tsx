import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image, Modal } from 'react-native';
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
import PushNotification from "react-native-push-notification";
import * as amplitude from './AmplitudeAPI';

const Home = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);

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
      <View style={styles.titleContainer}>
        {/* 드롭다운 컴포넌트 */}
        <Text style={styles.title}>지금 나의 감정은?</Text>
      </View>
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
      backgroundColor: '#FAFAFA',
    },
    titleContainer: {
      marginTop: 30, // Dropdown과 title 사이 간격 조절
      alignItems: 'center', // 가로 정렬
    },
    title: {
      fontFamily: 'Pretendard',
      fontWeight: '400',
      fontSize: 24,
      lineHeight: 28.8,
      marginBottom: 30, // title과 Dropdown 사이 간격 조절
    },
    options: {
      flexDirection: 'row', // 옵션들을 가로로 배치
      justifyContent: 'space-between', // 옵션들 사이 간격을 동일하게 배치
      alignItems: 'center', // 옵션들을 세로로 가운데 정렬
      marginHorizontal: 28,
    },
    fixButton: {
      width: 20,
      height: 20,
    },
  });

export default Home;
