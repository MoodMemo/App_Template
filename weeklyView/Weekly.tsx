import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, ActivityIndicator, StatusBar} from 'react-native';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { deleteUserStamp } from '../src/graphql/mutations';
import Modal from "react-native-modal";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
// import Timeline from './Timeline';
import axios, { CancelToken } from 'axios';
import { Card } from 'react-native-paper';
import StampClick from '../StampClick';
import StampView from '../StampView';
import {default as Text} from "../CustomText"
import * as nodata from './NoDataView';
import AutumnEventCoinModal from '../AutumnEventCoinModal';

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
        <View style={dropDownStyles.dropdownButtonText}>
          <Text style={{fontWeight: 'bold', color: '#212429',fontSize:16}}>
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
              <Text style={{ color: '#212429', fontSize: 14, marginLeft: 5}}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Weekly = () => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 스크롤을 최하단으로 이동
    if (stampORdiary) { scrollViewRef.current.scrollToEnd({ animated: true });}
  }, []);

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
      setTimelineData(getStamp(date)); // getStamp 함수 안에서 정렬을 진행함.
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

  const [isCanceled, setIsCanceled] = useState(false);

  const [isFirstDiaryToday, setIsFirstDiaryToday] = useState(false);
  const [isMooRead, setIsMooRead] = useState(false); // true 가 읽은거
  let cancelTokenSource = axios.CancelToken.source();
  const handleGenerateDiary = () => {

    console.log('isFirstDiaryToday : ',isFirstDiaryToday);

    setIsMooRead(true);
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
          // setIsLodingModalVisible(false);
          const url = 'http://3.34.55.218:5000/time';
          axios.get(url).then((response)=>{
            var month=response.data.month;
            var day=response.data.day;
            AsyncStorage.getItem('@UserInfo:AutumnEventDiaryDate').then((value)=>{
              var date=value.split('/');
              var date_now=new Date(new Date(2023,month-1,day).getTime() + (9*60*60*1000))
              var date_stamp=new Date(new Date(2023,Number(date[0])-1,Number(date[1])).getTime() + (9*60*60*1000));
              let totalDays=Math.floor((date_now.getTime()-date_stamp.getTime())/(1000*3600*24));
              console.log('date_now: ',date_now);
              console.log('date_stamp: ',date_stamp);
              console.log('totalDays:',totalDays);
              if(totalDays>0){
                console.log(value);
                console.log(totalDays,'일');
                console.log('date_now: ',date_now);
                console.log('date_stamp: ',date_stamp);
                setIsFirstDiaryToday(true);
                AsyncStorage.setItem('@UserInfo:AutumnEventDiaryDate',month.toString()+'/'+day.toString());
                amplitude.confirmFirstAIDiaryInADay();//오늘 첫 일기 만듦 - AI 일기
              }
            })
          }).catch((error)=>{
            console.error('Failed to GET Server Time');
          })
          setIsEventModalVisible(true);
          setIsLodingModalVisible(false);
          setIsLodingFinishModalVisible(true);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.log('Error', error.message);
          // setIsLodingModalVisible(false);
          // todo - 에러 처리 해야함
      }});
  };
  const handleCreateDiaryMyself = () => {
    const url = 'http://3.34.55.218:5000/time';
    axios.get(url).then((response)=>{
      var month=response.data.month;
      var day=response.data.day;
      AsyncStorage.getItem('@UserInfo:AutumnEventDiaryDate').then((value)=>{
        var date=value.split('/');
        var date_now=new Date(new Date(2023,month-1,day).getTime() + (9*60*60*1000))
        var date_stamp=new Date(new Date(2023,Number(date[0])-1,Number(date[1])).getTime() + (9*60*60*1000));
        let totalDays=Math.floor((date_now.getTime()-date_stamp.getTime())/(1000*3600*24));
        if(totalDays>0){
          console.log(value);
          console.log(totalDays,'일');
          console.log('date_now: ',date_now);
          console.log('date_stamp: ',date_stamp);
          setIsFirstDiaryToday(true);
          setIsEventModalVisible(true);
          AsyncStorage.setItem('@UserInfo:AutumnEventDiaryDate',month.toString()+'/'+day.toString());
          amplitude.confirmFirstSelfDiaryInADay();//오늘 첫 일기 만듦 - 직접 작성
        }
      })
    }).catch((error)=>{
      console.error('Failed to GET Server Time');
    })

    realm.write(() => {
      repository.createDailyReport({
        // date: dayjs(response.date).add(1, 'day').format('YYYY-MM-DD'),
        date: today.format('YYYY-MM-DD'), // todo - ai 서버 로직 변경하면 이거로 수정해야함 
        title: '제목',
        bodytext: '오늘의 일기\n\n\n',
        keyword: [],
      });
      setTodayReport(repository.getDailyReportsByField("date", today.format('YYYY-MM-DD')))
    });
  }

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
    setIsEditMode(true);
    setEditedTitle(todayReport ? todayReport.title : '');
    setEditedBodytext(todayReport ? todayReport.bodytext : '');
  };
  const handleDeleteButton = () => { 
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
        reportToUpdate.updatedAt = new Date();
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

  const [stampORdiary, setStampORdiary] = useState(true); // true = stamp, false = diary
  const handleStampORDiaryFromPFM = () => {
    setStampORdiary(!stampORdiary);
    setTimelineData(getStamp(today));
  }
  const ReadyToGenerateDiary = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>

          <View>
            <View style={bubbleStyles.container}>
              <Text style={{fontSize: 16, color: '#fff', }}>일기를 만들 준비가 됐다무!</Text>
            </View>
            <View style={bubbleStyles.tail}></View>
          </View>

          <Image 
            source={require('../assets/colorMooMedium.png')}
            style={{ width: 104, height: (110 * 104) / 104 , marginTop: 20, marginBottom: 40}} // 비율을 유지하며 height 자동 조절
          />
          <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 46, marginBottom: 10}]} 
            onPress={() => {handleGenerateDiary(); amplitude.tryGenerateAIDiary_can(today.format('YYYY-MM-DD'));}}>
            <Text style={{fontSize: 16, color: '#72D193', fontWeight: '600'}}>무가 만들어줘!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 46, marginBottom: 10, borderColor: '#FFCC4D'}]} 
            onPress={() => {handleCreateDiaryMyself(); amplitude.createDiaryMyself(today.format('YYYY-MM-DD'));}} >
            <Text style={{fontSize: 16, color: '#FFCC4D', fontWeight: '600'}}>내가 직접 쓸래</Text>
          </TouchableOpacity>

        </View>
  
      </View>
    );
  }
  const ReadyToGenerateDiary_forPast = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', }}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          
          <View>
            <View style={bubbleStyles.container}>
              <Text style={{fontSize: 16, color: '#fff', }}>일기를 만들 준비가 됐다무!</Text>
            </View>
            <View style={bubbleStyles.tail}></View>
          </View>

          <Image 
            source={require('../assets/colorMooMedium.png')}
            style={{ width: 104, height: (110 * 104) / 104 , marginTop: 20, marginBottom: 40}} // 비율을 유지하며 height 자동 조절
          />
          <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 46, marginBottom: 10}]} 
            onPress={() => {handleGenerateDiary(); amplitude.tryGenerateAIDiary_can_forPast(today.format('YYYY-MM-DD'));}} >
            <Text style={{fontSize: 16, color: '#72D193', fontWeight: '600'}}>무가 만들어줘!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 46, borderColor: '#FFCC4D'}]} 
            onPress={() => {handleCreateDiaryMyself(); amplitude.createDiaryMyself_forPast(today.format('YYYY-MM-DD'));}} >
              <Text style={{fontSize: 16, color: '#FFCC4D', fontWeight: '600'}}>내가 직접 쓸래</Text>
          </TouchableOpacity>
        </View>
  
      </View>
    );
  }
  const StampList_NoStamp = () => {
    if (today.isSame(dayjs(), 'day')) return <nodata.Present_Zero_View/>; // today
    else if (today.isBefore(dayjs(), 'day')) {
      amplitude.clickPast_noStamp();
      return <nodata.MooWasBoredView/>; // past 
    }
    else {
      amplitude.clickFuture();
      return <nodata.FromFutureView/>; // future
    }
  }
  const AIDiary_NoDiary = () => {
    const stampCnt = getEmoji(getStamp(today)).length;
    if (today.isSame(dayjs(), 'day')) {
      if (stampCnt === 0) return <nodata.TellMeYourDayView/>; // 스탬프가 없을 때
      else if (stampCnt === 1) return <nodata.PleaseOneMoreStampView/>; // 스탬프가 1개일 때
      else return <ReadyToGenerateDiary/>; // 스탬프가 2개 이상일 때 // 일기 만들 준비 됐다무 ! // 할차례
    }
    else if (today.isBefore(dayjs(), 'day')) {
      if (stampCnt >= 2) return <ReadyToGenerateDiary_forPast/>; // 스탬프가 2개일 때
      else {
        amplitude.clickPast_noDiary();
        return <nodata.MooWasBoredView/>; // past
      }
    }
    else {
      amplitude.clickFuture_Diary();
      return <nodata.FromFutureView/>; // future
    }
  }
  

  // for timeline
  const [timelineData, setTimelineData] = useState(getStamp(today));
  const dateFormat = {
    // ko-KR
    // en-US
    // hour: '2-digit', minute: '2-digit', hour12: true,
    hour: "numeric", minute: "numeric" , 
  };
  const [dropdownButtonVisible, setDropdownButtonVisible] = useState(false);
  const [stampClickModalVisible, setStampClickModalVisible] = useState(false);
  const [deleteDiaryModalVisible, setDeleteDiaryModalVisible] = useState(false);
  const closeStampClickModal = () => {
    setStampClickModalVisible(false);
  };
  const [isDeletingStampModalVisible, setIsDeletingStampModalVisible] = useState(false);
  const tmpStamp: repository.IPushedStamp = {
    id: '-1',
    dateTime: new Date(),
    stampName: '기쁨',
    emoji: '😆',
    memo: null,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const [tmpChosenStamp, setTmpChosenStamp] = useState(tmpStamp);
  // const handleEditStampButton = (chosenStamp: repository.IPushedStamp) => {
  const handleEditStampButton = () => {
    amplitude.clickEditButton();
    setDropdownButtonVisible(false);
    setStampClickModalVisible(true);
  }
  const handleDeleteDiaryButton = () => {
    amplitude.clickDeleteDiaryButton();
    setDeleteDiaryModalVisible(true);
  }
  const handleDeleteDiaryConfirm = () => {
    amplitude.confirmDeleteDiaryButton();
    realm.write(() => {
      const reportToUpdate = realm.objects('DailyReport').filtered('date = $0', todayReport.date)[0];
      if (reportToUpdate) {
        reportToUpdate.title = '제목';
        reportToUpdate.bodytext = '오늘의 일기\n\n\n';
        reportToUpdate.keyword = [];
        reportToUpdate.updatedAt = new Date();
      }
    });
  }
  const handleDeleteConfirm = (deleteStamp: repository.IPushedStamp) => {
    const today = dayjs(deleteStamp.dateTime);
    amplitude.confirmToDeleteStamp();
    realm.write(() => {
      repository.deletePushedStamp(deleteStamp);
    });
    // 스탬프가 삭제되면 상태(state)에서도 삭제해야 합니다.
    setTimelineData(getStamp(today));
    setTmpChosenStamp(tmpStamp);
  }
  const boxRef = useRef();
  const [buttonX, setButtonX] = useState(0);
  const [buttonY, setButtonY] = useState(0);
  const [firstButtonX, setFirstButtonX] = useState(0);
  const [firstBbuttonY, setFirstButtonY] = useState(0);
  const buttonRefs = useRef([]);
  const firstRef = useRef([]);
  const getBoxMessure = (index) => {
    if (buttonRefs.current[index]) {
      buttonRefs.current[index].measureInWindow((x, y, width, height) => {
      // buttonRefs.current[index].measure((x, y, width, height, pageX, pageY)=> {
        // console.log("tmp ==")
        // console.log("x : ", x);
        setButtonX(x);
        // console.log("y : ", y);
        setButtonY(y);
        // console.log("width : ", width);
        // console.log("height : ", height);
        // console.log("pageX : ", pageX);
        // console.log("pageY : ", pageY);
      });
    }

    if (firstRef) {
      firstRef.current.measureInWindow((x, y, width, height) => {
      // buttonRefs.current[index].measure((x, y, width, height, pageX, pageY)=> {
        // console.log("getFirstBoxMessure ==")
        // console.log("x : ", x);
        setFirstButtonX(x);
        // console.log("y : ", y);
        setFirstButtonY(y);
        // console.log("width : ", width);
        // console.log("height : ", height);
        // console.log("pageX : ", pageX);
        // console.log("pageY : ", pageY);
      });
    }
  };


  const [isEventModalVisible, setIsEventModalVisible]=useState(false);


  // tmp_createDummyData(); 

  // console.log(repository.getAllCustomStamps()[0].id);
  // repository.updateCustomStampPushedCountById('33456232-ac6e-43f5-8a55-9c05c23020e3', -3);
  // console.log(repository.getAllCustomStamps()[0].pushedCnt);
  return (
    
    <View style={{backgroundColor: '#FFFFF9', flex:1}} ref={firstRef}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle='dark-content'
      />
      {/* <View style={[{backgroundColor: 'red', width: 10, height: 10,
                    position: 'absolute', // 모달의 위치를 조정하기 위해 절대 위치 지정
                    // left: buttonX,
                    // top: buttonY,
                    zIndex: 1000
                  }, ]}></View> */}


      {dropdownButtonVisible && (
        <View style={[{
          position: 'absolute', // 모달의 위치를 조정하기 위해 절대 위치 지정
          left: buttonX-firstButtonX-60,
          // left: 0,
          top: buttonY-firstBbuttonY+15,
          // top: 258,
          // top: 278,
          width: 75,
          zIndex: 300,
        }, Platform.OS==='ios' && {
          // top: buttonY-6
          // top: 249
          // top: 265
          }]}>
          <View style={TimelineDropDownStyles.dropdownContainer}>
              <View style={TimelineDropDownStyles.dropdownButtonOption}>
                <TouchableOpacity onPress={() => {handleEditStampButton();}}>
                  <Text style={TimelineDropDownStyles.dropdownButtonText}>수정</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => {console.log(index);handleDeleteButton(timelineData[index]);}}> */}
                <TouchableOpacity onPress={() => {
                    setDropdownButtonVisible(false);
                    amplitude.clickDeleteButton();
                    setToday(today);
                    setIsDeletingStampModalVisible(true);
                    }}>
                  <Text style={TimelineDropDownStyles.dropdownButtonText}>삭제</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      )}

      {/* 1 & 2 */}
      <View style={{backgroundColor: 'white', zIndex: 1,}}>

        {/* 1. 년, 월, 주 선택 부분 */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', zIndex:3}}>
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
              <View style={[styles.day, 
                            date.isSame(today, 'day') && styles.day_today,
                            date.isSame(today, 'day') && today.isAfter(dayjs(), 'day') && styles.day_notYet_today,]}>
                <Text style={[
                  styles.dayText,
                  date.day() === 0 && styles.dayText_sunday]}>{date.format('ddd')}</Text>
                <Text style={[
                  styles.dayText, 
                  date.day() === 0 && styles.dayText_sunday,
                  date.isSame(today, 'day') && styles.dayText_today,
                  date.isSame(today, 'day') && today.isAfter(dayjs(), 'day') && styles.dayText_notYet_today,
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

      {/* status bar */}

      {!todayReport ? ( // 1. 편지를 못 받으면, 편지함이 안 열림
        <View style={typeChangeBtnStyles.twotypebtn}>
          <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.clickStampSwitchInStampView(); amplitude.test2}}>
            <Text style={typeChangeBtnStyles.activeFont}>오늘의 스탬프</Text>
          </TouchableOpacity>
          <View style={typeChangeBtnStyles.deactiveType}>
            <MCIcon name='lock' color="#B7B7B7" style={{ fontWeight: 'bold', fontSize: 18}} />
            <Text style={typeChangeBtnStyles.deactiveFont}> Moo의 편지함</Text>
          </View>
        </View>
      ) : ( stampORdiary ? ( // 2. 편지를 받으면, 편지함을 볼 수 있음 
        <View style={typeChangeBtnStyles.twotypebtn}>
          <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.clickStampSwitchInStampView(); amplitude.test2}}>
            <Text style={typeChangeBtnStyles.activeFont}>오늘의 스탬프</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setStampORdiary(false); amplitude.clickDiarySwitchInStampView(); amplitude.test2}} style={typeChangeBtnStyles.deactiveType}>
            <View style={typeChangeBtnStyles.canGenerateDiaryDot}></View>
            <MCIcon name='lock-open-variant' color="#FF7168" style={{ fontWeight: 'bold', fontSize: 18}} />
            <Text style={typeChangeBtnStyles.deactiveFont}> Moo의 편지함</Text>
          </TouchableOpacity>
        </View>
        ) : (
          <View style={typeChangeBtnStyles.twotypebtn}>
            <TouchableOpacity onPress={() => {setStampORdiary(true); amplitude.clickStampSwitchInDiaryView();}} style={typeChangeBtnStyles.deactiveType}>
              <Text style={typeChangeBtnStyles.deactiveFont}>오늘의 스탬프</Text>
            </TouchableOpacity>
            <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.clickDiarySwitchInDiaryView()}}>
              {/* <MCIcon name='lock-open-variant' color="#FFCC4D" style={{ fontWeight: 'bold', fontSize: 18}} /> */}
              <Text style={typeChangeBtnStyles.activeFont}>Moo의 편지함</Text>
              {todayReport == null && getEmoji(getStamp(today)).length >= 2 ? (
                <View style={typeChangeBtnStyles.canGenerateDiaryDot}></View>
              ) : (<View></View>)}
            </TouchableOpacity>
          </View>
        )
      )}

      {/* [오늘의 스탬프] */}
      {stampORdiary ? (
        // 1. 스탬프가 있을 때
        getEmoji(getStamp(today)).length !== 0 ? (
        <ScrollView contentContainerStyle={{flexGrow: 1, }} ref={scrollViewRef}>
          {/* 내가 누른 스탬프 영역 */}
          <View style={Timelinestyles.container}>{timelineData.map((item, index) => ( <View key={index} style={{alignItems: 'flex-end'}}>
            {/* 스탬프 입력 시간 */}
            <Text style={{ fontSize: 14, color: '#495057'}} >{item.dateTime.toLocaleTimeString('ko-KR', dateFormat)}</Text> 
            {/* 스탬프 블럭 */}
            <View style={{flexDirection: 'row', }}>
              {/* 이모지 & 1(안읽음 표시)*/}
              <View style={Timelinestyles.emojiContainer}>
                <Text style={{fontSize: 24, color: 'black',}}>{item.emoji}</Text>
                { (!isMooRead && !todayReport) ? (<Text style={{color: '#FF7168',}}>1</Text>) :(<Text/>)}
                {/* <Text style={{color: '#FF7168',}}>1</Text> */}
              </View>
              {/* 스탬프 영역 */}
              <View style={Timelinestyles.block}>
                <View style={Timelinestyles.title}>
                  <Text style={{fontSize: 14, color: '#212429'}}>{item.stampName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'baseline' }}>
                    {/* 수정 & 삭제 */}
                    <View>
                      <TouchableOpacity
                        onPress={() => {setDropdownButtonVisible(!dropdownButtonVisible), getBoxMessure(index); setTmpChosenStamp(item); amplitude.clickStampDotButton();}}
                        ref={(ref) => (buttonRefs.current[index] = ref)} // ref 배열에 추가
                      >
                        <EntypoIcon name='dots-three-horizontal' color="#212429" style={{ fontWeight: 'bold', fontSize: 12}} />
                      </TouchableOpacity>
                    </View>
                    {/* 2. 스탬프 삭제 경고 모달 */}
                    <Modal isVisible={isDeletingStampModalVisible}
                      animationIn={"fadeIn"} animationOut={"fadeOut"}
                      backdropColor='#CCCCCC' backdropOpacity={0.9}
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
                          <Text style={{ color: '#475467', fontSize: 15, }}>되돌릴 수 없다무..!</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                          <View style={{ flexDirection: 'row', flex: 1, gap: 12}}>
                            <TouchableOpacity style={TimelineDiaryStyles.cancelOut2EditBtn} onPress={() => {setIsDeletingStampModalVisible(false); amplitude.cancelToDeleteStamp();}}>
                              <Text style={{ color: '#344054', fontSize: 18, fontWeight: '600',}}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={TimelineDiaryStyles.confirmBtn} onPress={() => {handleDeleteConfirm(tmpChosenStamp); setIsDeletingStampModalVisible(false);}}>
                              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600',}}>확인</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                                  
                      </View>
                    </Modal>
                    {/* 3. 스탬프 수정 팝업 온 */}
                    <StampClick visible={stampClickModalVisible} onClose={closeStampClickModal} stamp={tmpChosenStamp} firstRef={firstRef} />
                  </View>
                </View>
                <View style={Timelinestyles.line}></View>
                <Text style={Timelinestyles.title}>{item.memo}</Text>
                {item.imageUrl && <Image source={{ uri: item.imageUrl }} 
                    style={{ width: 54, height: 54, borderRadius: 4, marginHorizontal: 10, marginBottom: 10 }}  // adjust width and height as needed
                    onLoadEnd={() => console.log(item.imageUrl)}
                />}
                {/* // 이미지 여러개일 경우 */}
                {/* {item.imageUrl && item.imageUrl.map((url) => (
                  <Image 
                    source={{ uri: url }} 
                    style={{ width: 54, height: 54, borderRadius: 4, marginHorizontal: 10, marginBottom: 10 }}  // adjust width and height as needed
                  />
                ))} */}
              </View>
            </View>
          </View>
            
          ))}
          </View>
          {/* Moo의 답장 영역 */}
          {getEmoji(getStamp(today)).length === 1 && today.isSame(dayjs(), 'day') ? ( // 1-1. 스탬프 1개
            <View style={{ flex: 1 }}><nodata.Present_One_MiniView/></View>
          ) : ( !isLodingModalVisible && !todayReport ? ( // 1-2. 스탬프 2개, 아직 일기 안 씀
            <View style={{ flex: 1, justifyContent: 'flex-end'}}>
              {/* 무 이미지 */}
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{}} onPress={() => {handleGenerateDiary(); amplitude.tryGenerateAIDiary_can(today.format('YYYY-MM-DD'));}}>
                  <Image source={require('../assets/moo_two.png')} style={{ width: 160, height: (156.84 * 160) / 160, margin: 17,}}/>
                </TouchableOpacity>
                <View style={{flex: 1}}/>  
              </View>
              {/* 무 상태 */}
              <View style={[bubbleStyles.moo_status_bar, {backgroundColor: '#72D193', alignItems: 'center'}]}>
                <MCIcon name='lock-open' color="#fff" style={{ fontWeight: 'bold', fontSize: 25}} />
                <Text style={{fontSize: 13, color: '#fff', }}> Moo를 톡 건드려서 깨워보세요! 편지를 보내드립니다.</Text>
              </View>
            </View>
          ) : ( !todayReport ? ( // 1-3. 스탬프 2개, 일기 쓰는 중
            <View style={{ flex: 1 }}><nodata.Present_WakeUp_MiniView/></View>
          ) : ( // 1-4. 일기 다 씀
            <View style={{ flex: 1 }}><nodata.Present_FinishWriting_MiniView handleStampORDiaryFromPFM={handleStampORDiaryFromPFM}/></View>
          )))}
        </ScrollView>
        ) : ( // 2. 스탬프가 없을 때, 날짜에 따라 다름
        <StampList_NoStamp/>
        )
      ) : ( // [Moo의 편지함]
      todayReport!==null ? ( // 일기 있음
        <ScrollView contentContainerStyle={{backgroundColor: '#FAFAFA', }} ref={scrollViewRef}>
          <View>
            <View style={[styles.title, {marginTop: 20,}]}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#212429', }}>다이어리</Text>
              {!isEditMode ? (
                <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity onPress={ () => {handleEditButton(); amplitude.editAIDiary(today.format('YYYY-MM-DD'));}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                    <MCIcon name='pencil' color="#495057" style={{ fontWeight: 'bold', fontSize: 15}}/>
                    <Text style={{fontSize: 12, color: '#495057'}}> 수정</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => {handleDeleteDiaryButton();}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                  <MCIcon name='trash-can' color="#495057" style={{ fontWeight: 'bold', fontSize: 15}}/>
                  <Text style={{fontSize: 12, color: '#495057'}}> 삭제</Text>
                </View>
              </TouchableOpacity>
              </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => {setIsWarningModalVisible(true); amplitude.cancelToEditDiary();}}>
                    <Text style={{ fontSize: 14, color: '#495057' }}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {handleSaveButton(); amplitude.saveEditedDiary(today.format('YYYY-MM-DD'));}}>
                    <Text style={{ fontSize: 14, color: '#495057', marginLeft: 10 }}>수정 완료</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={diaryStyles.diaryContainer}>
              
              {/* date */}
              {isEditMode ? (
                <Text style={{fontSize: 14, color: '#dbdbdb', marginBottom: 12}}>
                  {dayjs(todayReport.date).format('YYYY년 M월 D일 ddd요일')}
                </Text>
              ) : (
                <Text style={{fontSize: 14, color: '#212429', marginBottom: 12}}>
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
                  <Text style={{ fontSize: 18, color: '#212429', marginBottom: 12,  }}>{todayReport.title}</Text>
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
                  <Text style={{ fontSize: 14, color: '#495057', marginBottom: 15 }}>{todayReport.bodytext}</Text>
                )}
              </View>

              {/* keyword */}
              {isEditMode ? (
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  {todayReport.keyword.map((keyword) => (
                    <TouchableOpacity key={keyword} style={diaryStyles.keyword} onPress={() => {amplitude.clickKeyword();}} disabled={true}>
                      <Text style={{color:'#DBDBDB',fontSize:16}}>{keyword}</Text>
                    </TouchableOpacity>
                    // <Text key={keyword} style={[diaryStyles.keyword, {color:'#DBDBDB'}]}>{keyword}</Text>
                  ))}
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  {todayReport.keyword.map((keyword) => (
                    <View style={diaryStyles.keyword}>
                      <Text key={keyword} style={{fontSize:16}}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              )}
              {/* 해당 날짜에 timelineData에 기록된 모든 사진들 가로로 */}
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 10, }}>
              {timelineData.map((item, index) => (
                <View key={index}
                  style={{ marginLeft: index === 0 ? 0 : 12, }}
                >
                  {item.imageUrl && 
                    <Image 
                      source={{ uri: item.imageUrl }} 
                      style={{ width: 80, height: 80, borderRadius: 6, marginBottom: 10 }}  // adjust width and height as needed
                    />
                  }
                </View>
              ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        ) : ( // 일기가 없을 때, 날짜 & 스탬프 개수에 따라 다름
        <AIDiary_NoDiary/> // 일어나면 보세요 여기 해야함 !! 여기에 맞는 컨스탄트 뷰를 세팅해야합니다요
      )
      )}


      {/* 4-1. 일기 생성 로딩 모달 */}
      <Modal 
            isVisible={false}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            backdropColor='#CCCCCC' 
            backdropOpacity={0.9}
            style={{ alignItems:'center' }}
            backdropTransitionInTiming={0} // Disable default backdrop animation
            backdropTransitionOutTiming={0} // Disable default backdrop animation
            onModalHide={()=>{setIsEventModalVisible(!isEventModalVisible)}}
          >
            {!isLodingFinishModalVisible ? (
              <View style={diaryStyles.lodingModal}>
                {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
                <Image 
                  source={require('../assets/write_0904.png')}
                  style={{ width: 92, height: (105 * 92) / 92 , marginTop: 40,}}></Image>
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

            ):(
            
            <View style={diaryStyles.finishLodingModal}>
              {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
              <Image 
                source={require('../assets/finish_0904.png')}
                style={{ width: 100, height: (80 * 100) / 100 , marginTop: 50,}}></Image>
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
                  <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {setIsLodingModalVisible(false); setIsLodingFinishModalVisible(false);amplitude.backToWeeklyFromCanModal(today.format('YYYY-MM-DD'));}}>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            )}
      </Modal>
      
      <Modal isVisible={isEventModalVisible && isFirstDiaryToday}
      animationIn={"fadeIn"}
      animationInTiming={200}
      animationOut={"fadeOut"}
      animationOutTiming={200}
      onBackdropPress={() => {
        amplitude.cancelGetLeavesModal();//일기 - 은행잎 획득 모달 끔
        setIsEventModalVisible(!isEventModalVisible);
      }}
      onModalHide={()=>{
        setIsFirstDiaryToday(false);
      }}>
        <AutumnEventCoinModal isModalVisible={isEventModalVisible} setIsModalVisible={setIsEventModalVisible} type="diary"/>
      </Modal>

      {/* 4-2. 일기 생성 완료 모달 */}
      <Modal 
        // isVisible={isLodingFinishModalVisible}
        isVisible={false}
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
            source={require('../assets/finish_0904.png')}
            style={{ width: 100, height: (80 * 100) / 100 , marginTop: 50,}}></Image>
          <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 20, fontWeight: 'bold' }}>AI 일기가 발행됐다</Text>
            <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 20, fontWeight: 'bold' }}>무</Text>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 20, fontWeight: 'bold' }}>~</Text>
          </View>
          <View style={{alignItems: 'center',}}>
            <Text style={{ color: '#475467', fontSize: 16, }}>내가 멋지게 만든 일기를 확인해 봐라무!</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1,}}>
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {setIsLodingModalVisible(false); setIsLodingFinishModalVisible(false); amplitude.backToWeeklyFromCanModal(today.format('YYYY-MM-DD'));}}>
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
        animationIn={"fadeIn"} animationOut={"fadeOut"}
        backdropColor='#CCCCCC' backdropOpacity={0.9}
        style={{ alignItems:'center' }}
        backdropTransitionInTiming={0} // Disable default backdrop animation
        backdropTransitionOutTiming={0} // Disable default backdrop animation
      >
        <View style={diaryStyles.finishLodingModal}>
          {/* <ActivityIndicator size="large" color="#00E3AD"/> */}
          <Image 
            source={require('../assets/write_0904.png')}
            style={{ width: 92, height: (105 * 92) / 92 , marginTop: 40,}}></Image>
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
                <Text style={{ color: '#344054', fontSize: 18, fontWeight: '600',}}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {handleCancelButton(); setIsWarningModalVisible(false); amplitude.confirmCancelEditingDiary(today.format('YYYY-MM-DD'));}}>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600',}}>확인</Text>
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
            source={require('../assets/write_0904.png')}
            style={{ width: 92, height: (105 * 92) / 92 , marginTop: 40,}}></Image>
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
                <Text style={{ color: '#344054', fontSize: 18, fontWeight: '600',}}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={diaryStyles.confirmBtn} onPress={() => {handleCancelWhileMove2AnotherDayButton(tryToChangeToday); setIsWarningMove2AnotherDayModalVisible(false);}}>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600',}}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
                    
        </View>
      </Modal>
      {/* 4-6. AI 일기 삭제 경고 모달 */}
      <Modal isVisible={deleteDiaryModalVisible}
        animationIn={"fadeIn"} animationOut={"fadeOut"}
        backdropColor='#CCCCCC' backdropOpacity={0.9}
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
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>일기를 삭제하겠냐</Text>
            <Text style={{ color: '#FFCC4D', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>무</Text>
            <Text style={{ color: '#101828', marginVertical: 0, fontSize: 18, fontWeight: 'bold' }}>?</Text>
          </View>
          <View style={{alignItems: 'center',}}>
            <Text style={{ color: '#475467', fontSize: 14, }}>다시 볼 수 없다무..!</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1, gap: 12}}>
              <TouchableOpacity style={TimelineDiaryStyles.cancelOut2EditBtn} onPress={() => {setDeleteDiaryModalVisible(false); amplitude.cancelToDeleteDiary();}}>
                <Text style={{ color: '#344054', fontSize: 16, fontWeight: '600',}}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={TimelineDiaryStyles.confirmBtn} onPress={() => {handleDeleteDiaryConfirm(); setDeleteDiaryModalVisible(false);}}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
                    
        </View>
      </Modal>
      
    </View>
    
  );
};

const bubbleStyles = StyleSheet.create({
  container: {
    backgroundColor: '#72D193',
    padding: 10,
    // maxWidth: 200,
    width: 220,
    alignSelf: 'flex-start', // 좌측 정렬로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
    position: 'relative',
    overflow: 'hidden', // 클리핑 적용
  },
  tail: {
    position: 'absolute',
    width: 20, // 꼬리의 길이
    height: 20, // 꼬리의 높이
    left: 10, // 꼬리 위치
    bottom: -5, // 꼬리 위치
    backgroundColor: '#72D193',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 10, // 둥글게 만들기
    // borderBottomLeftRadius: 10,
    // borderTopRightRadius: 10
  },
  reply: {
    backgroundColor: '#fff',
    padding: 7,
    // maxWidth: 200,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
    position: 'relative',
    borderColor: '#72D193',
    borderWidth: 1,
    overflow: 'hidden', // 클리핑 적용
  },
  moo_status_bar: {
    backgroundColor: '#FCD49B', width: '100%', zIndex: 10, paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end'
  },
});

const dropDownStyles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    marginBottom: 10,
    zIndex: 50,
  },
  dropdownButton: {
    paddingTop: 15,
    paddingLeft: 15,
  },
  dropdownButtonText: {
    fontSize: 14,
    backgroundColor: '#fafafa',
    // backgroundColor: 'pink',
    padding: 5,
    paddingHorizontal: 12,
    paddingRight: 22,
    borderRadius: 6,
  },
  dropdownOptions: {
    backgroundColor: '#ffffff',
    marginTop: 5, marginLeft: 5,
    padding: 3, paddingRight: 20,
    alignSelf: 'flex-start',
    position: 'absolute', left: 10, top: 50, width: 100,
    borderRadius: 5,
    shadowColor: '#000', // 그림자 색상 // change for ios
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치 // change for ios
    shadowOpacity: 0.1, // 그림자 투명도 // change for ios
    shadowRadius: 5,           // 그림자 블러 반경 // change for ios
    elevation: 4,              // 안드로이드에서 그림자를 표시하기 위한 설정
    zIndex: 100,
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
    borderColor: '#FFCC4D',//#72D193
  },
  day_notYet_today: {
    borderBottomWidth: 2,
    borderColor: '#B7B7B7',
  },
  dayText: {
    color: '#212429',
    fontSize: 14,
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
    backgroundColor: '#FFCC4D',//72D193
    borderRadius: 10,
    width: 22,
    height: 22,
    lineHeight: 20,
    overflow: 'hidden',
  },
  dayText_notYet_today: {
    // flexDirection: 'column', 
    color: 'white',
    backgroundColor: '#B7B7B7',
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
  activeFont: {
    fontSize: 16,
    color: '#FFCC4D',//72D193
    fontWeight:'600'
  },
  deactiveType: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deactiveFont: {fontSize: 16, color: '#B7B7B7', fontWeight:'400'},
  canGenerateDiaryDot: {
    width: 4,
    height: 4,
    top: 6,
    right: 12,
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
    height: 330,
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
    padding: 8,
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
    padding: 8,
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


// Timeline.tsx 를 이쪽으로 옮김 (삭제할 때 이모지들을 자동 렌더링을 못해서 ...)
interface TimelineProps {
  data: repository.IPushedStamp[];
}
const Timelinestyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-end', // 상단 정렬
    marginTop: 16, marginHorizontal: 16, 
    gap: 16
  },
  block: {
    // flex: 1,
    color: '#212429',
    borderRadius: 10,
    borderTopRightRadius: 0,
    backgroundColor: '#E1EFE6',
    minWidth: 230,
    // borderColor: '#72D193',
    // borderWidth: 1
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginHorizontal: 10,
    marginVertical: 9,
    fontSize: 14,
    color: '#212429',
  },
  line: {
    left: 0,
    right: 0,
    borderTopWidth: 1, /* 선분 스타일 설정 (여기서는 1px 두께의 선으로 설정) */
    borderTopColor: '#FFFFF9', /* 선분 색상 설정 */
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginRight: 6,
  },
});
const TimelineDropDownStyles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 10,
    // position: 'relative',
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
    shadowColor: '#000', // 그림자 색상 // change for ios
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치 // change for ios
    shadowOpacity: 0.1, // 그림자 투명도 // change for ios
    shadowRadius: 5,           // 그림자 블러 반경 // change for ios
    elevation: 4,              // 안드로이드에서 그림자를 표시하기 위한 설정
  },
  dropdownButtonText: {
    fontSize: 16,
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
    padding: 8,
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
    padding: 8,
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