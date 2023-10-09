import React, {useEffect, useState} from 'react';
import { Dimensions, View, Modal as ModalRN, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import realm, { ICustomStamp, createCustomStamp, deleteCustomStamp, getAllCustomStamps } from './src/localDB/document';
import * as amplitude from './AmplitudeAPI';
import {default as Text} from "./CustomText"
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets, useSafeAreaFrame, initialWindowMetrics } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;

const StampList = ({visible, closeModal}) => {
  // 각 스탬프의 상태를 관리하는 배열, 모두 기본값은 false로 초기화
  const [checkedStates, setCheckedStates] = useState(
    Array(20).fill(false)
  );

  const [customStamps, setCustomStamps] = useState<ICustomStamp[]>([]);
  

  const [addStampDataLabel, setAddStampDataLabel] = useState('');
  const [addStampDataEmotion, setAddStampDataEmotion] = useState('');

  const [isChecked, setIsChecked] = useState(false);

  const [stampCount, setStampCount] = useState(0);

  const [addStampModalVisible, setAddStampModalVisible] = useState(false);
  const [addStampButtonDisabled, setAddStampButtonDisabled] = useState(true);

  const [isLodingFinishModalVisible, setIsLodingFinishModalVisible] = useState(false);

  const [userName, setUserName] = useState('');

  const [{top,right,bottom,left},setSafeAreaInsets]= useState(initialWindowMetrics?.insets);

  useEffect(() => {
    const fetchStamps = async () => {
      const fetchedCustomStamps = await getAllCustomStamps();
      setCustomStamps(fetchedCustomStamps);
    };
    AsyncStorage.getItem('@UserInfo:userName')
      .then((value) => {
        if (value) {
          setUserName(value);
        }
      })
      .catch((error) => {
        console.error("Error fetching userName:", error);
      });
    fetchStamps();
  }, []);

  const handleRadioButtonPress = (index) => {
    amplitude.choiceDeleteCustomStampCandidate();
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !checkedStates[index];
    const count = newCheckedStates.filter((state) => state).length;
  
    setCheckedStates(newCheckedStates);
    setIsChecked(count > 0);
    setStampCount(count);
  };

  const handleDeleteStamp = () => {
    amplitude.deleteCustomStamp();
    // 라디오버튼 체크된 것들 삭제
    const selectedIndexes = checkedStates.reduce(
      (indexes, state, index) => (state ? [...indexes, index] : indexes),
      []
    );

    // 선택된 스탬프들을 삭제
    const newCustomStamps = customStamps.filter(
      (stamp, index) => !selectedIndexes.includes(index)
    );

    // // realm에서 선택된 스탬프들을 삭제
    // selectedIndexes.forEach(index => {
    //   deleteCustomStamp(customStamps[index]);
    // });

    // 선택된 스탬프들의 체크 상태 초기화
    const newCheckedStates = checkedStates.map((_, index) =>
      selectedIndexes.includes(index) ? false : checkedStates[index]
    );

    // 변경된 데이터와 상태 적용
    setCustomStamps(newCustomStamps);
    setCheckedStates(newCheckedStates);

    selectedIndexes.forEach(index => {
      deleteCustomStamp(customStamps[index]);
   });
    console.log("스탬프 삭제");
  };

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

  (() => {
    // AsyncStorage에서 userName 값을 가져와서 설정
    AsyncStorage.getItem('@UserInfo:userName')
      .then((value) => {
        if (value) {
          console.log(value);
          setUserName(value);
        }
      })
      .catch((error) => {
        console.error("Error fetching userName:", error);
      });
  })
  
  const styles = StyleSheet.create({
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
    fixModalContainer: {
      backgroundColor: 'white',
      width: '100%',
      height: '100%',
      marginTop: (Platform.OS==='ios' ? top : 0),
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
      marginBottom:(Platform.OS==='ios' ? 120+bottom : 60), 
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
    fixModalButton: {
      position: 'absolute',
      top: (Platform.OS==='ios' ? screenHeight-60*2-bottom : screenHeight-60), 
      width: '100%',
      height: 60,
      backgroundColor: '#FAFAFA',
      alignItems: 'center',
      justifyContent: 'center'
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
  });
  return (
    <ModalRN visible={visible} animationType='slide' transparent>
      <View style={styles.fixModalContainer}>
        <View style={styles.fixModalTitleContainer}>
          <View style={styles.fixModalTitleContent}>
            <TouchableOpacity onPress={closeModal}>
              <Image source={require('./assets/arrow-back.png')} />
            </TouchableOpacity>
            <Text style={styles.fixModalTitle}>스탬프 설정</Text>
          </View>
          <TouchableOpacity onPress={() => {
            amplitude.tryAddCustomStamp();
            setAddStampModalVisible(true);
          }}>
            <Image source={require('./assets/add.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.fixModalMessageContainer}>
          <Text style={styles.fixModalMessage}>감정스탬프를 삭제할 수 있다무🥬</Text>
        </View>
        <ScrollView style={styles.stampList}>
          {customStamps.map((stamp, index) => (
          <View key={stamp.id} style={styles.stampListContainer}>
            <RadioButton
              value="first"
              status={checkedStates[index] ? 'checked' : 'unchecked'}
              onPress={() => handleRadioButtonPress(index)}
            />
            <TouchableOpacity key={stamp.id} style={styles.moodInfo} onPress={() => handleRadioButtonPress(index)}>
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
                placeholder='🔥'
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
    </ModalRN>
  );
};



export default StampList;