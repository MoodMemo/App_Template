import React, {useEffect, useState} from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Modal, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import DatePicker from 'react-native-date-picker';
import realm, { ICustomStamp, createPushedStamp, getAllCustomStamps, updateCustomStampPushedCountById, getPushedStampsAllByField } from './src/localDB/document';
import renderWhenStampAdded from './weeklyView/Weekly'

const StampView = () => {
  const [customStamps, setCustomStamps] = useState<ICustomStamp[]>([]);

  useEffect(() => {
    const stampsListener = (collection, changes) => {
      setCustomStamps([...collection]);
    };
  
    const stampsCollection = realm.objects('CustomStamp');
    stampsCollection.addListener(stampsListener);
  
    return () => {
      stampsCollection.removeListener(stampsListener);
    }
  }, []);  

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedEmotionLabel, setSelectedEmotionLabel] = useState(null);
  const [selectedEmotionId, setSelectedEmotionId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const [memo, setMemo] = useState('');
  const [numberOfLines, setNumberOfLines] = useState(1);

  const [images, setImages] = useState([]);

  // const [notDevelopedModalVisible, setNotDevelopedModalVisible] = useState(false);

  const handleCreatePushedStamp = () => {
    console.log("체크 버튼 누름!");
    // 기록 시간 설정
    const dateTime = date.toISOString();
    // const dateTime = new Date();

    realm.write(() => {
      // 실제로 Realm에 PushedStamp를 생성하는 함수 호출
      createPushedStamp({
        dateTime: dateTime,
        stampName: selectedEmotionLabel,
        emoji: selectedEmotion,
        memo: memo,
        imageUrl: '', // 이미지를 추가하려면 여기에 이미지 URL을 추가
      });
    });

    updateCustomStampPushedCountById(selectedEmotionId, 1);
    // 모달 닫기
    onClose();
  }

  const onClose = () => {
    setModalVisible(false);
    setMemo('');
  }

  const handleMemoChange = (text) => {
    setMemo(text);
    setNumberOfLines(text.split('\n').length);
  };

  const handleButtonPress = (stampButton) => {
    setSelectedEmotion(stampButton.emoji);
    setSelectedEmotionLabel(stampButton.stampName);
    setSelectedEmotionId(stampButton.id);
    setDate(new Date());
    setModalVisible(true);
  }

  const handleCloseTimeModal = () => {
    setTimeModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.stampView} horizontal={false}>
        {customStamps.map((stampButton) => (
          <TouchableOpacity key={stampButton.id} style={styles.stampButton} onPress={() => {handleButtonPress(stampButton)}}>
            <Text style={styles.buttonEmotion}>{stampButton.emoji}</Text>
            <Text style={styles.buttonText}>{stampButton.stampName}</Text>
            <Text style={styles.buttonText}>{stampButton.pushedCnt}</Text>
            <Text style={styles.buttonText}>{getPushedStampsAllByField('stampName', stampButton.stampName).length}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {/* 모달 내용 */}
          <View style={styles.modalTitleContainer}>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('./assets/close.png')} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>감정 기록</Text>
            <TouchableOpacity onPress={handleCreatePushedStamp}>
              <Image source={require('./assets/check.png')} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={false}>
          <View style={styles.stampContainer}>
            <Text style={styles.modalText}>찍은 스탬프</Text>
            <View style={styles.stampContent}>
              <Text style={styles.stampText}>{selectedEmotion}</Text>
              <Text style={styles.stampText}>{selectedEmotionLabel}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.modalText}>기록 시간</Text>
            <TouchableOpacity onPress={() => setTimeModalVisible(true)}>
              <Text style={styles.timeText}>
                {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}. {date.getHours()}:{date.getMinutes().toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.memoContainer}>
            <Text style={styles.modalText}>메모 남기기</Text>
            <View style={styles.memoContent}>
              <TextInput
                style={styles.memoText}
                placeholder="메모 작성하기 (추후 작성 가능)"
                multiline={true}
                maxLength={500}
                onChangeText={handleMemoChange}
                //value={memo}
                numberOfLines={numberOfLines}
              />
              <Text style={styles.maxLength}>{memo.length}/500</Text>
            </View>
          </View>
          {/* <View style={styles.imgContainer}>
            <Text style={styles.modalText}>사진 추가</Text>
            <TouchableOpacity style={styles.imgButton} onPress={() => {
              
            }}>
              <Image source={require('./assets/add-circle.png')} />
              <Text style={styles.imgText}>사진 추가{"\n"}{images.length}/3</Text>
            </TouchableOpacity>
          </View> */}
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={timeModalVisible} animationType="fade" transparent onRequestClose={handleCloseTimeModal}>
        <TouchableWithoutFeedback onPress={handleCloseTimeModal}>
          <View style={styles.timeModalWrapper}>
            <View style={styles.timeModalContainer}>
              <Text style={styles.timeModalText}>기록 시간 변경하기</Text>
              <DatePicker date={date} onDateChange={setDate} mode="datetime" theme="light"/>
              <View style={styles.timeButtons}>
                <TouchableOpacity onPress={handleCloseTimeModal}>
                  <Text>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCloseTimeModal}>
                  <Text>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 19,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampView: {
    top: 0,
    alignContent: 'center',
    flexDirection: 'row', // 버튼들을 가로로 배열
    flexWrap: 'wrap', // 가로로 공간이 부족하면 다음 줄로 넘어감
    justifyContent: 'space-between', // 버튼들 사이의 간격을 동일하게 분배
    width: 336,
    height: 'auto',
    marginHorizontal: 20, // 버튼들의 좌우 여백을 조절
    gap: 20, // 버튼들 사이의 간격을 조절
  },
  stampButton: {
    width: 69, // 버튼 너비 설정 (한 줄에 4개씩 배치하므로 약 23%)
    height: 84, // 버튼 높이 설정
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    gap: 10,
    paddingBottom: 10, // 버튼들 사이의 간격을 조절
  },
  buttonEmotion: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#212429',
    textAlign: 'center',
    fontFamily: 'Pretendard',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    flexShrink: 0,
    borderRadius: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#212429',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontStyle: 'normal',
  },
  modalText: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stampContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    paddingLeft: 16,
    // justifyContent 종류: flex-start, flex-end, center, space-between, space-around, space-evenly
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  stampContent: {
    flexDirection: 'row',
    display: 'flex',
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  stampText: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 30,
  },
  timeText: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  horizontalLine: {
    // width: '100%',
    height: 0.7,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
    marginRight: 19,
    marginTop: 27,
    marginBottom: 27,
  },
  memoContainer: {
    width: '100%',
    padding: 16,
    justifyContent: 'flex-start',
    gap: 7,
  },
  memoContent: {
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 6,
  },
  memoText: {
    alignSelf: 'stretch',
    color: '#212429',
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  maxLength: {
    color: '#495057',
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  imgContainer: {
    flexDirection: 'column',
    width: '100%',
    padding: 16,
    justifyContent: 'flex-start',
    gap: 10,
  },
  imgButton: {
    flexDirection: 'column',
    display: 'flex',
    width: 100,
    height: 100,
    paddingTop: 20,
    paddingRight: 18,
    paddingBottom: 14,
    paddingLeft: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderStyle: 'dashed',
    backgroundColor: '#F2F2F2',
  },
  imgText: {
    color: '#D7D7D7',
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 10,
  },
  timeModalWrapper: {
    flex: 1,
    justifyContent: 'flex-end', // 이 부분이 모달을 하단으로 밀어줍니다.
  },
  timeModalContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '50%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    // 아래의 marginTop 제거 또는 조절
    // marginTop: 517,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.30,
    shadowRadius: 6,
    elevation: 30,
    paddingTop: 20,
    gap: 10,
  },
  
  timeModalText: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 26,
    alignSelf: 'flex-end',
    marginRight: 40,
    marginBottom: 20,
  },
});

export default StampView;