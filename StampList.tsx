import React, {useState} from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';

  const [stampListData, setStampListData] = useState(
    [
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
    ]
  );
  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles.fixModalContainer}>
        <View style={styles.fixModalTitleContainer}>
          <View style={styles.fixModalTitleContent}>
            <TouchableOpacity onPress={closeModal}>
              <Image source={require('./assets/arrow-back.png')} />
            </TouchableOpacity>
            <Text style={styles.fixModalTitle}>스탬프 설정</Text>
          </View>
          <TouchableOpacity onPress={() => setAddStampModalVisible(true)}>
            <Image source={require('./assets/add.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.fixModalMessageContainer}>
          <Text style={styles.fixModalMessage}>감정 스티커 순서를 변경하거나 삭제할 수 있어요.</Text>
        </View>
        <ScrollView style={styles.stampList}>
          {stampListData.map((mood, index) => (
          <View key={mood.id} style={styles.stampListContainer}>
            <RadioButton
              value="first"
              status={checkedStates[index] ? 'checked' : 'unchecked'}
            />
            <TouchableOpacity key={mood.id} style={styles.moodInfo}>
              <Text style={styles.moodEmotion}>{mood.emotion}</Text>
              <Text style={styles.moodText}>{mood.label}</Text>
            </TouchableOpacity>
          </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fixModalContainer: {
    backgroundColor: 'white',
    width: 393,
    height: 812,
    marginTop: 54,
  },
  fixModalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  fixModalTitleContent: {
    flexDirection: 'row',
    gap: 10,
  },
  fixModalTitle: {
    color: '#212429',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 16,
    fontStyle: 'normal',
  },
  fixModalMessageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fixModalMessage: {
    color: '#A8A8A8',
    textAlign: 'left',
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 12,
    fontStyle: 'normal',
  },
  stampList: {
    width: 393,
    // paddingHorizontal: 20,
    // marginTop: 132,
    marginBottom: 60,
  },
  stampListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: 393,
    height: 60,
    gap: 10,
  },
  moodInfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  moodEmotion: {
    color: '#212429',
    fontSize: 24,
  },
  moodText: {
    color: '#212429',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 20,
  },
});

export default StampList;