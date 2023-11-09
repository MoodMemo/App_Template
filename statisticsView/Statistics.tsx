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
import WeeklyReport from './WeeklyReport';

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

const Statistics = () => {

    // const handleOpenLink = async () => {
    //     const url = 'http://pf.kakao.com/_xhGnxgxj'; // 원하는 웹 링크
    
    //     // 웹 링크를 열기 위해 Linking.openURL()을 사용합니다.
    //     const supported = await Linking.canOpenURL(url);
    
    //     if (supported) {
    //       await Linking.openURL(url);
    //     } else {
    //       console.log("Don't know how to open URL: " + url);
    //     }
    //   };
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
    const [countConsecutedLoggedDates,setConsecutedCountLoggedDates] = useState(0);
    const [recentReportWeekNum, setRecentReportWeekNum] = useState(0);
    const [reportWeekNum, setReportWeekNum] = useState(0);
    const [reportWeekDate, setReportWeekDate] = useState('');
    const [weeklyReportMode, setWeeklyReportMode] = useState(false);

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
      AsyncStorage.getItem('@UserInfo:RecentReportWeekNum')
        .then((value) => {
          if(value) {
            setReportWeekNum(
              //Number(value)
              2
            );
            getMoodReport(
              //Number(value)
              2
            );
            setRecentReportWeekNum(
              // Number(value)
              2
            );
          }
        })
      getStatistics(year,month);
    }, []);

    const incDate = () => {
      if(month===12){
        setMonth(1);
        setYear(year+1);
      }
      else{
        setMonth(month+1);
      }
      console.log(year,month+1);
      getStatistics(year,month+1);
      amplitude.moveToNextMonth() //월 이동(증가)
    }

    const decDate = () => {
      if(month===1){
        setMonth(12);
        setYear(year-1);
      }
      else{
        setMonth(month-1);
      }
      console.log(year,month-1);
      getStatistics(year,month-1);
      amplitude.moveToPastMonth() //월 이동(감소)
    }

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

    const getStatistics = async (year:any,month:any) => {
      var d=new Date(year,month-1);
      d.setMonth(d.getMonth()+1);
      var listOfStamps=await getPushedStampsByFieldBetween('dateTime', new Date(year,month-1), d);
      var dateMap = [];
      for(var i=0;i<getDaysInMonth(year,month);i++){
        dateMap[i]=false;
      }
      // console.log(month);
      // console.log(listOfStamps);
      // console.log(listOfStamps.length);
      setCountStamps(listOfStamps.length);
      var loggedDates=0;
      var count=0;
      var ans=0;
      var stamps=[];
      var temporaryStampsChart=[];
      var color=0;
      if(listOfStamps.length>0)
      {
        for(var i=0;i<listOfStamps.length;i++){
          if(!dateMap[listOfStamps[i].dateTime.getDate()]){
            loggedDates+=1;
            dateMap[listOfStamps[i].dateTime.getDate()]=true;
          }
        }
        for(var i=0;i<dateMap.length;i++){
          if(!dateMap[i]){
            count=0
          }
          else{
            count+=1;
            if(ans<count){
              ans=count;
            }
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
      setCountLoggedDates(loggedDates);
      setConsecutedCountLoggedDates(ans);
      var listOfDiarys=await getDailyReportsByFieldBetween('date', dateFormat(new Date(year,month-1)), dateFormat(d));
      setCountDiarys(listOfDiarys.length);
    }

    const incMoodReportNum = () => {
      AsyncStorage.getItem('@UserInfo:RecentReportWeekNum').then((value) => {
        if(reportWeekNum<value){
          getMoodReport(reportWeekNum+1);
          setReportWeekNum(reportWeekNum+1);
        }
      })
    }

    const decMoodReportNum = () => {
      AsyncStorage.getItem('@UserInfo:RecentReportWeekNum').then((value) => {
        if(reportWeekNum>1){
          getMoodReport(reportWeekNum-1);
          setReportWeekNum(reportWeekNum-1);
        }
      })
    }


    const getMoodReport = (weekNum) => {
      if(weekNum===1) setReportWeekDate('2023.11.03~2023.11.09');
      else if(weekNum===2) setReportWeekDate('2023.11.10~2023.11.16');
      else setReportWeekDate('aa');
      //렐름 업데이트하고 값 가져와서 렌더링 하면 됨
    }

    return (
      !weeklyReportMode ? (
      <View style={{backgroundColor:'#FFFFFF',flex:1}}>
        <StatusBar
            backgroundColor='#FFFFFF'
            barStyle='dark-content'
        />
        {/* 드롭다운 컴포넌트 */}
        {summaryOrDetail ? (
        <View style={typeChangeBtnStyles.twotypebtn}>
          <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.moveToSummary()}}>
            <Text style={typeChangeBtnStyles.activeFont}>요약</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSummaryOrDetail(false); amplitude.moveToDetail();}} style={typeChangeBtnStyles.deactiveType}>
            <Text style={typeChangeBtnStyles.deactiveFont}>무드 리포트</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={typeChangeBtnStyles.twotypebtn}>
          <TouchableOpacity onPress={() => {setSummaryOrDetail(true); amplitude.moveToSummary();}} style={typeChangeBtnStyles.deactiveType}>
            <Text style={typeChangeBtnStyles.deactiveFont}>요약</Text>
          </TouchableOpacity>
          <TouchableOpacity style={typeChangeBtnStyles.activeType} onPress={() => {amplitude.moveToDetail()}}>
            <Text style={typeChangeBtnStyles.activeFont}>무드 리포트</Text>
          </TouchableOpacity>
        </View>
      )}
      {summaryOrDetail ? (
        <ScrollView style={{marginTop:15}}>
          <View style={{flexDirection: 'row',alignSelf:'center'}}>
            <TouchableOpacity onPress={decDate}>
                {
                  Platform.OS === 'android' ? (
                    <MaterialIcons name="arrow-left" size={30} style={{marginTop:0,color:'#212429'}}/>
                  ) : (
                    <MaterialIcons name="arrow-left" size={30} style={{marginTop:-2,color:'#212429'}}/>
                  )
                }
            </TouchableOpacity>
            <Text style={{fontSize:18,color:'#212429',marginTop:2}}> {year}년 {month>=10 ? '' : ' '}{month}월 </Text>
            <TouchableOpacity onPress={incDate}>
            {
                  Platform.OS === 'android' ? (
                    <MaterialIcons name="arrow-right" size={30} style={{marginTop:0,color:'#212429'}}/>
                  ) : (
                    <MaterialIcons name="arrow-right" size={30} style={{marginTop:-2,color:'#212429'}}/>
                  )
                }
            </TouchableOpacity>
          </View>
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
          <View style={{alignItems:'center',marginRight:5}}>
            <Text style={{fontSize:14,color:'#212429',marginBottom:5}}>연속 기록 일자</Text>
            <Text style={{fontSize:22,color:'#212429'}}>{countConsecutedLoggedDates}일</Text>
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
            radius={100}
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
        </ScrollView>) : 
        (
          <>
            <View style={{flexDirection: 'row',alignSelf:'center',marginTop:15}}>
              <TouchableOpacity
              onPress={()=>{decMoodReportNum();getMoodReport(reportWeekNum);}}
              disabled={reportWeekNum===1}>
                  {
                    Platform.OS === 'android' ? (
                      <MaterialIcons name="arrow-left" size={30} style={{marginTop:0,color:reportWeekNum<=1 ? '#AAAAAA' : '#212429'}}/>
                    ) : (
                      <MaterialIcons name="arrow-left" size={30} style={{marginTop:-2,color:reportWeekNum<=1 ? '#AAAAAA' : '#212429'}}/>
                    )
                  }
              </TouchableOpacity>
              <Text style={{fontSize:18,color:'#212429',marginTop:2}}> {reportWeekDate} </Text>
              <TouchableOpacity
              onPress={()=>{incMoodReportNum();getMoodReport(reportWeekNum);}}
              disabled={reportWeekNum===recentReportWeekNum}>
              {
                Platform.OS === 'android' ? (
                  <MaterialIcons name="arrow-right" size={30} style={{marginTop:0,color:reportWeekNum===recentReportWeekNum ? '#AAAAAA' : '#212429'}}/>
                ) : (
                  <MaterialIcons name="arrow-right" size={30} style={{marginTop:-2,color:reportWeekNum===recentReportWeekNum ? '#AAAAAA' : '#212429'}}/>
                )
              }
              </TouchableOpacity>
            </View>

            {
              //무드 리포트 작성 불가능
            }

            {/* <View style={{alignSelf:'center',marginTop:70}}>
              <View style={[bubbleStyles.container,{backgroundColor:'#B7B7B7',width:300,height:140}]}>
                <Text style={{fontSize: 17, color: '#fff', marginBottom: 5}}>아직 무드 리포트를 준비 중이라무~</Text>
                <Text style={{fontSize: 17, color: '#fff', marginBottom: 5, }}>앞으로 n일 뒤에</Text>
                <Text style={{fontSize: 17, color: '#fff', }}>무드 리포트를 보내주겠다무!</Text>
              </View>
              <View style={[bubbleStyles.tail,{backgroundColor:'#B7B7B7'}]}></View>
            </View>
            <Image source={require('../assets/write_disabled.png')}
              style={{ width: 200, height: (422 * 200) / 368 , alignSelf:'center', right:10, marginTop:30}}/> */}

            {
              //무드 리포트 작성 가능
            }
            
            <View style={{alignSelf:'center',marginTop:70}}>
              <View style={[bubbleStyles.container,{width:300,height:140}]}>
                <Text style={{fontSize: 17, color: '#fff', marginBottom: 10}}>무드 리포트를 작성할 수 있다무!</Text>
                <Text style={{fontSize: 17, color: '#fff', marginBottom: 0, }}>지금 바로 무드 리포트를 써보라무!</Text>
              </View>
              <View style={bubbleStyles.tail}></View>
            </View>
            <Image source={require('../assets/finish_0904.png')}
              style={{ width: 200, height: (1323 * 200) / 1650 , alignSelf:'center', right:10, marginTop:30}}/>
            <TouchableOpacity style={{backgroundColor: '#fff',
            padding: 10,
            width: 250,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            marginTop: 40,
            // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
            position: 'relative',
            borderColor: '#72D193',
            borderWidth: 1,
            overflow: 'hidden',}} onPress={(async () => { 
              setWeeklyReportMode(true);
            })}>
                <Text style={{fontSize: 16, color: '#72D193', fontWeight: '600'}}>좋아, 지금 써볼게!</Text>
            </TouchableOpacity>
          </>)}
      </View>) : (
        <WeeklyReport reportWeekDate={reportWeekDate}/>
      )
    );
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
        height: 160,
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
      marginTop: 28,
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
      padding: 2,
      borderRadius: 8,
      marginTop:15
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
      color: '#FFCC4D',//000000
      fontWeight:'600'
    },
    deactiveType: {
      flex: 1,
      backgroundColor: '#F3F3F3',
      alignItems: 'center',
      borderRadius: 8,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    deactiveFont: {fontSize: 16, color: '#B7B7B7', fontWeight:'400'},
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

  const bubbleStyles = StyleSheet.create({
    container: {
      backgroundColor: '#72D193',
      padding: 10,
      // maxWidth: 200,
      width: 230,
      alignSelf: 'flex-start', // 좌측 정렬로 변경
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
      position: 'relative',
      overflow: 'hidden', // 클리핑 적용
      zIndex: 30
    },
    tail: {
      position: 'absolute',
      width: 20, // 꼬리의 길이
      height: 20, // 꼬리의 높이
      left: 40, // 꼬리 위치
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
  });

export default Statistics;