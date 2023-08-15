import React, {useEffect, useState} from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import realm, { ICustomStamp, createCustomStamp, deleteCustomStamp, getAllCustomStamps } from './src/localDB/document';

const StampList = ({visible, closeModal}) => {
  // 각 스탬프의 상태를 관리하는 배열, 모두 기본값은 false로 초기화
  const [checkedStates, setCheckedStates] = useState(
    Array(20).fill(false)
  );

  const [customStamps, setCustomStamps] = useState<ICustomStamp[]>([]);

  useEffect(() => {
    const fetchStamps = async () => {
      const fetchedCustomStamps = await getAllCustomStamps();
      setCustomStamps(fetchedCustomStamps);
    };
    
    fetchStamps();
  }, []);
  

  const [addStampDataLabel, setAddStampDataLabel] = useState('');
  const [addStampDataEmotion, setAddStampDataEmotion] = useState('');

  const [isChecked, setIsChecked] = useState(false);

  const [stampCount, setStampCount] = useState(0);

  const [addStampModalVisible, setAddStampModalVisible] = useState(false);
  const [addStampButtonDisabled, setAddStampButtonDisabled] = useState(true);

  const handleRadioButtonPress = (index) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !checkedStates[index];
    const count = newCheckedStates.filter((state) => state).length;
  
    setCheckedStates(newCheckedStates);
    setIsChecked(count > 0);
    setStampCount(count);
  };

  const handleDeleteStamp = () => {
    // 라디오버튼 체크된 것들 삭제
    const selectedIndexes = checkedStates.reduce(
      (indexes, state, index) => (state ? [...indexes, index] : indexes),
      []
    );

    // 선택된 스탬프들을 삭제
    const newCustomStamps = customStamps.filter(
      (stamp, index) => !selectedIndexes.includes(index)
    );

    // realm에서 선택된 스탬프들을 삭제
    selectedIndexes.forEach(index => {
      deleteCustomStamp(customStamps[index]);
    });

    // 선택된 스탬프들의 체크 상태 초기화
    const newCheckedStates = checkedStates.map((_, index) =>
      selectedIndexes.includes(index) ? false : checkedStates[index]
    );

    // 변경된 데이터와 상태 적용
    setCustomStamps(newCustomStamps);
    setCheckedStates(newCheckedStates);
    console.log("스탬프 삭제");
  };

  const handleAddStamp = (label, emotion) => {
    // 새 스탬프 객체의 초기 데이터를 생성
    const newStampData = {
      stampName: label,
      emoji: emotion,
    };
  
    let newStamp;
    // Realm 데이터베이스에 스탬프 추가
    realm.write(() => {
      newStamp = createCustomStamp(newStampData);
    });
  
    // 상태 업데이트: 새 스탬프를 customStamps에 추가
    const updatedCustomStamps = [...customStamps, newStamp];
    setCustomStamps(updatedCustomStamps);
  
    // 모달과 버튼 상태 초기화
    setAddStampModalVisible(false);
    setAddStampButtonDisabled(true);
    console.log("스탬프 추가");
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
          {customStamps.map((stamp, index) => (
          <View key={stamp.id} style={styles.stampListContainer}>
            <RadioButton
              value="first"
              status={checkedStates[index] ? 'checked' : 'unchecked'}
              onPress={() => handleRadioButtonPress(index)}
            />
            <TouchableOpacity key={stamp.id} style={styles.moodInfo}>
              <Text style={styles.moodEmotion}>{stamp.emoji}</Text>
              <Text style={styles.moodText}>{stamp.stampName}</Text>
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
      {addStampModalVisible && (
        <View style={styles.overlay} />
      )}
      <Modal visible={addStampModalVisible} animationType='slide' transparent>
        <View style={styles.addStampModalContainer}>
          <View style={styles.addStampModalTitleContainer}>
            <TouchableOpacity onPress={() => setAddStampModalVisible(false)}>
              <Image source={require('./assets/close.png')} />
            </TouchableOpacity>
            <Text style={styles.addStampModalTitle}>스탬프 추가</Text>
            <TouchableOpacity disabled={addStampButtonDisabled} onPress={() => handleAddStamp(addStampDataLabel, addStampDataEmotion)}>
              <Image source={require('./assets/add_check.png')} 
                style={[
                  styles.checkImage,
                  addStampButtonDisabled && styles.disabledCheckImage
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.addStampModalContent}>
            <View style={styles.addStampModalEmotionBox}>
              <TextInput
                style={styles.addStampModalEmotion}
                placeholder='🔥'
                maxLength={2}
                onChangeText={(text) => {
                  setAddStampDataEmotion(text);
                  if(text.length > 0 && addStampDataLabel.length > 0) setAddStampButtonDisabled(false);
                  else setAddStampButtonDisabled(true);
                }}
              />
            </View>
            <View style={styles.addStampModalLabelBox}>
              <TextInput
                style={styles.addStampModalLabel}
                placeholder='스탬프 이름 입력'
                onChangeText={(text) => {
                  setAddStampDataLabel(text);
                  if(text.length > 0 && addStampDataEmotion.length > 0) setAddStampButtonDisabled(false);
                  else setAddStampButtonDisabled(true);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fixModalContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  fixModalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  fixModalTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    // marginBottom: 60,
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
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 반투명한 검정색 배경
  },
  addStampModalContainer: {
    // flex: 1,
    backgroundColor: 'white',
    width: '80%',
    height: 260,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 16,
  },
  addStampModalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
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
    // 가운데에 위치하도록
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    // gap: 15,
    marginBottom: 55,
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