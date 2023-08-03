import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Dropdown from './Dropdown';
import StampView from './StampView';

const Home = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순', '감정 순', '이름 순'];
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.view}>
      <View style={styles.titleContainer}>
        {/* 드롭다운 컴포넌트 */}
        <Text style={styles.title}>지금 나의 감정은?</Text>
      </View>
      <Dropdown options={options} onSelectOption={handleOptionSelect} />
      {/* 감정 스탬프 뷰 */}
      <StampView />
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
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 20,
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

export default Home;