import React, {useEffect, useRef, useState} from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal as ModalRN, Image, TextInput, TouchableWithoutFeedback, Dimensions, Platform, Button, SafeAreaView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import realm, { ICustomStamp, createCustomStamp, createPushedStamp, getAllCustomStamps, updateCustomStampPushedCountById } from './src/localDB/document';
import Weekly from './weeklyView/Weekly'
import { useNavigation } from '@react-navigation/native';
import * as amplitude from './AmplitudeAPI';
import {default as Text} from "./CustomText";
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets, useSafeAreaFrame, initialWindowMetrics } from 'react-native-safe-area-context';
import * as ImagePicker from 'react-native-image-picker';

const includeExtra = true;
// 화면의 가로 크기
const screenWidth = Dimensions.get('window').width;
// screenWidth가 500보다 크면 500으로, 작으면 screenWidth로 설정
const width = screenWidth > 500 ? 500 : screenWidth;

// 4개의 버튼과 각 버튼 사이의 간격을 위한 값
const buttonWidth = (width - 56 - (3 * 20)) / 4; // 56은 양쪽의 마진 합, 3*20은 3개의 간격

// 기본 디자인에서의 버튼 너비
const defaultButtonWidth = 69;

// 비율 계산
const scale = buttonWidth / defaultButtonWidth;

const StampView = () => {
  const [customStamps, setCustomStamps] = useState<ICustomStamp[]>([]);

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedEmotionLabel, setSelectedEmotionLabel] = useState(null);
  const [selectedEmotionId, setSelectedEmotionId] = useState('');

  const [addStampDataLabel, setAddStampDataLabel] = useState('');
  const [addStampDataEmotion, setAddStampDataEmotion] = useState('');

  const [addStampModalVisible, setAddStampModalVisible] = useState(false);
  const [addStampButtonDisabled, setAddStampButtonDisabled] = useState(true);

  const [isLodingFinishModalVisible, setIsLodingFinishModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(date);

  const [memo, setMemo] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [numberOfLines, setNumberOfLines] = useState(1);

  const [{top,right,bottom,left},setSafeAreaInsets]= useState(initialWindowMetrics?.insets);

  const navigation = useNavigation();

  // screenWidth가 500보다 크면 500으로, 작으면 screenWidth로 설정
  const iOSwidth = width > 500 ? 500 : width;

  // 4개의 버튼과 각 버튼 사이의 간격을 위한 값
  const iOSButtonWidth = (iOSwidth - 56 - (3 * 20)) / 4; // 56은 양쪽의 마진 합, 3*20은 3개의 간격

  const [response, setResponse] = React.useState<any>(null);

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, (response) => {
        setResponse(response);
        if (response?.assets && response?.assets[0]?.uri) {
          setSelectedImageUri(response?.assets[0]?.uri);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, (response) => {
        setResponse(response);
        if (response?.assets && response?.assets[0]?.uri) {
          // if(Platform.OS === 'ios') {
          //   setSelectedImageUri('~' + response?.assets[0]?.uri.substring(response?.assets[0]?.uri.indexOf('/tmp/')));
          // }
          // Plaform.OS가 iOS이고 response?.assets[0]?.uri가 /tmp/가 포함되어 있으면
          if(Platform.OS === 'ios' && response?.assets[0]?.uri.includes('/tmp/')) {
            setSelectedImageUri('~' + response?.assets[0]?.uri.substring(response?.assets[0]?.uri.indexOf('/tmp/')));
          }
          else if(Platform.OS === 'ios' && response?.assets[0]?.uri.includes('/Documents/')) {
            setSelectedImageUri('~' + response?.assets[0]?.uri.substring(response?.assets[0]?.uri.indexOf('/Documents/')));
          }
          else {
            setSelectedImageUri(response?.assets[0]?.uri);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const stampsListener = (collection, changes) => {
      setCustomStamps([...collection]);
    };
  
    const stampsCollection = realm.objects('CustomStamp');
    stampsCollection.addListener(stampsListener);
  
    AsyncStorage.getItem('@UserInfo:userName')
      .then((value) => {
        if (value) {
          setUserName(value);
        }
      })
      .catch((error) => {
        console.error("Error fetching userName:", error);
      });
    return () => {
      stampsCollection.removeListener(stampsListener);
    }
  }, []);  

  const handleCreatePushedStamp = async () => {
    amplitude.submitStamp();
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
        imageUrl: selectedImageUri, // 이미지를 추가하려면 여기에 이미지 URL을 추가
      });
    });

    console.log("memo : ", memo);
    console.log("imageUrl : ", selectedImageUri);

    updateCustomStampPushedCountById(selectedEmotionId, 1);
    // 모달 닫기
    await onClose();

    // Weekly.tsx 뷰로 이동
    navigation.navigate('Weekly', { showPopup: true });
  }

  const handleAddStamp = (label, emotion) => {
    amplitude.submitAddCustomStamp(label);
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
    setIsLodingFinishModalVisible(true);
    setAddStampDataLabel('');
    console.log("스탬프 추가");
  };

  const onClose = async () => {
    // amplitude.cancelStamp();
    setModalVisible(false);
    setMemo('');
  }

  const handleMemoChange = (text) => {
    setMemo(text);
    setNumberOfLines(text.split('\n').length);
  };

  const handleButtonPress = (stampButton) => {
    amplitude.pushStamp(stampButton.stampName);
    setSelectedEmotion(stampButton.emoji);
    setSelectedEmotionLabel(stampButton.stampName);
    setSelectedEmotionId(stampButton.id);
    setDate(new Date());
    setModalVisible(true);
  }

  const handleOpenTimeModal = () => {
    amplitude.tryChangeStampTime();
    setTimeModalVisible(true);
    console.log("setTimeModalVisible : ", timeModalVisible);
  }
  const handleCloseTimeModal = () => {
    setTempDate(date);
    setTimeModalVisible(false);
  }

  const handleCancleTimeModal = () => {
    amplitude.cancelChangeStampTime();
    setTempDate(date);
    handleCloseTimeModal();
  }
  
  const handleSubmitTimeModal = () => {
    amplitude.submitChangeStampTime();
    setDate(tempDate);
    handleCloseTimeModal();
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 13,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stampView: {
      top: 0,
      alignContent: 'center',
      flexDirection: 'row', // 버튼들을 가로로 배열
      flexWrap: 'wrap', // 가로로 공간이 부족하면 다음 줄로 넘어감
      justifyContent: 'space-between', // 버튼들 사이의 간격을 동일하게 분배
      height: 'auto',
      marginLeft: 28,
      marginRight: 28,
      maxWidth: 500, // stampView의 최대 너비 설정
      alignSelf: 'center', // 화면의 중앙에 위치하도록 설정
      columnGap: 20,
    },
    stampButton: {
      ...Platform.select({
        ios : {
          width: iOSButtonWidth,
        },
        android : {
          width: buttonWidth, 
        },
      }),
      height: 84 * scale, // 기본 높이에 비율을 곱함
      borderRadius: 12 * scale, // 기본 borderRadius에 비율을 곱함
      marginBottom: 20 * scale, // 기본 marginBottom에 비율을 곱함
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#7CD0B2',
      backgroundColor: '#FFFFFF',
      gap: 10,
    },
    blank: {
      ...Platform.select({
        ios : {
          width: iOSButtonWidth,
        },
        android : {
          width: buttonWidth, 
        },
      }),
      height: 84 * scale, // 기본 높이에 비율을 곱함
      borderRadius: 12 * scale, // 기본 borderRadius에 비율을 곱함
      marginBottom: 20 * scale, // 기본 marginBottom에 비율을 곱함
      justifyContent: 'center',
      alignItems: 'center',
      // borderWidth: 1,
      // borderStyle: 'dashed',
      // borderColor: '#7CD0B2',
      // backgroundColor: '#FFFFFF',
      gap: 10,
    },
    buttonEmotion: {
      fontSize: 24 * scale, // 기본 fontSize에 비율을 곱함
    },
    buttonText: {
      fontSize: 12 * scale + 1, // 기본 fontSize에 비율을 곱함
      fontWeight: '400',
      color: '#212429',
      textAlign: 'center',
      fontFamily: 'Pretendard',
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
      fontSize: 24 * scale,
    },
    addStampModalLabelBox: {
      width: '80%',
      height: 50,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      backgroundColor: 'white',
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addStampModalLabel: {
      fontSize: 16,
    },
    finishLodingModal: {
      backgroundColor: '#FFFAF4', 
      justifyContent: 'space-between', // 상하로 딱 붙이기
      alignItems: 'center', // 가운데 정렬
      flexDirection: 'column',
      borderRadius: 12, 
      paddingHorizontal: 16,
      width: 343, 
      height: 284,
      shadowColor: 'black',
      shadowRadius: 50,           // 그림자 블러 반경
      elevation: 5, 
    },
    confirmBtn: {
      alignSelf: 'center',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 10,
      marginBottom: 16,
      backgroundColor: '#72D193', 
      borderRadius: 8,
      flex: 1,
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
      marginTop: (Platform.OS==='ios' ? top : 0),
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
      fontSize: 18,
      fontFamily: 'Pretendard',
      fontWeight: '400',
      fontStyle: 'normal',
    },
    modalText: {
      fontFamily: 'Pretendard',
      fontSize: 14,
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
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 24,
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
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 24,
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
      fontSize: 16,
      fontFamily: 'Pretendard',
      fontWeight: '400',
      fontStyle: 'normal',
      lineHeight: 24,
    },
    maxLength: {
      color: '#495057',
      textAlign: 'right',
      fontSize: 14,
      fontFamily: 'Pretendard',
      fontWeight: '400',
      fontStyle: 'normal',
      lineHeight: 24,
    },
    imgContainer: {
      flexDirection: 'column',
      width: '100%',
      padding: 16,
      justifyContent: 'flex-start',
      gap: 10,
      // backgroundColor: 'gray'
    },
    imgContent: {
      flexDirection: 'row',
      // flexWrap: 'wrap',
      width: '100%',
      gap: 12,
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
      backgroundColor: '#FAFAFA',
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
      // justifyContent: 'flex-end', // 이 부분이 모달을 하단으로 밀어줍니다.
      justifyContent: 'center', // 중앙에 수직으로 정렬
      alignItems: 'center',    // 중앙에 수평으로 정렬
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    timeModalContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      // width: '100%',
      width: '80%',  // 화면의 80%만 차지하도록
      padding: 20,
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
      fontSize: 18,
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
    // submitButton 영역 확장
    submitButton: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    safeAreaContainer: {
      flex: 1,
      backgroundColor: 'aliceblue',
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 8,
    },
    imageContainer: {
      marginVertical: 24,
      alignItems: 'center',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 6,
      backgroundColor: 'gray',
      marginRight: 12,
    },
  
  });
  return (
    <>
    {addStampModalVisible && (
      <View style={styles.overlay} />
    )}
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.stampView} horizontal={false}>
        {customStamps.map((stampButton) => (
          <TouchableOpacity key={stampButton.id} style={styles.stampButton} onPress={() => {handleButtonPress(stampButton)}}>
            <Text style={styles.buttonEmotion}>{stampButton.emoji}</Text>
            <Text style={styles.buttonText}>{stampButton.stampName}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.stampButton} onPress={() => {
            amplitude.tryAddCustomStamp();
            setAddStampModalVisible(true);
        }}>
          <Image source={require('./assets/add.png')} />
        </TouchableOpacity>
        {customStamps.length%4 === 1 || customStamps.length%4 === 2? (<View style={styles.blank}/>) : (<View/>)}
        {customStamps.length%4 === 1 ? (<View style={styles.blank}/>) : (<View/>)}
      </ScrollView>
      {addStampModalVisible && (
        <View style={styles.overlay} />
      )}
      <ModalRN visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>

          { !timeModalVisible ? (
            // 첫 번째 모달의 컨텐츠
            <>
              <View style={styles.modalTitleContainer}>
                <TouchableOpacity onPress={() => {onClose(); amplitude.cancelStamp();}}>
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
                  <TouchableOpacity onPress={handleOpenTimeModal}>
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
                      onFocus={() => {
                        amplitude.editStampMemo();
                      }}
                      value={memo}
                      numberOfLines={numberOfLines}
                    />
                    <Text style={styles.maxLength}>{memo.length}/500</Text>
                  </View>
                </View>
                <View style={styles.imgContainer}>
                  <Text style={styles.modalText}>사진 추가</Text>
                  <View style={styles.imgContent}>
                    <TouchableOpacity style={styles.imgButton} onPress={() => onButtonPress('library', {
                      selectionLimit: 1,
                      mediaType: 'photo',
                      includeBase64: false,
                      includeExtra,
                    })}>
                      <Image source={require('./assets/add-circle.png')} />
                      <Text style={styles.imgText}>사진 추가</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal={true}>
                    {response?.assets &&
                      response?.assets.map(({uri}: {uri: string}) => (
                        <View key={uri}>
                          <Image
                            resizeMode="cover"
                            resizeMethod="scale"
                            style={styles.image}
                            source={{uri: uri}}
                          />
                        </View>
                    ))}
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>
            </>
          ) : (
            // 두 번째 모달의 컨텐츠 (시간 변경 모달)
            <>
              <TouchableWithoutFeedback onPressOut={handleCloseTimeModal}>
                <View style={styles.timeModalWrapper}>
                  <TouchableWithoutFeedback onPressIn={(e) => e.stopPropagation()}>
                    <View style={styles.timeModalContainer}>
                      <Text style={styles.timeModalText}>기록 시간 변경하기</Text>
                      <DatePicker date={tempDate} onDateChange={setTempDate} mode="datetime" theme="light"/>
                      <View style={styles.timeButtons}>
                        <TouchableOpacity onPress={handleCancleTimeModal}>
                          <Text style={{fontSize:16}}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 10, right: 20}} onPress={handleSubmitTimeModal}>
                          <Text style={{fontSize:16}}>확인</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </>
          )}

        </View>
      </ModalRN>

      {/* <Modal visible={timeModalVisible} animationType="fade" transparent onRequestClose={handleCloseTimeModal}>
        <TouchableWithoutFeedback onPressOut={handleCloseTimeModal}>
          <View style={styles.timeModalWrapper}>
            <TouchableWithoutFeedback onPressIn={(e) => e.stopPropagation()}>
              <View style={styles.timeModalContainer}>
                <Text style={styles.timeModalText}>기록 시간 변경하기</Text>
                <DatePicker date={tempDate} onDateChange={setTempDate} mode="datetime" theme="light"/>
                <View style={styles.timeButtons}>
                  <TouchableOpacity onPress={handleCancleTimeModal}>
                    <Text>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 10, right: 20}} onPress={handleSubmitTimeModal}>
                    <Text>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
    </View>
    {/* 모달 영역 */}
    <ModalRN visible={addStampModalVisible} animationType='slide' transparent>
        <View style={styles.addStampModalContainer}>
          <View style={styles.addStampModalTitleContainer}>
            <TouchableOpacity onPress={() => {
              amplitude.cancelAddCustomStamp();
              setAddStampModalVisible(false);
              setAddStampDataEmotion('');
              setAddStampDataLabel('');
              setAddStampButtonDisabled(true);
            }}>
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
                placeholder='😊'
                placeholderTextColor='rgba(0, 0, 0, 0.2)'
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
    </ModalRN>
    <Modal 
      isVisible={isLodingFinishModalVisible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      backdropColor='#CCCCCC' 
      backdropOpacity={0.9}
      style={{ alignItems:'center' }}
      backdropTransitionInTiming={0} // Disable default backdrop animation
      backdropTransitionOutTiming={0} // Disable default backdrop animation
    >
      <View style={styles.finishLodingModal}>
        {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
        <Image 
          source={require('./assets/colorMooMini.png')}
          style={{ width: 68, height: (71 * 68) / 68 , marginTop: 60,}}></Image>
        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
          <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>스탬프가 등록됐다</Text>
          <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
          <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>!~</Text>
        </View>
        <View style={{alignItems: 'center',}}>
          <Text style={{ color: '#475467', fontSize: 14, }}>{userName}의 새로운 감정을 환영한다무~</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', flex: 1,}}>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => {setIsLodingFinishModalVisible(false);}}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>       
      </View>
    </Modal>
    </>
  );
};

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Take Video',
    type: 'capture',
    options: {
      saveToPhotos: true,
      formatAsMp4: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      formatAsMp4: true,
      includeExtra,
    },
  },
  {
    title: 'Select Image or Video\n(mixed)',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'mixed',
      includeExtra,
    },
  },
];

if (Platform.OS === 'ios') {
  actions.push({
    title: 'Take Image or Video\n(mixed)',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'mixed',
      includeExtra,
      presentationStyle: 'fullScreen',
    },
  });
}

export default StampView;