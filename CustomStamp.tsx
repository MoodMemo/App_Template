import React, {useEffect, useRef, useState} from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Modal as ModalRN, Image, TextInput, TouchableWithoutFeedback, Dimensions, Platform, Button, SafeAreaView } from 'react-native';
import {default as Text} from "./CustomText";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dropdown from './Dropdown';
import StampView from './StampView';


{/* <nodata.Present_FinishWriting_MiniView handleStampORDiaryFromPFM={handleStampORDiaryFromPFM}/> */}
// 이런 느낌으로 쓰는거다
const CustomStamp = ({handleFixButtonFromCSP}) => {

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  }; // 얘는 아직 안쓰는 것 같아서 끌어올리기 함수는 안 만들었어용
  const handleFixButton = () => {
    // amplitude.showCustomStampList();
    // setFixModalVisible(true);
    // <- 이거 함수를 끌어오는거
    handleFixButtonFromCSP();
  };
  const [fixModalVisible, setFixModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];

  return (
    <View style={newStyles.customStamps}>
      <Text style={{color: '#212429', fontSize: 18, alignSelf: 'center', marginTop: 15,}}>나의 감정스탬프들</Text>
      {/* 옵션 & 삭제 영역 */}
      <View style={styles.options}>
        <Dropdown options={options} onSelectOption={handleOptionSelect} />
        <TouchableOpacity style={styles.fixButton} onPress={handleFixButton}>
          {/* <Image source={require('./assets/edit.png')} /> */}
          <MCIcon name='trash-can' color="#495057" style={{ fontWeight: 'bold', fontSize: 20}}/>
        </TouchableOpacity>
        {/* // 된 거 */}
        {/* <Button title="사진 테스트" onPress={checkPermission}/> */}
        {/* <Button title="사진 불러오기" onPress={fetchPhotos}/> */}
        {/* <Button title="사진 모달 띄우기" onPress={() => {
          fetchPhotos();
          setIsPhotoModalVisible(true);
        }}/> */}
      </View>
      {/* 감정 스탬프 뷰 */}
      <StampView/>
    </View>
  );
}
const styles = StyleSheet.create({
  options: {
    flexDirection: 'row', // 옵션들을 가로로 배치
    justifyContent: 'space-between', // 옵션들 사이 간격을 동일하게 배치
    alignItems: 'center', // 옵션들을 세로로 가운데 정렬
    marginTop: 23,
    marginHorizontal: 28,
  },
  fixButton: {
    width: 20,
    height: 20,
  },
});
const newStyles = StyleSheet.create({
  moo_status: {
    marginTop: 28, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  customStamps: {
    backgroundColor: '#fff', width: '100%', flex:1, alignSelf: 'center',marginTop: 44,
    elevation: 4, 
    shadowOffset: {width: 0, height: Platform.OS==='android' ? -4 : 0},
    shadowOpacity: Platform.OS==='android' ? 0.5 : 0.1,
    borderTopLeftRadius: 20, borderTopRightRadius: 20
  },
});

export default CustomStamp;