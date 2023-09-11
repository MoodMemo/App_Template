import React, { useState, useEffect } from 'react';
import { View, Button, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, StatusBar} from 'react-native';
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
import {default as Text} from "../CustomText"
import * as nodata from './NoDataView';

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
  const [tryToChangeToday, setTryToChangeToday] = useState<dayjs.Dayjs>(today);
  const handleTodayChange = (date: dayjs.Dayjs) => { 
    if (isEditMode) {
      setTryToChangeToday(date);
      amplitude.click2move2AnotherDayWhileEditingDiary(date.format('YYYY-MM-DD'));
      setIsWarningMove2AnotherDayModalVisible(true);
    }
    else {
      console.log("isEditMode: ", isEditMode);
      setToday(date); amplitude.changeToday(date.format('YYYY-MM-DD'));
      setAndCheckTodayReport(date);
    }
  };

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
  // const todayReport = repository.getDailyReportsByField("date", today.format('YYYY-MM-DD'));
  const [todayReport, setTodayReport] = useState<repository.IDailyReport | null>(repository.getDailyReportsByField("date", today.format('YYYY-MM-DD')));
  const setAndCheckTodayReport = (date: dayjs.Dayjs) => {
    const diary = repository.getDailyReportsByField("date", date.format('YYYY-MM-DD'));
    if (diary!==null) setStampORdiary(false);
    else setStampORdiary(true);
    setTodayReport(diary);
  }
  const [isLodingModalVisible, setIsLodingModalVisible] = useState(false);
  const [isLodingFinishModalVisible, setIsLodingFinishModalVisible] = useState(false);
  const [isCannotModalVisible, setIsCannotModalVisible] = useState(false);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [isWarningMove2AnotherDayModalVisible, setIsWarningMove2AnotherDayModalVisible] = useState(false);
  const [isDeletingStamp, setIsDeletingStamp] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  let cancelTokenSource = axios.CancelToken.source();
  const handleGenerateDiary = () => {

    setIsLodingModalVisible(true);

    const todayStampList = [];
    getStamp(today).forEach((stamp) => {
      console.log("stamp.dateTime: ", stamp.dateTime);
      todayStampList.push({
        // dateTime: new Date(stamp.dateTime.getTime() + 9 * 60 * 60 * 1000),
        dateTime: stamp.dateTime,
        stampName: stamp.stampName,
        memo: stamp.memo,
      });
    });
    console.log("***", today);
    const request = {
      today: today.format('YYYY-MM-DD'),
      userDto: getUserAsync(), // from async storage
      todayStampList: todayStampList,
    }

    console.log('ai 서버와의 통신 시작합니다');
    sendDailyReport(request, cancelTokenSource.token)
      .then((response) => {
        if (!isCanceled) {
          console.log('date: ', response.date);
          realm.write(() => {
            console.log('title: ', response.title);
            repository.createDailyReport({
              // date: dayjs(response.date).add(1, 'day').format('YYYY-MM-DD'),
              date: response.date, // todo - ai 서버 로직 변경하면 이거로 수정해야함 
              title: response.title,
              bodytext: response.bodytext,
              keyword: response.keyword,
            });
            console.log("create default daily report finished");
            console.log("response.date: ", response.date);
            console.log("today.format('YYYY-MM-DD'): ", today.format('YYYY-MM-DD'));
            setTodayReport(repository.getDailyReportsByField("date", today.format('YYYY-MM-DD')))
          });
          setIsLodingModalVisible(false);
          setIsLodingFinishModalVisible(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
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
  const [tmpDeleteStamp, setTmpDeleteStamp] = useState(null);
  const [editedBodytext, setEditedBodytext] = useState(todayReport ? todayReport.bodytext : '');
  const [tmpEditedBodyText, setTmpEditedBodyText] = useState(editedBodytext);
  const handleEditButton = () => { 
    setIsEditMode(true);
    setEditedTitle(todayReport ? todayReport.title : '');
    setEditedBodytext(todayReport ? todayReport.bodytext : '');
  };
  const handleCancelButton = () => { 
    setIsEditMode(false);
    setEditedTitle(tmpEditedTitle);
    setEditedBodytext(tmpEditedBodyText);
  };
  const handleCancelWhileMove2AnotherDayButton = (newDate: dayjs.Dayjs) => { 
    amplitude.move2AnotherDayWhileEditingDiary(newDate.format('YYYY-MM-DD'));
    setIsEditMode(false);
    setEditedTitle(tmpEditedTitle);
    setEditedBodytext(tmpEditedBodyText);
    setToday(newDate); // 앰플리튜드 넣자
    setAndCheckTodayReport(newDate);
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
  const handleDeleteButton = (deleteStamp: repository.IPushedStamp) => {
    amplitude.test1();
    realm.write(() => {
      repository.deletePushedStamp(deleteStamp);
    });
  }

  const [stampORdiary, setStampORdiary] = useState(true); // true = stamp, false = diary
  const ReadyToGenerateDiary = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <Image 
            source={require('../assets/colorMooMedium.png')}
            style={{ width: 104, height: (110 * 104) / 104 , marginBottom: 16}} // 비율을 유지하며 height 자동 조절
          />
          <Text style={{fontSize: 14, color: '#495057', }}>일기를 만들 준비가 됐다무!!</Text>
  
          <TouchableOpacity style={typeChangeBtnStyles.nudgingBtn} 
            onPress={() => {handleGenerateDiary(); amplitude.tryGenerateAIDiary_can(today.format('YYYY-MM-DD'));}} >
            <Text style={{fontSize: 14, color: '#ffffff', fontWeight: '600'}}>감정 스탬프 기록하기</Text>
          </TouchableOpacity>
        </View>
  
      </View>
    );
  }
  const StampList_NoStamp = () => {
    if (today.isSame(dayjs(), 'day')) return <nodata.TellMeYourDayView/>; // today
    else if (today.isBefore(dayjs(), 'day')) return <nodata.MooWasBoredView/>; // past
    else return <nodata.FromFutureView/>; // future
  }
  const AIDiary_NoDiary = () => {
    const stampCnt = getEmoji(getStamp(today)).length;
    if (today.isSame(dayjs(), 'day')) {
      if (stampCnt === 0) return <nodata.TellMeYourDayView/>; // 스탬프가 없을 때
      else if (stampCnt === 1) return <nodata.PleaseOneMoreStampView/>; // 스탬프가 1개일 때
      else return <ReadyToGenerateDiary/>; // 스탬프가 2개 이상일 때 // 일기 만들 준비 됐다무 ! // 할차례
    }
    else if (today.isBefore(dayjs(), 'day')) {
      if (stampCnt === 2) return <ReadyToGenerateDiary/>; // 스탬프가 2개일 때
      else return <nodata.MooWasBoredView/>; // past
    }
    else return <nodata.FromFutureView/>; // future
  }
  

  // tmp_createDummyData(); 

  // console.log(repository.getAllCustomStamps()[0].id);
  // repository.updateCustomStampPushedCountById('33456232-ac6e-43f5-8a55-9c05c23020e3', -3);
  // console.log(repository.getAllCustomStamps()[0].pushedCnt);
  return (
    
    <View style={{backgroundColor: '#FAFAFA', flex:1}}>
      {/* <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={'dark-content'}
      /> */}

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
      {stampORdiary ? (
        <View style={typeChangeBtnStyles.twotypebtn}>
          <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.clickStampSwitchInStampView()}}>
            <Text style={typeChangeBtnStyles.activeFont}>스탬프 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setStampORdiary(false); amplitude.clickDiarySwitchInStampView();}} style={typeChangeBtnStyles.deactiveType}>
            {todayReport == null && getEmoji(getStamp(today)).length >= 2 ? (
              <View style={typeChangeBtnStyles.canGenerateDiaryDot}></View>
            ) : (<View></View>)}
            <Text style={typeChangeBtnStyles.deactiveFont}>AI 일기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={typeChangeBtnStyles.twotypebtn}>
          <TouchableOpacity onPress={() => {setStampORdiary(true); amplitude.clickStampSwitchInDiaryView();}} style={typeChangeBtnStyles.deactiveType}>
            <Text style={typeChangeBtnStyles.deactiveFont}>스탬프 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.clickDiarySwitchInDiaryView()}}>
            <Text style={typeChangeBtnStyles.activeFont}>AI 일기</Text>
            {todayReport == null && getEmoji(getStamp(today)).length >= 2 ? (
              <View style={typeChangeBtnStyles.canGenerateDiaryDot}></View>
            ) : (<View></View>)}
          </TouchableOpacity>
        </View>
      )}

      {stampORdiary ? ( // 스탬프 기록
        getEmoji(getStamp(today)).length !== 0 ? ( // 스탬프 exists
          <View style={{flexDirection: 'row', marginTop: 16, marginHorizontal: 16 }}>
            <ScrollView><Timeline data={getStamp(today)}/></ScrollView>
          </View>
        ) : ( // 스탬프가 없을 때, 날짜에 따라 다름
          <StampList_NoStamp/>
        ))
      : ( // ai 일기
        todayReport!==null ? ( // 일기 있음
          <ScrollView contentContainerStyle={{backgroundColor: '#FAFAFA', }}>
            <View>
              <View style={[styles.title, {marginTop: 20,}]}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#212429'}}>다이어리</Text>
                {!isEditMode ? (
                  <TouchableOpacity onPress={ () => {handleEditButton(); amplitude.editAIDiary(today.format('YYYY-MM-DD'));}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                      <MCIcon name='pencil' color="#495057" style={{ fontWeight: 'bold', fontSize: 15}}/>
                      <Text style={{fontSize: 12, color: '#495057'}}> 직접 수정</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => {setIsWarningModalVisible(true); amplitude.cancelToEditDiary();}}>
                      <Text style={{ fontSize: 12, color: '#495057' }}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {handleSaveButton(); amplitude.saveEditedDiary(today.format('YYYY-MM-DD'));}}>
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
                      <TouchableOpacity key={keyword} style={diaryStyles.keyword} onPress={() => {amplitude.clickKeyword();}} disabled={true}>
                        <Text style={{color:'#DBDBDB'}}>{keyword}</Text>
                      </TouchableOpacity>
                      // <Text key={keyword} style={[diaryStyles.keyword, {color:'#DBDBDB'}]}>{keyword}</Text>
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
          </ScrollView>
          ) : ( // 일기가 없을 때, 날짜 & 스탬프 개수에 따라 다름
          <AIDiary_NoDiary/> // 일어나면 보세요 여기 해야함 !! 여기에 맞는 컨스탄트 뷰를 세팅해야합니다요
        )
      )}


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
                <Text style={{ color: '#475467', fontSize: 14, }}>AI 일기가 발행되고 있으니, 화면을 벗어나지 말라무.</Text>
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
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {setIsLodingFinishModalVisible(false); amplitude.backToWeeklyFromCanModal(today.format('YYYY-MM-DD'));}}>
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
      {/* 4-4. 일기 수정 중 취소 시 경고 모달 */}
      <Modal 
        isVisible={isWarningModalVisible}
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
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>수정을 취소하겠냐</Text>
            <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>?</Text>
          </View>
          <View style={{alignItems: 'center',}}>
            <Text style={{ color: '#475467', fontSize: 14, }}>작업 중인 내용이 저장되지 않는다무!</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1, gap: 12}}>
              <TouchableOpacity style={diaryStyles.cancelOut2EditBtn} onPress={() => {setIsWarningModalVisible(false); amplitude.cancelCancelEditingDiary();}}>
                <Text style={{ color: '#344054', fontSize: 16, fontWeight: '600',}}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {handleCancelButton(); setIsWarningModalVisible(false); amplitude.confirmCancelEditingDiary(today.format('YYYY-MM-DD'));}}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
                    
        </View>
      </Modal>
      {/* 4-5. 일기 수정 중 이동 시 경고 모달 */}
      <Modal 
        isVisible={isWarningMove2AnotherDayModalVisible}
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
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>다른 날짜로 이동하겠냐</Text>
            <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>?</Text>
          </View>
          <View style={{alignItems: 'center',}}>
            <Text style={{ color: '#475467', fontSize: 14, }}>수정 중인 내용이 저장되지 않는다무.</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1, gap: 12}}>
              <TouchableOpacity style={diaryStyles.cancelOut2EditBtn} onPress={() => {setIsWarningMove2AnotherDayModalVisible(false); amplitude.cancel2move2AnotherDayWhileEditingDiary();}}>
                <Text style={{ color: '#344054', fontSize: 16, fontWeight: '600',}}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {handleCancelWhileMove2AnotherDayButton(tryToChangeToday); setIsWarningMove2AnotherDayModalVisible(false);}}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
                    
        </View>
      </Modal>
      {/* 4-6. 스탬프 삭제 경고 모달 */}
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
        <View style={diaryStyles.finishLodingModal}>
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
              <TouchableOpacity style={diaryStyles.cancelOut2EditBtn} onPress={() => {setIsDeletingStamp(false); amplitude.test1();}}>
                <Text style={{ color: '#344054', fontSize: 16, fontWeight: '600',}}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {handleDeleteButton(tmpDeleteStamp); setIsDeletingStamp(false);}}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
                    
        </View>
      </Modal>
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
    marginBottom: 10,
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

const typeChangeBtnStyles = StyleSheet.create({
  nudgingBtn: {
    alignSelf: 'center',
    height: 46,
    width: 156,
    justifyContent: 'center', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#72D193',
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  twotypebtn: {
    alignSelf: 'center',
    height: 36,
    width: 304,
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    marginTop: 10,
    padding: 2,
    borderRadius: 8,
  },
  activeType: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 14, color: '#72D193', fontWeight:'600'
  },
  activeFont: {fontSize: 14, color: '#72D193', fontWeight:'600'},
  deactiveType: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  deactiveFont: {fontSize: 14, color: '#B7B7B7', fontWeight:'400'},
  canGenerateDiaryDot: {
    width: 4,
    height: 4,
    top: 6,
    right: 50,
    backgroundColor: '#FF7168', // 타원의 색상을 지정하세요
    borderRadius: 4, // 절반의 크기로 borderRadius를 설정하여 타원 모양으로 만듭니다
    position: 'absolute', // 원하는 위치에 배치하려면 position을 'absolute'로 설정합니다
  }
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
export default Weekly;