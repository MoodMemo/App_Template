import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import * as repository from '../src/localDB/document';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StampClick from '../StampClick';
import Modal from "react-native-modal";
import {default as Text} from "../CustomText"
import realm from '../src/localDB/document';
import * as amplitude from '../AmplitudeAPI';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { Weekly } from './Weekly';

import dayjs from 'dayjs';
const weekOfYear = require("dayjs/plugin/weekOfYear");
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
import "dayjs/locale/ko"; //한국어
dayjs.locale("ko");
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

interface TimelineProps {
  data: repository.IPushedStamp[];
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {

  const [data_, setData] = useState(data);


  const dateFormat = {
    // ko-KR
    // hour: '2-digit', minute: '2-digit', hour12: true,
    hour: "numeric", minute: "numeric" ,
  };

  const [dropdownButtonVisible, setDropdownButtonVisible] = useState(false);

  const [stampClickModalVisible, setStampClickModalVisible] = useState(false);
  const closeStampClickModal = () => {
    setStampClickModalVisible(false);
  };

  const [isDeletingStamp, setIsDeletingStamp] = useState(false);
  const [tmpDeleteStamp, setTmpDeleteStamp] = useState(null);
  const handleDeleteButton = (deleteStamp: repository.IPushedStamp) => {
    console.log('deleteStamp: ', deleteStamp.emoji);
    setTmpDeleteStamp(deleteStamp);
    setDropdownButtonVisible(false);
    setIsDeletingStamp(true);
  }
  const handleDeleteConfirm = (deleteStamp: repository.IPushedStamp) => {
    const today = dayjs(deleteStamp.dateTime);
    amplitude.test1();
    realm.write(() => {
      repository.deletePushedStamp(deleteStamp);
    });
    // 스탬프가 삭제되면 상태(state)에서도 삭제해야 합니다.
    setData(getStamp(today));
  }
  return (
    <View style={Timelinestyles.container}>

      {data_.map((item, index) => (
        <View key={index} style={Timelinestyles.timelineItem}>
          
          {/* 이모지 */}       
          <View style={Timelinestyles.emojiContainer}>
            <Text style={{fontSize: 24, color: 'black',}}>{item.emoji}</Text>
            {index < data_.length - 1 && <View style={Timelinestyles.line2} />}
          </View>

          {/* 텍스트 */}
          <View style={Timelinestyles.block}>

            <View style={Timelinestyles.title}>
              <Text style={{fontSize: 12, color: '#212429'}}>{item.stampName}</Text>
              <View style={{flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 12, color: '#495057'}} >{item.dateTime.toLocaleTimeString('en-US', dateFormat)}    </Text> 
                {/* 수정 & 삭제 */}
                <View>
                  <TouchableOpacity onPress={() => setDropdownButtonVisible(true)}>
                    <EntypoIcon name='dots-three-horizontal' color="#212429" style={{ fontWeight: 'bold', fontSize: 10}} />
                  </TouchableOpacity>
                  {/* 1. 스탬프 수정 삭제 드롭다운 */}
                  <Modal 
                      isVisible={dropdownButtonVisible}
                      animationIn={"fadeIn"}
                      animationOut={"fadeOut"}
                      backdropOpacity={0}
                      onBackdropPress={() => setDropdownButtonVisible(false)}
                      style={{
                        position: 'absolute', // 모달의 위치를 조정하기 위해 절대 위치 지정
                        right: 6,
                        top: 255, // Y 좌표를 버튼 아래에 위치 + 버튼의 높이
                        // alignItems: 'center',
                        // justifyContent: 'flex-end',
                        // margin: 0,
                      }}
                      backdropTransitionInTiming={0} // Disable default backdrop animation
                      backdropTransitionOutTiming={0} // Disable default backdrop animation
                    >
                      <View style={TimelineDropDownStyles.dropdownContainer}>
                          <View style={TimelineDropDownStyles.dropdownButtonOption}>
                            <TouchableOpacity>
                              <Text style={TimelineDropDownStyles.dropdownButtonText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {handleDeleteButton(item);}}>
                              <Text style={TimelineDropDownStyles.dropdownButtonText}>삭제</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                  </Modal>
                </View>
                {/* 2. 스탬프 삭제 경고 모달 */}
                <Modal 
                  isVisible={isDeletingStamp}
                  animationIn={"fadeIn"}
                  animationOut={"fadeOut"}
                  backdropColor='#CCCCCC' 
                  backdropOpacity={0.9}
                  style={{ alignItems:'center' }}
                  backdropTransitionInTiming={0} // Disable default backdrop animation
                  backdropTransitionOutTiming={0} // Disable default backdrop animation
                >
                  <View style={TimelineDiaryStyles.finishLodingModal}>
                    {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
                    <Image 
                      source={require('../assets/colorMooMini.png')}
                      style={{ width: 68, height: (71 * 68) / 68 , marginTop: 60,}}></Image>
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
                      <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>정말로 기록한 스탬프를 삭제하겠냐</Text>
                      <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
                      <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>?</Text>
                    </View>
                    <View style={{alignItems: 'center',}}>
                      <Text style={{ color: '#475467', fontSize: 14, }}>되돌릴 수 없다무..!</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                      <View style={{ flexDirection: 'row', flex: 1, gap: 12}}>
                        <TouchableOpacity style={TimelineDiaryStyles.cancelOut2EditBtn} onPress={() => {setIsDeletingStamp(false); amplitude.test1();}}>
                          <Text style={{ color: '#344054', fontSize: 16, fontWeight: '600',}}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={TimelineDiaryStyles.confirmBtn} onPress={() => {handleDeleteConfirm(tmpDeleteStamp); setIsDeletingStamp(false);}}>
                          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                              
                  </View>
                </Modal>
              </View>
              {/* <Modal isVisible={stampClickModalVisible}> -> 여기를 풀면 스탬프 클릭 모달이 뜬다 ...?
                <StampClick visible={stampClickModalVisible} onClose={closeStampClickModal}/>
              </Modal> */} 
              
            </View>

            <View style={Timelinestyles.line}></View>

            <Text style={Timelinestyles.title}>{item.memo}</Text>
            {/* <Text style={styles.title}>{item.imageUrl}</Text> */}

          </View>
        </View>
      ))}
    </View>
  );
};

const Timelinestyles = StyleSheet.create({
  container: {
    flex: 1, // 양쪽 확장
    alignItems: 'center',
    // backgroundColor: 'pink', 
    alignSelf: 'flex-start', // 상단 정렬
  },
  timelineItem: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  block: {
    flex: 1,
    color: '#212429',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F0',
    borderWidth: 1
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginHorizontal: 10,
    marginVertical: 9,
    fontSize: 12,
    color: '#212429',
  },
  line: {
    left: 0,
    right: 0,
    borderTopWidth: 1, /* 선분 스타일 설정 (여기서는 1px 두께의 선으로 설정) */
    borderTopColor: '#F0F0F0', /* 선분 색상 설정 */
  },
  line2: {
    position: 'absolute',
    top: 40,
    bottom: -10,
    left: 15,
    width: 1.5,
    backgroundColor: '#F0F0F0',
  },
  emojiContainer: {
    flexDirection: 'column',
    // alignItems: 'center',
    marginRight: 10,
  },
});
const TimelineDropDownStyles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  dropdownButtonOption: {
    fontSize: 14,
    color: '#212429',
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    borderRadius: 4,
    fontWeight: 'bold',
    shadowColor: 'black',
    shadowOpacity: 1,        // 그림자 투명도
    shadowRadius: 50,           // 그림자 블러 반경
    elevation: 4,              // 안드로이드에서 그림자를 표시하기 위한 설정
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#212429',
    paddingVertical: 5,
    paddingRight: 30,
    paddingLeft: 15,
  },
});
const TimelineDiaryStyles = StyleSheet.create({
  diaryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    alignItems: 'baseline', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    color: '#212429',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  keyword: {
    fontSize: 12,
    color: '#212429',
    marginBottom: 10,
    marginRight: 10,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fafafa',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // 선의 색상을 원하는 값으로 변경하세요.
    marginTop: 5,
    marginBottom: 10,
  },
  generateButton: {
    color: '#495057',
    height: 46,
    alignItems: 'center',
    backgroundColor: '#72D193',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  generateButtonText: {
    color: '#495057',
    fontWeight: 'bold',
    fontSize: 14,
  },
  uploadedImage: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  lodingModal: {
    backgroundColor: '#FFFAF4', 
    justifyContent: 'space-between', // 상하로 딱 붙이기
    // justifyContent: 'space-around', 
    // alignItems: 'flex-start', 
    alignItems: 'center', // 가운데 정렬
    flexDirection: 'column',
    borderRadius: 12, 
    paddingHorizontal: 16,
    width: 343, 
    height: 302,
    // height: 218,
    shadowColor: 'black',
    shadowRadius: 50,           // 그림자 블러 반경
    elevation: 5, 
  },
  cancelBtn: {
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center',
    color: '#344054', 
    padding: 10,
    marginBottom: 16,
    backgroundColor: 'white', 
    borderColor: '#72D193',
    borderWidth:1,
    borderRadius: 8,
    flex: 1,
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
  cancelOut2EditBtn: {
    borderColor: '#D0D5DD', borderWidth: 1,
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#ffffff', 
    borderRadius: 8,
    flex: 1,
  },
  editDiary: {
    fontSize: 16, 
    color: '#212429', 
    margin: 0, 
    marginBottom:7, 
    paddingVertical: 5, 
    paddingLeft: 15, 
    paddingRight: 15, 
    borderColor: '#F0F0F0', 
    borderWidth:1, 
    borderRadius: 5, 
    paddingHorizontal:10, 
    flex:1
  }
});

export default Timeline;

