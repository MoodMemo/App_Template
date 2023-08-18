import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { deleteUserStamp } from '../src/graphql/mutations';
import Modal from "react-native-modal";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as repository from '../src/localDB/document';
import realm from '../src/localDB/document';
import * as amplitude from '../AmplitudeAPI';

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

import sendDailyReport from './AIService';
import { getUserAsync, DailyReportRequest } from './AIService';
import Timeline from './Timeline';
import axios, { CancelToken } from 'axios';
import { Card } from 'react-native-paper';
import StampClick from '../StampClick';
import StampView from '../StampView';

import * as Sentry from '@sentry/react-native';


interface DropdownProps {
  label: string;
  options: { label: string; value: number }[];
  selectedValue: number;
  onValueChange: (value: number) => void;
}
const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    amplitude.clickDropDown();
    setIsOpen(!isOpen);
  };

  const handleOptionPress = (value: number) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={dropDownStyles.dropdownContainer}>
      
      <TouchableOpacity onPress={toggleDropdown} style={dropDownStyles.dropdownButton}>
        <View>
          <Text style={dropDownStyles.dropdownButtonText}>
            {selectedValue}{label}
          </Text>
          <FontAwesomeIcon name='sort-down' size={16} color="#737373" style={{position: 'absolute', right: 7, top: 5}}/>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={dropDownStyles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleOptionPress(option.value)}
              style={{ padding: 5, }}
            >
              <Text style={{ color: '#212429', fontSize: 12, marginLeft: 5}}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Weekly = () => {
  // 1. 오늘 날짜 & 2. 스탬프리스트
  const [today, setToday] = useState<dayjs.Dayjs>(dayjs());
  const handleTodayChange = (date: dayjs.Dayjs) => { setToday(date); amplitude.changeToday();};

  const [selectedYear, setSelectedYear] = useState<number>(today.year());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.month() + 1); // 1월이 0이라서 +1 해줘야 함
  const getWeekOfMonth = (date: dayjs.Dayjs) => {
    const weekOfMonth = date.week() - dayjs(date).startOf('month').week() + 1;
    return weekOfMonth;
  }; const [selectedWeek, setSelectedWeek] = useState<number>(getWeekOfMonth(today));
  const handleYearChange = (year: number) => { setSelectedYear(year); amplitude.changeYear(); };
  const handleMonthChange = (month: number) => { setSelectedMonth(month); amplitude.changeMonth(); };
  const handleWeekChange = (week: number) => { setSelectedWeek(week); amplitude.changeWeek();};

  const getDatesForWeek = () => {
    var tmpDate = null;
    if (selectedWeek === 1) tmpDate = dayjs().year(selectedYear).month(selectedMonth - 1).date(1);
    else tmpDate = dayjs().year(selectedYear).month(selectedMonth - 1).date((selectedWeek - 1) * 7 + 1);
    return tmpDate.startOf('week');
  }; const startDate = getDatesForWeek();

  // 3. 감정 리스트
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // 4. AI 일기 생성 버튼
  const todayReport = repository.getDailyReportsByField("date", today.format('YYYY-MM-DD'));
  const [isLodingModalVisible, setIsLodingModalVisible] = useState(false);
  const [isLodingFinishModalVisible, setIsLodingFinishModalVisible] = useState(false);
  const [isCannotModalVisible, setIsCannotModalVisible] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  let cancelTokenSource = axios.CancelToken.source();
  const handleGenerateDiary = () => {
    Sentry.captureMessage('[일기 생성] 사용자가 일기 생성 버튼을 눌렀습니다!');

    setIsLodingModalVisible(true);

    const todayStampList = [];
    getStamp(today).forEach((stamp) => {
      console.log("stamp.dateTime: ", stamp.dateTime);
      todayStampList.push({
        dateTime: stamp.dateTime,
        stampName: stamp.stampName,
        memo: stamp.memo,
      });
    });
    const request = {
      userDto: getUserAsync(), // from async storage
      todayStampList: todayStampList,
    }

    console.log('ai 서버와의 통신 시작합니다');
    sendDailyReport(request, cancelTokenSource.token)
      .then((response) => {
        amplitude.test1();
        if (!isCanceled) {
          console.log('date: ', response.date);
          realm.write(() => {
            amplitude.test2();
            console.log('title: ', response.title);
            repository.createDailyReport({
              // date: dayjs(response.date).add(1, 'day').format('YYYY-MM-DD'),
              date: response.date, // todo - ai 서버 로직 변경하면 이거로 수정해야함 
              title: response.title,
              bodytext: response.bodytext,
              keyword: response.keyword,
            });
            console.log("create default daily report finished");
          });
          setIsLodingModalVisible(false);
          setIsLodingFinishModalVisible(true);
        }
      })
      .catch((error) => {
        amplitude.test3();
        if (axios.isCancel(error)) {
          amplitude.test4(error.message);
          console.log('Request canceled', error.message);
        } else {
          amplitude.test5(error.message);
          console.log('Error', error.message);
          setIsLodingModalVisible(false);
          // todo - 에러 처리 해야함
      }});
  };
  const cancelRequest = () => {
    setIsCanceled(true);
    cancelTokenSource.cancel('Request canceled by the user');
  };
  // useEffect(() => {
  //   if (todayReport) {
  //     setEditedTitle(todayReport.title);
  //     setEditedBodytext(todayReport.bodytext);
  //   }
  // }, [todayReport]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todayReport ? todayReport.title : '');
  const [tmpEditedTitle, setTmpEditedTitle] = useState(editedTitle);
  const [editedBodytext, setEditedBodytext] = useState(todayReport ? todayReport.bodytext : '');
  const [tmpEditedBodyText, setTmpEditedBodyText] = useState(editedBodytext);
  const handleEditButton = () => { 
    Sentry.captureMessage('[일기 수정] 사용자가 일기 수정 버튼을 눌렀습니다!');
    setIsEditMode(true); 
  };
  const handleCancelButton = () => { 
    setIsEditMode(false);
    setEditedTitle(tmpEditedTitle);
    setEditedBodytext(tmpEditedBodyText);
  };
  const handleSaveButton = () => {
    realm.write(() => {
      const reportToUpdate = realm.objects('DailyReport').filtered('date = $0', todayReport.date)[0];
      if (reportToUpdate) {
        reportToUpdate.title = editedTitle;
        reportToUpdate.bodytext = editedBodytext;
      }
    });
    setIsEditMode(false);
    setTmpEditedTitle(editedTitle);
    setTmpEditedBodyText(editedBodytext);
  };
  const handleEditedTitleChange = (text) => {
     setEditedTitle(text);
  };

  const handleEditedBodyTextChange = (text) => {
    setEditedBodytext(text);
  };

  // tmp_createDummyData(); 

  // console.log(repository.getAllCustomStamps()[0].id);
  // repository.updateCustomStampPushedCountById('33456232-ac6e-43f5-8a55-9c05c23020e3', -3);
  // console.log(repository.getAllCustomStamps()[0].pushedCnt);
  return (
    
    <View style={{backgroundColor: '#FAFAFA', flex:1}}>


      {/* 1 & 2 */}
      <View style={{backgroundColor: 'white', zIndex: 1,}}>

        {/* 1. 년, 월, 주 선택 부분 */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
          <Dropdown
            label="년"
            options={[
              { label: '2023년', value: 2023 },
              { label: '2024년', value: 2024 },
              // 이하 생략
            ]}
            selectedValue={selectedYear}
            onValueChange={handleYearChange}
          />
          <Dropdown
            label="월"
            options={[
              { label: '8월', value: 8 },
              { label: '9월', value: 9 },
              { label: '10월', value: 10 },
              { label: '11월', value: 11 },
              { label: '12월', value: 12 },
              // 이하 생략
            ]}
            selectedValue={selectedMonth}
            onValueChange={handleMonthChange}
          />
          <Dropdown
            label="주"
            options={[
              { label: '1주', value: 1 },
              { label: '2주', value: 2 },
              { label: '3주', value: 3 },
              { label: '4주', value: 4 },
              { label: '5주', value: 5 },
              // 이하 생략
            ]}
            selectedValue={selectedWeek}
            onValueChange={handleWeekChange}
          />
        </View>

        {/* 2. 이번 주의 요일, 날짜, 이모지들 */}
        <View style={styles.emojisContainer}>
          {/* TODO - 스탬프가 7개 이상일 경우 +n 등을 띄워야 함 */}
          {getDatesBetween(startDate).map((date) => (
            <TouchableOpacity key={date.format('YYYYMMDD')} onPress={() => handleTodayChange(date)}>
              <View style={[styles.day, date.isSame(today, 'day') && styles.day_today]}>
                <Text style={[
                  styles.dayText,
                  date.day() === 0 && styles.dayText_sunday]}>{date.format('ddd')}</Text>
                <Text style={[
                  styles.dayText, 
                  date.day() === 0 && styles.dayText_sunday,
                  date.isSame(today, 'day') && styles.dayText_today,
                  date.isAfter(dayjs()) && styles.dayText_notYet]}>{date.format('DD')}</Text>
                <Text style={[
                  styles.dayText,
                  { flex:1,
                    fontSize: getEmoji(getStamp(date)).length >= 3 ? 14 : 14}
                  ]}>{getEmoji(getStamp(date))}</Text>
              </View>
            </TouchableOpacity> 
          ))}
        </View>

      </View>

      {/* 3 & 4 & 5 */}
      {getEmoji(getStamp(today)).length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image 
            source={require('../assets/emptyMoo.png')}
            style={{ width: 64, height: (67 * 64) / 64 }} // 비율을 유지하며 height 자동 조절
          />
          <Text style={{fontSize: 14, color: '#dbdbdb', marginTop: 16}}>기록된 감정 스탬프가 없다무..</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{backgroundColor: '#FAFAFA', }}>
          
          {/* 3. 오늘의 감정 리스트 */}
          <View style={styles.title}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#212429'}}>감정 리스트</Text>
            <TouchableOpacity onPress={() => {
              setIsDetailModalVisible(!isDetailModalVisible),
              amplitude.showDetailModal();
              }}>
              <Text style={{fontSize: 12, color: '#495057'}}>자세히 보기</Text>
              {/* <Modal presentationStyle={"fullScreen pageSheet, formSheet"}/> */}
              <Modal
                isVisible = {isDetailModalVisible}
                // presentationStyle='pageSheet'
                animationIn={"fadeIn"}
                animationInTiming={200}
                animationOut={"fadeOut"}
                animationOutTiming={200}
                onBackdropPress={() => {setIsDetailModalVisible(!isDetailModalVisible); amplitude.backToWeeklyFromDetailModal();}}
                backdropColor='#CCCCCC' 
                backdropOpacity={0.9}
                style={{ alignItems:'center' }}
                backdropTransitionInTiming={0} // Disable default backdrop animation
                backdropTransitionOutTiming={0} // Disable default backdrop animation
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start',}}>
                  <View style={{position:'relative', flex: 1, marginBottom: 5}}>
                    <Text style={{ fontSize: 14, color: '#ffffff'}}>TODAY</Text>
                    <Text style={{ fontSize: 24, color: '#ffffff'}}>{today.format('M월 D일 dd')}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                <View style={{backgroundColor: 'white', borderRadius: 15, flex: 1, padding: 20, height: 500}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => {setIsDetailModalVisible(!isDetailModalVisible); amplitude.backToWeeklyFromDetailModal();}}>
                      <FeatherIcon name='x' color="#737373" style={{ fontWeight: 'bold', fontSize: 20}}/>
                    </TouchableOpacity>
                    <Text style={{color: '#212429', fontSize: 16}}>스탬프 상세 히스토리</Text>
                    <TouchableOpacity> 
                      {/* 스탬프 추가랑 연결해야함 */}
                      <FeatherIcon name='plus' color="white" style={{ fontWeight: 'bold', fontSize: 20}}/>
                    </TouchableOpacity>                                         
                    </View>
                    <Text></Text>
                    <ScrollView contentContainerStyle={{}}>
                      <Timeline data={getStamp(today)} />
                    </ScrollView>
                  </View></View>
                </Modal>
            </TouchableOpacity>

            {/* sentry test*/}
            {/* <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/> */}

            {/* </TouchableOpacity> */}
          </View>
          {/* 3-1. 감정 리스트 */}
          <View style={styles.todayEmotionList}>
            {getStamp(today).map((stamp) => (
              <Text key={stamp.id} style={styles.emotion}>{stamp.emoji} {stamp.stampName}</Text>
            ))}
          </View>

          {/* 4. AI 일기 생성 버튼 */}
          {todayReport !== null ? (
            <View>
              <View style={[styles.title, {marginTop: 0,}]}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#212429'}}>오늘의 일기</Text>
                {!isEditMode ? (
                  <TouchableOpacity onPress={ () => {handleEditButton(); amplitude.editAIDiary();}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                      <MCIcon name='pencil' color="#495057" style={{ fontWeight: 'bold', fontSize: 15}}/>
                      <Text style={{fontSize: 12, color: '#495057'}}> 직접 수정</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => {handleCancelButton(); amplitude.cancelToEditDiary();}}>
                      <Text style={{ fontSize: 12, color: '#495057' }}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {handleSaveButton(); amplitude.saveEditedDiary();}}>
                      <Text style={{ fontSize: 12, color: '#495057', marginLeft: 10 }}>수정 완료</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={diaryStyles.diaryContainer}>
                
                {/* date */}
                {isEditMode ? (
                  <Text style={{fontSize: 12, color: '#dbdbdb', marginBottom: 12}}>
                    {dayjs(todayReport.date).format('YYYY년 M월 D일 ddd요일')}
                  </Text>
                ) : (
                  <Text style={{fontSize: 12, color: '#212429', marginBottom: 12}}>
                  {dayjs(todayReport.date).format('YYYY년 M월 D일 ddd요일')}
                </Text>
                )}
                
                {/* title */}
                <View style={{ flexDirection: 'row'}}>
                  {isEditMode ? (
                    <TextInput
                      style={diaryStyles.editDiary}
                      value={editedTitle}
                      onChangeText={handleEditedTitleChange}
                      onFocus={() => {amplitude.editTitle();}}
                    />
                  ) : (
                    <Text style={{ fontSize: 16, color: '#212429', marginBottom: 12,  }}>{todayReport.title}</Text>
                  )}
                </View>
                
                {/* line */}
                <View style={[diaryStyles.line, { width: Dimensions.get('window').width - 75 }]} />
                
                {/* bodytext */}
                <View style={{ flexDirection: 'row'}}>
                  {isEditMode ? (
                    <TextInput
                      style={ [diaryStyles.editDiary, { fontSize: 12, color: '#495057', paddingVertical: 10}]}
                      value={editedBodytext}
                      onChangeText={handleEditedBodyTextChange}
                      onFocus={() => {amplitude.editBodyText();}}
                      multiline
                    />
                  ) : (
                    <Text style={{ fontSize: 12, color: '#495057', marginBottom: 15 }}>{todayReport.bodytext}</Text>
                  )}
                </View>

                {/* keyword */}
                {isEditMode ? (
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    {todayReport.keyword.map((keyword) => (
                      <Text key={keyword} style={[diaryStyles.keyword, {color:'#DBDBDB'}]}>{keyword}</Text>
                    ))}
                  </View>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    {todayReport.keyword.map((keyword) => (
                      <Text key={keyword} style={diaryStyles.keyword}>{keyword}</Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ) : ( getStamp(today).length < 2 ? (
            <TouchableOpacity 
              onPress={() => {setIsCannotModalVisible(true); amplitude.tryGenerateAIDiary_cannot();}} 
              style={diaryStyles.generateButton}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                {/* <Text style={[diaryStyles.generateButtonText, { color: 'white'}]}>무지니에게 일기 작성을 요청해 봐요</Text> */}
                <Text style={[diaryStyles.generateButtonText, { color: 'white'}]}>Moo에게 일기 작성을 요청해 봐요</Text>
              </View>
              <Image 
                source={require('../assets/colorMooMini.png')}
                style={{ width: 37, height: (39 * 37) / 37 , position: 'relative', bottom: 21.5, left: 122, overflow: 'hidden'}}></Image>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
                onPress={() => {handleGenerateDiary(); amplitude.tryGenerateAIDiary_can();}} 
                style={diaryStyles.generateButton}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                {/* <Text style={[diaryStyles.generateButtonText, { color: 'white'}]}>무지니에게 일기 작성을 요청해 봐요</Text> */}
                <Text style={[diaryStyles.generateButtonText, { color: 'white'}]}>Moo에게 일기 작성을 요청해 봐요</Text>
              </View>
              <Image 
                source={require('../assets/colorMooMini.png')}
                style={{ width: 37, height: (39 * 37) / 37 , position: 'relative', bottom: 21.5, left: 122, overflow: 'hidden'}}></Image>
            </TouchableOpacity>
          ))}

          {/* 4-1. 일기 생성 로딩 모달 */}
          <Modal 
            isVisible={isLodingModalVisible}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            backdropColor='#CCCCCC' 
            backdropOpacity={0.9}
            style={{ alignItems:'center' }}
            backdropTransitionInTiming={0} // Disable default backdrop animation
            backdropTransitionOutTiming={0} // Disable default backdrop animation
          >
            <View style={diaryStyles.lodingModal}>
              {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
              <Image 
                source={require('../assets/colorMooMini.png')}
                style={{ width: 68, height: (71 * 68) / 68 , marginTop: 60,}}></Image>
              <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
                <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>AI 일기 발행 중이다</Text>
                <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
                <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>~</Text>
              </View>
              <View style={{alignItems: 'center',}}>
                <Text style={{ color: '#475467', fontSize: 14, }}>AI 일기가 발행되고 있으니, 화면을 벗어나지 말라 무.</Text>
                <Text style={{ color: '#475467', fontSize: 14, }}>발행 중 이탈 시, 발행이 취소된다무...</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ flexDirection: 'row', flex: 1,}}>
                  <TouchableOpacity style={diaryStyles.cancelBtn} 
                  onPress={() => {amplitude.waitingForAIDiary();}}
                  // onPress={() => {
                  //   cancelRequest();
                  //   setIsLodingModalVisible(false);
                  // }}
                  >
                    <Text style={{ color: '#72D193', fontSize: 14, fontWeight: '600',}}>조금만 기다려달라무 ...✏️💦</Text>
                  </TouchableOpacity>
                </View>
              </View>
                        
            </View>
          </Modal>
          {/* 4-2. 일기 생성 완료 모달 */}
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
            <View style={diaryStyles.finishLodingModal}>
              {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
              <Image 
                source={require('../assets/colorMooMini.png')}
                style={{ width: 68, height: (71 * 68) / 68 , marginTop: 60,}}></Image>
              <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
                <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>AI 일기가 발행됐다</Text>
                <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
                <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>~</Text>
              </View>
              <View style={{alignItems: 'center',}}>
                <Text style={{ color: '#475467', fontSize: 14, }}>내가 멋지게 만든 일기를 확인해 봐라무!</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ flexDirection: 'row', flex: 1,}}>
                  <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {setIsLodingFinishModalVisible(false); amplitude.backToWeeklyFromCanModal();}}>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
                        
            </View>
          </Modal>
          {/* 4-3. 일기 생성 불가 모달 */}
          <Modal 
            isVisible={isCannotModalVisible}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            backdropColor='#CCCCCC' 
            backdropOpacity={0.9}
            style={{ alignItems:'center' }}
            backdropTransitionInTiming={0} // Disable default backdrop animation
            backdropTransitionOutTiming={0} // Disable default backdrop animation
          >
            <View style={diaryStyles.finishLodingModal}>
              {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
              <Image 
                source={require('../assets/colorMooMini.png')}
                style={{ width: 68, height: (71 * 68) / 68 , marginTop: 60,}}></Image>
              <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
                <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>일기를 만들 재료가 부족하다</Text>
                <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
                <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>...</Text>
              </View>
              <View style={{alignItems: 'center',}}>
                <Text style={{ color: '#475467', fontSize: 14, }}>감정을 두 개 이상 주면 만들 수 있다무!</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ flexDirection: 'row', flex: 1,}}>
                  <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {setIsCannotModalVisible(false); amplitude.backToWeeklyFromCannotModal();}}>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
                        
            </View>
          </Modal>

          {/* 5. 업로드된 사진 (이미지 컴포넌트로 띄워줄 수 있음)
          <View style={styles.uploadedImage}>
            <Image source={uploadedImage} style={styles.image} />
          </View> */}
        </ScrollView>
      )}
    </View>
    
  );
};


const dropDownStyles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  dropdownButton: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#212429',
    backgroundColor: '#fafafa',
    padding: 5,
    paddingHorizontal: 12,
    paddingRight: 22,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  dropdownOptions: {
    backgroundColor: '#ffffff',
    marginTop: 5,
    padding: 3,
    paddingRight: 20,
    shadowColor: 'black',
    borderRadius: 5,
    shadowOpacity: 1,        // 그림자 투명도
    shadowRadius: 50,           // 그림자 블러 반경
    elevation: 4,              // 안드로이드에서 그림자를 표시하기 위한 설정
    marginLeft: 5,
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 10,
    top: 50,
    zIndex: 1,
    width: 100
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  emojisContainer: {
    flexDirection: 'row',
    // backgroundColor: '#92AAFF', // blue
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  day: {
    width: (Dimensions.get('window').width) / 7,
    height: (Dimensions.get('window').height) / 7.3,
    // backgroundColor: '#FFE092', // yellow
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  day_today: {
    borderBottomWidth: 2,
    borderColor: '#72D193',
  },
  dayText: {
    color: '#212429',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 5,
    // backgroundColor: 'pink',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dayText_sunday: {
    color: '#FF7168',
  },
  dayText_notYet: {
    color: '#F0F0F0',
  },
  dayText_today: {
    // flexDirection: 'column', 
    color: 'white',
    backgroundColor: '#72D193',
    borderRadius: 10,
    width: 20,
    height: 20,
    lineHeight: 20,
    overflow: 'hidden',
  },

  title: {
    flexDirection: 'row',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    alignItems: 'baseline', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginTop: 30,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  todayEmotionList: {
    flexDirection: 'row',
    marginBottom: 15,
    // backgroundColor: 'purple',
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  emotion: {
    fontSize: 14,
    color: '#212429',
    marginBottom: 5,
    marginRight: 5,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
});

const diaryStyles = StyleSheet.create({
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
export default Weekly;