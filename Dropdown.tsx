import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Dropdown = ({ options, onSelectOption }) => {
  const [isOptionsVisible, setOptionsVisible] = useState(false);

  const handleOptionSelect = (option) => {
    onSelectOption(option); // 선택한 옵션을 부모 컴포넌트로 전달
    setOptionsVisible(false); // 선택지 닫기
  };

  return (
    <View>
      {/* 드롭다운 버튼 */}
      <TouchableOpacity style={styles.orderButton} onPress={() => setOptionsVisible(!isOptionsVisible)}>
        <Text style={styles.orderText}>최근 생성 순</Text>
        <Image style={styles.orderImg} source={require('./assets/arrow-drop-down.png')} />
      </TouchableOpacity>

      {/* 선택지 영역 */}
      {isOptionsVisible && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => handleOptionSelect(option)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderButton: {
    flexDirection: 'row',
    gap: 6,
  },
  orderText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    fontStyle: 'normal',
    textAlignVertical: 'center',
  },
  orderImg: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default Dropdown;
