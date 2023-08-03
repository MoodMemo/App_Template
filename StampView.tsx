import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const StampView = () => {
  const buttonsData = [
    { id: 1, label: '기쁨', emotion: '😊'},
    { id: 2, label: '슬픔', emotion: '😢'},
    { id: 3, label: '화남', emotion: '😡'},
    { id: 4, label: '놀람', emotion: '😱'},
    { id: 5, label: '당황', emotion: '😳'},
    { id: 6, label: '무표정', emotion: '😐'},
    { id: 7, label: '우울', emotion: '😔'},
    { id: 8, label: '불안', emotion: '😨'},
    { id: 9, label: '짜증', emotion: '😤'},
    { id: 10, label: '행복', emotion: '😁'},
    { id: 11, label: '평온', emotion: '😌'},
    { id: 12, label: '불만', emotion: '😒'},
    { id: 13, label: '놀람', emotion: '😱'},
    { id: 14, label: '당황', emotion: '😳'},
    { id: 15, label: '무표정', emotion: '😐'},
    { id: 16, label: '우울', emotion: '😔'},
    { id: 17, label: '불안', emotion: '😨'},
    { id: 18, label: '짜증', emotion: '😤'},
    { id: 19, label: '행복', emotion: '😁'},
    { id: 20, label: '평온', emotion: '😌'},
    { id: 21, label: '불만', emotion: '😒'},
    { id: 22, label: '놀람', emotion: '😱'},
    { id: 23, label: '당황', emotion: '😳'},
    { id: 24, label: '무표정', emotion: '😐'},
    // 추가 버튼들...
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={false}>
      {buttonsData.map((button) => (
        <TouchableOpacity key={button.id} style={styles.button}>
          <Text style={styles.buttonText}>{button.emotion}</Text>
          <Text style={styles.buttonText}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 0,
    alignContent: 'center',
    flexDirection: 'row', // 버튼들을 가로로 배열
    flexWrap: 'wrap', // 가로로 공간이 부족하면 다음 줄로 넘어감
    justifyContent: 'space-between', // 버튼들 사이의 간격을 동일하게 분배
    width: 336,
    height: 583,
    marginHorizontal: 20, // 버튼들의 좌우 여백을 조절
    gap: 20, // 버튼들 사이의 간격을 조절
  },
  button: {
    width: 69, // 버튼 너비 설정 (한 줄에 4개씩 배치하므로 약 23%)
    height: 84, // 버튼 높이 설정
    aspectRatio: 1, // 가로 세로 비율을 1:1로 유지하여 버튼이 정사각형이 되도록 함
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    gap: 10,
    marginBottom: 10, // 버튼들 사이의 간격을 조절
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StampView;
