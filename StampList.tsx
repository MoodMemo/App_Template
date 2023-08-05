import React, {useState} from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';

const StampList = ({visible, closeModal}) => {
  // 각 스탬프의 상태를 관리하는 배열, 모두 기본값은 false로 초기화
  const [checkedStates, setCheckedStates] = useState(
    Array(10).fill(false)
  );

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
  const [isChecked, setIsChecked] = useState(false);

  const [stampCount, setStampCount] = useState(0);

  const countSelectedRadioButtons = () => {
    const count = checkedStates.filter((state) => state === true).length;
    if(!isChecked && stampCount > 0) setIsChecked(true);
    else if(isChecked && stampCount === 0) setIsChecked(false);
    setStampCount(count);
    // return count;
  };

  const handleDeleteStamp = () => {
    // 라디오버튼 체크된 것들 삭제
    // checkedStates 배열에서 true로 설정된 항목들의 인덱스들을 찾기
    const selectedIndexes = checkedStates.reduce(
      (indexes, state, index) => (state ? [...indexes, index] : indexes),
      []
    );

    // 선택된 스탬프들을 삭제
    const newStampListData = stampListData.filter(
      (mood) => !selectedIndexes.includes(mood.id - 1) // 인덱스는 0부터 시작
    );

    // 선택된 스탬프들의 체크 상태 초기화
    const newCheckedStates = checkedStates.map((_, index) =>
      selectedIndexes.includes(index) ? false : checkedStates[index]
    );

    // 변경된 데이터와 상태 적용
    setStampListData(newStampListData);
    setCheckedStates(newCheckedStates);
    console.log("스탬프 삭제");
  };

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
              onPress={
                checkedStates[index] ? () => {
                  setStampCount(stampCount - 1);
                  const newCheckedStates = [...checkedStates];
                  newCheckedStates[index] = !checkedStates[index];
                  setCheckedStates(newCheckedStates);
                  countSelectedRadioButtons();
                } : () => {
                  setStampCount(stampCount + 1);
                  const newCheckedStates = [...checkedStates];
                  newCheckedStates[index] = !checkedStates[index];
                  setCheckedStates(newCheckedStates);
                  countSelectedRadioButtons();
                }
              }
            />
            <TouchableOpacity key={mood.id} style={styles.moodInfo}>
              <Text style={styles.moodEmotion}>{mood.emotion}</Text>
              <Text style={styles.moodText}>{mood.label}</Text>
            </TouchableOpacity>
          </View>
          ))}
        </ScrollView>
        { isChecked &&
          <TouchableOpacity style={styles.fixModalButton} onPress={handleDeleteStamp}>
            <Text style={styles.fixModalButtonText}>스탬프 삭제</Text>
          </TouchableOpacity>
        }
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
  fixModalButton: {
    position: 'absolute',
    bottom: 30,
    width: 393,
    height: 60,
    marginBottom: 30,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixModalButtonText: {
    color: '#000000',
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 14,
    fontStyle: 'normal',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  addStampModalContainer: {
    backgroundColor: 'white',
    width: 393,
    height: 464,
    marginTop: 380,
    borderRadius: 16,
  },
  addStampModalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 40,
  },
  addStampModalTitle: {
    color: '#212429',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 16,
  },
  checkImage: {
    // 기본 이미지 스타일
    
  },
  disabledCheckImage: {
    opacity: 0.2, // 비활성 시에 투명도 조절
  },
  addStampModalContent: {
    marginHorizontal: 16,
    flexDirection: 'row',
    gap: 16,
  },
  addStampModalEmotionContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  addStampModalMessage: {
    color: '#212429',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    fontStyle: 'normal',
  },
  addStampModalEmotionBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStampModalEmotion: {
    fontSize: 24,
  },
  addStampModalLabelContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  addStampModalLabelBox: {
    width: 296,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  addStampModalLabel: {
    fontSize: 16,
  },
});

export default StampList;