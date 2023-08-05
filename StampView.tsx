import React, {useState} from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Modal, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import DatePicker from 'react-native-date-picker';

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

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedEmotionLabel, setSelectedEmotionLabel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const [memo, setMemo] = useState('');
  const [numberOfLines, setNumberOfLines] = useState(1);

  const [images, setImages] = useState([]);

  const handleMemoChange = (text) => {
    setMemo(text);
    setNumberOfLines(text.split('\n').length);
  };

  const handleButtonPress = (button) => {
    setSelectedEmotion(button.emotion);
    setSelectedEmotionLabel(button.label);
    setModalVisible(true);
  }

  const handleCloseTimeModal = () => {
    setTimeModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container} horizontal={false}>
        {buttonsData.map((button) => (
          <TouchableOpacity key={button.id} style={styles.stampButton} onPress={() => {handleButtonPress(button)}}>
            <Text style={styles.buttonText}>{button.emotion}</Text>
            <Text style={styles.buttonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {/* 모달 내용 */}
          <View style={styles.modalTitleContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Image source={require('./assets/close.png')} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>감정 기록</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}. {date.getHours()}:{date.getMinutes()}
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
                value={memo}
                numberOfLines={numberOfLines}
              />
              <Text style={styles.maxLength}>{memo.length}/500</Text>
            </View>
          </View>
          <View style={styles.imgContainer}>
            <Text style={styles.modalText}>사진 추가</Text>
            <TouchableOpacity style={styles.imgButton} onPress={() => {
              // 이미지 추가 버튼 눌렀을 때 동작
              // 이미지 추가 기능 구현
            }}>
              <Image source={require('./assets/add-circle.png')} />
              <Text style={styles.imgText}>사진 추가{"\n"}{images.length}/3</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </Modal>
      
      <Modal visible={timeModalVisible} animationType="fade" transparent onRequestClose={handleCloseTimeModal}>
        <TouchableWithoutFeedback onPress={handleCloseTimeModal}>
          <View style={styles.timeModalContainer}>
            <Text style={styles.timeModalText}>기록 시간 변경하기</Text>
            <DatePicker date={date} onDateChange={setDate} mode="date" />
            <View style={styles.timeButtons}>
              <TouchableOpacity onPress={handleCloseTimeModal}>
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseTimeModal}>
                <Text>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
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
  stampButton: {
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
  modalContainer: {
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
  modalTitleContainer: {
    flexDirection: 'row',
    display: 'flex',
    width: 393,
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
    width: 393,
    height: 60,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  stampContent: {
    flexDirection: 'row',
    display: 'flex',
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
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
    width: 393,
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
    width: 358,
    height: 0.7,
    backgroundColor: '#F0F0F0',
    margin: 16,
  },
  memoContainer: {
    width: 393,
    padding: 16,
    justifyContent: 'flex-start',
    gap: 7,
  },
  memoContent: {
    flexDirection: 'column',
    display: 'flex',
    width: 361,
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
    width: 393,
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
  timeModalContainer: {
    width: 393,
    height: 335,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 517,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.30,
    shadowRadius: 6,
    elevation: 30,
    alignItems: 'center',
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
  },
});

export default StampView;