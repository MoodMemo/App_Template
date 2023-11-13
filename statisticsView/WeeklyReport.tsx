import React, { useState, useEffect } from 'react';
import { Dimensions, Image, View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch, Linking, StatusBar} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm, { IPushedStamp, IDailyReport, getPushedStampsAllByField, getPushedStampsByFieldBetween, getDailyReportsByFieldBetween } from '../src/localDB/document';
import * as repository from '../src/localDB/document';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PieChart} from 'react-native-gifted-charts';
import DashedLine from 'react-native-dashed-line';

import * as amplitude from '../AmplitudeAPI';

import {default as Text} from "../CustomText"
const screenWidth = Dimensions.get('window').width;
const width = screenWidth > 500 ? 500 : screenWidth;
const buttonWidth = (width - 56 - (3 * 20)) / 4; // 56은 양쪽의 마진 합, 3*20은 3개의 간격

// 기본 디자인에서의 버튼 너비
const defaultButtonWidth = 69;

// 비율 계산
const scale = buttonWidth / defaultButtonWidth

const test = () => {
  console.log('hello');
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const chartColor=[['#9BE300','#FFFFFF'],['#FF7DB8','#FFFFFF'],['#5BC4FF','#FFFFFF'],['#DFAAFF','#FFFFFF'],['#FFA887','#FFFFFF'],['#AAAAAA','#FFFFFF']]

const stringToDate = (dateString) => {
    var parts = dateString.split('.');
    if (parts.length === 3) {
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var day = parseInt(parts[2], 10);

        return new Date(year,month,day);
    }
}

const WeeklyReport = ({reportWeekDate}) => {

    

    const [reportMode, setReportMode] = useState('stat');

    const [userName, setUserName] = useState('');
    const [date,setDate]=useState(new Date());
    const [year,setYear]=useState(date.getFullYear());
    const [month,setMonth]=useState(date.getMonth()+1);
    const [summaryOrDetail, setSummaryOrDetail] = useState(true);
    const [stamps,setStamps] = useState([]);
    const [stampsChart,setStampsChart] = useState([]);
    const [countStamps,setCountStamps] = useState(0);
    const [countDiarys,setCountDiarys] = useState(0);
    const [countLoggedDates,setCountLoggedDates] = useState(0);
    const [recentReportWeekNum, setRecentReportWeekNum] = useState(0);
    const [reportWeekNum, setReportWeekNum] = useState(0);
    const [weeklyReportMode, setWeeklyReportMode] = useState(false);
    const [statusBar,setStatusBar] = useState('#FAFAFA');
    const [isCheckListSucceeded,setIsCheckListSucceeded] = useState(false);
    const [checkListBody,setCheckListBody] = useState('');
    const [checkListCount,setCheckListCount] = useState(0);
    const [checkListGoal, setCheckListGoal] = useState(0);

    useEffect(() => {
      // AsyncStorage에서 userName 값을 가져와서 설정
      AsyncStorage.getItem('@UserInfo:userName')
        .then((value) => {
          if (value) {
            setUserName(value);
          }
        })
        .catch((error) => {
          console.error("Error fetching userName:", error);
        });
      getStatistics(year,month);
    }, []);

    const dateFormat = (date:any) => {
      let month = date.getMonth() + 1;
      let day = date.getDate();
    
      month = month >= 10 ? month : '0' + month;
      day = day >= 10 ? day : '0' + day;
    
      return date.getFullYear() + '-' + month + '-' + day;
    }

    function getDaysInMonth(year:any, month:any) {
      return new Date(year, month, 0).getDate();
    }

    const sortStamps = (a:any,b:any) => {
      if(a[1] > b[1]) return -1;
      else if(a[1] < b[1]) return 1;
      else return 0;
    }

    const sortStampsByDate = (a:any,b:any) => {
        if(a.dateTime < b.dateTime) return -1;
        else if(a.dateTime > b.dateTime) return 1;
        else return 0;
      }

    const getStatistics = async (year:any,month:any) => {
        var date_L=reportWeekDate.split('~')
        var start = stringToDate(date_L[0]);
        var end = stringToDate(date_L[1]);
        end.setDate(end.getDate()+1);
      var listOfStamps=await getPushedStampsByFieldBetween('dateTime', start, end);
      // console.log(month);
      // console.log(listOfStamps);
      // console.log(listOfStamps.length);
      setCountStamps(listOfStamps.length);
      var count=0;
      var stamps=[];
      var temporaryStampsChart=[];
      var color=0;
      listOfStamps.sort(sortStampsByDate);
      if(listOfStamps.length>0)
      {
        var stamp_date = listOfStamps[0].dateTime;
        count+=1;
        for(var i=1;i<listOfStamps.length;i++){
            if(stamp_date<=listOfStamps[i].dateTime && stamp_date.getDate()!=listOfStamps[i].dateTime.getDate()){
                count+=1;
                stamp_date=listOfStamps[i].dateTime;
          }
        }
        for(var i=0;i<listOfStamps.length;i++){
          var notInStamps=true;
          for(var j=0;j<stamps.length;j++){
            if(stamps[j][0].stampName===listOfStamps[i].stampName){
              stamps[j][1]+=1;
              notInStamps=false;
              break;
            }
          }
          if(notInStamps){
              stamps.push([listOfStamps[i],1,"aa"]);
          }
        }
        stamps.sort(sortStamps);
        for(var i=0;i<stamps.length;i++){
          if(color<6){
            stamps[i][2]=chartColor[color];
            temporaryStampsChart.push([{},stamps[i][1],chartColor[color++]]);
          }
          else{
            stamps[i][2]=chartColor[5];
            temporaryStampsChart[5][1]++;
          }
        }
      }
      setStamps(stamps);
      setStampsChart(temporaryStampsChart);
      setCountLoggedDates(count);
      var listOfDiarys=await getDailyReportsByFieldBetween('date', dateFormat(start), dateFormat(end));
      setCountDiarys(listOfDiarys.length);
    }

    const handleNext = () => {
      if(reportMode==='stat'){
        setReportMode('aboutLastWeek');
        setStatusBar('#FFFFFF');
      }
    }

    return (
    <View style={{backgroundColor:'#FFFFFF',flex:1}}>
    <StatusBar
      backgroundColor={statusBar}
      barStyle='dark-content'
    />
    {reportMode==='stat' ? (
    <>
    <View style={styles.titleContainer}>
          <Text style={styles.title}>{userName}의{'\n'}감정을 분석해봤다무!</Text>
    </View>
    <Image 
    source={require('../assets/magnifyingMoo.png')}
    style={{ width: 154*0.55, height: (154 * 192)*0.55 / 154 , position: 'relative', bottom: 95, left: windowWidth-120, overflow: 'hidden'}}/>
    </>
    ) : (<></>)}
    <View style={{flexDirection: 'row',alignSelf:'center',marginTop:reportMode==='stat' ? -80 : 2}}>
      <Text style={{fontSize:18,color:'#212429',marginTop:2}}> {reportWeekDate} </Text>
    </View>
    {reportMode==='stat' ? (<>
    <ScrollView style={{marginTop:15}}>
      {/* <View style={{width:340,alignSelf:'center',overflow:'hidden'}}>
        <Text style={{fontSize:14,color:'#212429',marginBottom:10}}>{userName}의 체크리스트</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between', marginBottom:15}}>
          <View style={{flexDirection:'row'}}>
            {isCheckListSucceeded ? (<Image 
            source={require('../assets/check-circle-outline.png')}
            style={{ width: 30, height: 49*30/48 , position: 'relative', overflow: 'hidden'}}/>) :
            (<Image 
            source={require('../assets/cancel_circle.png')}
            style={{ width: 30, height: 49*30/48 , position: 'relative', overflow: 'hidden'}}/>)}
            <Text style={{fontSize:20,color:'#212429',marginTop:2,marginLeft:10}}>스탬프 5개 남기기</Text>
          </View>
          <View style={{height:35,borderRadius:7,borderColor:'#DBDBDB',borderWidth:1.5,marginRight:5}}>
            <Text style={{fontSize:18,color:'#212429',marginHorizontal:3,marginTop:2}}>  {checkListCount} / {checkListGoal}  </Text>
          </View>
        </View>
        <DashedLine dashLength={10} dashThickness={2} dashGap={10} dashColor={isCheckListSucceeded ? '#7CD0B2' : '#FF7168'}/>
      </View> */}
        <View style={{flexDirection: 'row', alignSelf:'center', marginTop:15, marginBottom:25}}>
          <View style={{alignItems:'center',marginRight:18}}>
            <Text style={{fontSize:14,color:'#212429',marginBottom:5}}>기록한 스탬프</Text>
            <Text style={{fontSize:22,color:'#FFCC4D'}}>{countStamps}개</Text>
          </View>
          <View style={{alignItems:'center',marginRight:18}}>
            <Text style={{fontSize:14,color:'#212429',marginBottom:5}}>AI 일기 발행</Text>
            <Text style={{fontSize:22,color:'#FFCC4D'}}>{countDiarys}개</Text>
          </View>
          <View style={{alignItems:'center',marginRight:18}}>
            <Text style={{fontSize:14,color:'#212429',marginBottom:5}}>기록 일자</Text>
            <Text style={{fontSize:22,color:'#212429'}}>{countLoggedDates}일</Text>
          </View>
        </View>
        <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
        <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
        <View style={{marginLeft:25,alignItems:'center',marginTop:30}}>
          <PieChart data={stampsChart.map((stamp:any) => ({
            value: stamp[1],
            color: stamp[2][0],
            text: `${Math.round(stamp[1]*100/countStamps)}%`,
            textColor: stamp[2][1],
            shiftTextX:-5,
            shiftTextY:3,
            textSize:15
          }))}
            donut={true}
            showText={true}
            innerRadius={40}
            radius={80}
          />
        </View>
          <View style={{flexDirection: 'row',
                          justifyContent: 'space-between'}}>
            <Text style={{marginLeft:20,fontSize:16,color:'#999999'}}>전체</Text>
            <Text style={{marginRight:20,fontSize:16,color:'#999999'}}>{countStamps}개</Text>
          </View>
          <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:20,marginTop:10,marginBottom:5}}/>
          {stamps.sort(sortStamps).map((stampButton:any) => (
            <TouchableOpacity key={stampButton[0].id} style={{marginHorizontal:20,flexDirection:'row',justifyContent:'space-between',marginBottom:10}} disabled={true}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width:12,height:12,backgroundColor:stampButton[2][0],borderRadius:8,marginTop:9,marginRight:7}}/>
                <Text style={{marginRight:7,fontSize:20}}>{stampButton[0].emoji}</Text>
                <Text style={{marginRight:7,marginTop:(Platform.OS==='android' ? 3 : 5),fontSize:16,color:'#000000'}}>{stampButton[0].stampName}</Text>
                <Text style={{marginTop:(Platform.OS==='android' ? 3 : 5),fontSize:16,color:'#999999'}}>{`${Math.round(stampButton[1]*100/countStamps)}%`}</Text>
              </View>
              <Text style={{color: '#000000',fontSize:16}}>{stampButton[1]}개</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={handleNext}>
          <View style={{width:'100%',height:60,backgroundColor:'#72D193',alignItems:'center', justifyContent:'center',}}> 
            <Text style={{fontSize:25,color:'#FFFFFF'}}>확인했어!</Text>
          </View>
        </TouchableOpacity>
      </>) : (<></>)}
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: buttonWidth, 
    height: 100 * scale, // 기본 높이에 비율을 곱함
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#7CD0B2',
    backgroundColor: '#FFFFFF',
    borderRadius: 12 * scale, // 기본 borderRadius에 비율을 곱함
    marginBottom: 20 * scale, // 기본 marginBottom에 비율을 곱함
    gap: 10,
  },
  buttonEmotion: {
    fontSize: 24 * scale, // 기본 fontSize에 비율을 곱함
  },
  titleContainer: {
      backgroundColor: '#FAFAFA',
      height: 100,
      borderBottomRightRadius: 43,
      // alignItems: 'center', // 가로 정렬
  },
  view: {
    position: 'relative',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  title: {
    // fontFamily: 'Pretendard',
    color: '#212429',
    fontWeight: '400',
    width: '100%',
    height: '100%',
    fontSize: 24,
    marginTop: 20,
    marginLeft: 28,
    marginRight: 200,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 17,
  },
  confirmBtn: {
      alignSelf: 'center',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 8,
      backgroundColor: '#72D193', 
      borderRadius: 8,
      flex: 1,
      
  },
  memoContent: { 
      justifyContent: 'center',
      padding: 10,
      borderRadius: 8,
      flex: 1,
      flexDirection: 'column',
      display: 'flex',
      // width: 320,
      paddingHorizontal: 16,
      paddingVertical: 10,
      // gap: 6,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      // borderRadius: 6,
    },
});

export default WeeklyReport;