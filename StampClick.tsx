import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
// import Modal from 'react-native-modal';

const StampClick = ({visible, onClose}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [memo, setMemo] = useState('');
  const [numberOfLines, setNumberOfLines] = useState(1);
  const [images, setImages] = useState([]);

  // const [notDevelopedModalVisible, setNotDevelopedModalVisible] = useState(false);

  const handleMemoChange = (text) => {
    setMemo(text);
    setNumberOfLines(text.split('\n').length);
  };

  return (
    <View style={styles.modalContainer}>
      {/* 모달 내용 */}
      <View style={styles.modalTitleContainer}>
        <TouchableOpacity onPress={() => onClose()}>
          <Image source={require('./assets/close.png')} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>감정 기록</Text>
        <TouchableOpacity onPress={() => onClose()}>
          <Image source={require('./assets/check.png')} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={false}>
      <View style={styles.stampContainer}>
        <Text style={styles.modalText}>찍은 스탬프</Text>
        <View style={styles.stampContent}>
          <Text style={styles.stampText}>🥲</Text>
          <Text style={styles.stampText}>여기어떻게할지논의해야함</Text>
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
      {/* <View style={styles.imgContainer}>
        <Text style={styles.modalText}>사진 추가</Text>
        <TouchableOpacity style={styles.imgButton} onPress={() => {
          setNotDevelopedModalVisible(true);
        }}>
          <Image source={require('./assets/add-circle.png')} />
          <Text style={styles.imgText}>사진 추가{"\n"}{images.length}/3</Text>
        </TouchableOpacity>
      </View> */}
      {/* <Modal isVisible={notDevelopedModalVisible}
        animationIn={"fadeIn"}
        animationInTiming={200}
        animationOut={"fadeOut"}
        animationOutTiming={200}
        onBackdropPress={() => {
            setNotDevelopedModalVisible(!notDevelopedModalVisible);
        }}
        backdropColor='#CCCCCC'//'#FAFAFA'
        backdropOpacity={0.8}
        style={{
            alignItems:'center'
        }}>
          <View style={{
            backgroundColor:"#FFFFFF",
            width:'80%',
            height:'20%',
            justifyContent:'center',
            alignItems:'center',
            borderRadius:10
          }}>
            <View style={{
              }}>
                <Text style={{fontSize: 17, color:"#495057"}}>사진 업로드는 개발 중!</Text>
            </View>
          </View>
        </Modal> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: 'auto',
    height: 785,
    flexShrink: 0,
    borderRadius: 16,
    marginTop: 67,
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
    width: 320,
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

export default StampClick;