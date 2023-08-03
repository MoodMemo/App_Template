import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Dropdown = ({ options, onSelectOption }) => {
  const [isOptionsVisible, setOptionsVisible] = useState(false);

  const handleOptionSelect = (option) => {
    onSelectOption(option); // 선택한 옵션을 부모 컴포넌트로 전달
    setOptionsVisible(false); // 선택지 닫기
  };

  return (
    <View>
      {/* 드롭다운 버튼 */}
      <TouchableOpacity onPress={() => setOptionsVisible(!isOptionsVisible)}>
        <Text>Select an option</Text>
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
