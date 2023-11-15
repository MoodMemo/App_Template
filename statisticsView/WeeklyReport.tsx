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
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from '../weeklyView/DocumentFunc';


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

const WeeklyReport = ({reportWeekDate,setWeeklyReportMode,weeklyReportMode}) => {

    

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
    const [statusBar,setStatusBar] = useState('#FAFAFA');
    const [isCheckListSucceeded,setIsCheckListSucceeded] = useState(false);
    const [checkListBody,setCheckListBody] = useState('');
    const [checkListCount,setCheckListCount] = useState(0);
    const [checkListGoal, setCheckListGoal] = useState(0);
    const [selectedStampIndex,setSelectedStampIndex] = useState(-1);
    const [selectedStamp,setSelectedStamp] = useState({});
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');


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
      else if(reportMode==='aboutLastWeek'){
        setReportMode('checkStamp');
      }
    }

    const getWeeklyStamps = () => {
      const listOfStamps:IPushedStamp[]=[];
      var date_L=reportWeekDate.split('~')
      var start = stringToDate(date_L[0]);
      var end = stringToDate(date_L[1]);
      end.setDate(end.getDate()+1);
      getPushedStampsByFieldBetween('dateTime', start, end).forEach((pushedStamp) => {
        listOfStamps.push(pushedStamp);
    });
      listOfStamps.sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
      return listOfStamps;
    }

    const stampDateString2 = (stampDate:Date):String => {
      
      
      let month = stampDate.getMonth() + 1;
      let day = stampDate.getDate();

      month = month >= 10 ? month : '0' + month;
      day = day >= 10 ? day : '0' + day;
      var dateTime:String = (stampDate.getFullYear()).toString()+'.'+month+'.'+day+' ';
      return dateTime
    }

    const stampDateString3 = (stampDate:Date):String => {
      
      
      let month = stampDate.getMonth() + 1;
      let day = stampDate.getDate();
      let hour = stampDate.getHours();
      let minute = stampDate.getMinutes();

      month = month >= 10 ? month : '0' + month;
      day = day >= 10 ? day : '0' + day;
      hour = hour >= 10 ? hour : '0' + hour;
      minute = minute >= 10 ? minute : '0' + minute;
      var dateTime:String = (stampDate.getFullYear()).toString()+'.'+month+'.'+day+' '+hour+':'+minute;
      return dateTime
    }

    const stampDateString = {
      // ko-KR
      // hour: '2-digit', minute: '2-digit', hour12: true,
      hour: "numeric", minute: "numeric" ,
    };

    const saveWeeklyReport = () => {

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
          <View style={{width:'90%',height:60,backgroundColor:'#FFFFFF',alignItems:'center', justifyContent:'center',alignSelf:'center',borderRadius:10,borderColor:'#72D193',borderWidth:1}}> 
            <Text style={{fontSize:25,color:'#72D193'}}>확인했어!</Text>
          </View>
        </TouchableOpacity>
      </>) : (reportMode==='aboutLastWeek' ? (<>
        {true ? ( // 스탬프 기록
        getEmoji(getWeeklyStamps()).length !== 0 ? ( // 스탬프 exists
          <View style={{ alignItems: 'center', flex: 1,}}>
            <View style={{marginTop: 16, marginHorizontal: 16, }}>
              <View style={{flexDirection:'row'}}>
                <Image 
                source={require('../assets/write_0904.png')}
                style={{ width: 80, height: 1653*80 / 1437 , position: 'relative', marginLeft:10, overflow: 'hidden'}}/>
                <View style={bubbleStyles.tail}></View>
                <View style={[bubbleStyles.container,{width:240,height:85,marginLeft:25}]}>
                  <Text style={{fontSize: 15, color: '#fff', marginBottom: 5, marginTop:10}}>{userName}의 지난 한 주 중</Text>
                  <Text style={{fontSize: 15, color: '#fff', marginBottom: 10}}>가장 부정적인 스탬프를 골라보라무!</Text>
                </View>
              </View>
              <ScrollView>
                <View style={Timelinestyles.container}>
                  {getWeeklyStamps().map((item, index) => (
                    <>
                    {index===0 || getWeeklyStamps()[index-1].dateTime.getDate() !== item.dateTime.getDate() ? <View style={{flexDirection:'row',marginTop:30,marginBottom:10}}>
                      <View style={{
                      marginTop:10,
                      marginRight:13,
                      width:windowWidth/3,
                      borderTopWidth: 1, /* 선분 스타일 설정 (여기서는 1px 두께의 선으로 설정) */
                      borderTopColor: '#72D193', /* 선분 색상 설정 */
                      }}></View>
                      <Text style={{fontSize:15,color:'#495057'}}>{stampDateString2(item.dateTime)}</Text>
                      <View style={{
                      marginTop:10,
                      marginLeft:10,
                      width:windowWidth/3,
                      borderTopWidth: 1, /* 선분 스타일 설정 (여기서는 1px 두께의 선으로 설정) */
                      borderTopColor: '#72D193', /* 선분 색상 설정 */
                      }}></View>
                    </View> : <></>}
                    <View key={index} style={Timelinestyles.timelineItem}>
                      {/* 이모지 */}   
                      <View style={Timelinestyles.emojiContainer}>
                        
                        <Text style={{fontSize: 24, color: 'black',}}>{item.emoji}</Text>
                        {index < getWeeklyStamps().length - 1 ? (index!==getWeeklyStamps().length-1 && getWeeklyStamps()[index+1].dateTime.getDate() === item.dateTime.getDate() ? <View style={Timelinestyles.line2} /> : <></>) : 
                        <></>}
                      </View>

                      {/* 텍스트 */}
                      <TouchableOpacity onPress={()=>{
                        setSelectedStampIndex(index);
                        setSelectedStamp(item);
                      }}
                      style={{
                          flex: 1,
                          marginBottom: 10,
                          borderRadius: 8,
                          backgroundColor: selectedStampIndex===index ? '#72D193' : '#FFFFFF',
                          borderColor: selectedStampIndex===index ? '#72D193' : '#F0F0F0',
                          borderWidth: 1
                        }}>
                        <View style={Timelinestyles.title}>
                          <Text style={{fontSize: 14, color: '#212429'}}>{item.stampName}</Text>
                          <Text style={{ fontSize: 14, color: '#495057', right:-15}} >{item.dateTime.toLocaleTimeString('en-US', stampDateString)}    </Text> 
                        </View>
                        <View style={Timelinestyles.line}></View>
                        <Text style={Timelinestyles.title}>{item.memo}</Text>
                        {/* <Text style={styles.title}>{item.imageUrl}</Text> */}
                      </TouchableOpacity>
                    </View>
                    </>))}
                </View>
              </ScrollView>
              <TouchableOpacity onPress={() => {if(selectedStampIndex!==-1) handleNext(); }}>
              <View style={{width:'90%',height:60,backgroundColor:'#FFFFFF',alignItems:'center', justifyContent:'center',alignSelf:'center',borderRadius:10,borderColor:'#72D193',borderWidth:1}}> 
                <Text style={{fontSize:25,color:'#72D193'}}>골랐어!</Text>
              </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : ( // 스탬프가 없을 때, 날짜에 따라 다름
          <></>
        ))
      : ( // ai 일기
      <></>
      )}
      </>) : (reportMode==='checkStamp' ? (<>
        <View style={{alignSelf:'center',marginTop:70}}>
          <View style={[bubbleStyles.container,{width:320}]}>
            <Text style={{fontSize: 17, color: '#fff', marginBottom: 10}}>방금 고른 스탬프가 이거 맞냐무?</Text>
            <View style={Timelinestyles.timelineItem}>
              <View
              style={{
                  flex: 1,
                  marginBottom: 10,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  borderColor: '#F0F0F0',
                  borderWidth: 1
                }}>
                <View style={Timelinestyles.title}>
                  <Text style={{fontSize: 14, color: '#212429'}}>{selectedStamp.emoji}  {selectedStamp.stampName}</Text>
                  <Text style={{ fontSize: 14, color: '#495057', right:-15}} >{stampDateString3(selectedStamp.dateTime)}    </Text> 
                </View>
                <View style={Timelinestyles.line}></View>
                <Text style={Timelinestyles.title}>{selectedStamp.memo}</Text>
                {/* <Text style={styles.title}>{item.imageUrl}</Text> */}
              </View>
            </View>
          </View>
          <View style={bubbleStyles.tail_2}></View>
        </View>
        <Image source={require('../assets/finish_0904.png')}
        style={{ width: 200, height: (1323 * 200) / 1650 , alignSelf:'center', right:10, marginTop:30}}/>
        <View style={{flexDirection:'row', justifyContent:'space-between', width:screenWidth, marginTop:50}}>
          <TouchableOpacity style={{backgroundColor: '#fff',
          padding: 10,
          width: screenWidth/2-20,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          marginTop: 40,
          // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
          position: 'relative',
          borderColor: '#AAAAAA',
          borderWidth: 1,
          marginLeft:15,
          height:60,
          overflow: 'hidden',}} onPress={(() => {
            setReportMode('aboutLastWeek');
          })}>
            <Text style={{fontSize: 20, color: '#AAAAAA', fontWeight: '600'}}>다시 생각해볼게...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#fff',
            padding: 10,
            width: screenWidth/2-20,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            marginTop: 40,
            // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
            position: 'relative',
            borderColor: '#72D193',
            borderWidth: 1,
            marginRight:15,
            height:60,
            overflow: 'hidden',}} onPress={(() => {
              setReportMode('template');
            })}>
                <Text style={{fontSize: 20, color: '#72D193', fontWeight: '600'}}>맞아!</Text>
          </TouchableOpacity>
        </View>
      </>) : (reportMode==='template' ? <View style={{flex:1}}>
        <View style={Timelinestyles.timelineItem}>
          <View
          style={{
              width:'90%',
              marginHorizontal:'5%',
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#FFFFFF',
              borderColor: '#F0F0F0',
              borderWidth: 1
            }}>
            <View style={Timelinestyles.title}>
              <Text style={{fontSize: 14, color: '#212429'}}>{selectedStamp.emoji}  {selectedStamp.stampName}</Text>
              <Text style={{ fontSize: 14, color: '#495057', right:-15}} >{stampDateString3(selectedStamp.dateTime)}    </Text> 
            </View>
            <View style={Timelinestyles.line}></View>
            <Text style={Timelinestyles.title}>{selectedStamp.memo}</Text>
            {/* <Text style={styles.title}>{item.imageUrl}</Text> */}
          </View>
        </View>
      <ScrollView>
        <View style={{flexDirection:'row',marginTop:15}}>
          <Image 
          source={require('../assets/write_0904.png')}
          style={{ width: 80, height: 1653*80 / 1437 , position: 'relative', marginLeft:10, overflow: 'hidden'}}/>
          <View style={bubbleStyles.tail}></View>
          <View style={[bubbleStyles.container,{width:240,height:85,marginLeft:25}]}>
            <Text style={{fontSize: 15, color: '#fff', marginBottom: 5, marginTop:10}}>{userName}의 지난 한 주 중</Text>
            <Text style={{fontSize: 15, color: '#fff', marginBottom: 10}}>가장 부정적인 스탬프를 골라보라무!</Text>
          </View>
        </View>
        <View style={{width:200,height:200}}>
          <TextInput style={{
          fontSize:16,
          color: '#000000',
          width: windowWidth-20,
          left:10,
          marginTop:20,
          height:150,
          // padding: 7,
          borderWidth:1,
          borderRadius: 10,
          borderColor:'#DDDDDD',
          fontFamily: 'Pretendard',
          fontWeight: '400',
          fontStyle: 'normal',
          lineHeight: 24,
          }}
          onChangeText={(text) => setAnswer1(text)}
          multiline={true}>
          </TextInput>
        </View>
        <View style={{flexDirection:'row',marginTop:20}}>
          <Image 
          source={require('../assets/write_0904.png')}
          style={{ width: 80, height: 1653*80 / 1437 , position: 'relative', marginLeft:10, overflow: 'hidden'}}/>
          <View style={bubbleStyles.tail}></View>
          <View style={[bubbleStyles.container,{width:240,height:85,marginLeft:25}]}>
            <Text style={{fontSize: 15, color: '#fff', marginBottom: 5, marginTop:10}}>{userName}의 지난 한 주 중</Text>
            <Text style={{fontSize: 15, color: '#fff', marginBottom: 10}}>가장 부정적인 스탬프를 골라보라무!</Text>
          </View>
        </View>
        <View style={{width:200,height:200}}>
          <TextInput style={{
          fontSize:16,
          color: '#000000',
          width: windowWidth-20,
          left:10,
          marginTop:20,
          height:150,
          // padding: 7,
          borderWidth:1,
          borderRadius: 10,
          borderColor:'#DDDDDD',
          fontFamily: 'Pretendard',
          fontWeight: '400',
          fontStyle: 'normal',
          lineHeight: 24,
          }}
          onChangeText={(text) => setAnswer2(text)}
          multiline={true}>
          </TextInput>
        </View>
        </ScrollView>
        <TouchableOpacity onPress={() => {setReportMode('end')}}>
        <View style={{width:'90%',height:60,backgroundColor:'#FFFFFF',alignItems:'center', justifyContent:'center',alignSelf:'center',borderRadius:10,borderColor:'#72D193',borderWidth:1}}> 
          <Text style={{fontSize:25,color:'#72D193'}}>다 적었어!</Text>
        </View>
        </TouchableOpacity>
        </View> : <>
        <View style={{alignSelf:'center',marginTop:70}}>
          <View style={[bubbleStyles.container,{width:300,height:140}]}>
            <Text style={{fontSize: 17, color: '#fff', marginBottom: 10}}>무드 리포트 쓰느라 고생했다무!</Text>
            <Text style={{fontSize: 17, color: '#fff', marginBottom: 10, }}>안 좋았던 마음이 풀렸으면 좋겠다무...</Text>
            <Text style={{fontSize: 17, color: '#fff', marginBottom: 0, }}>다음 한 주도 파이팅이다무!</Text>
          </View>
          <View style={bubbleStyles.tail_2}></View>
        </View>
        <Image source={require('../assets/finish_0904.png')}
          style={{ width: 200, height: (1323 * 200) / 1650 , alignSelf:'center', right:10, marginTop:30}}/>
        <TouchableOpacity onPress={() => {
          setWeeklyReportMode(!weeklyReportMode);
          saveWeeklyReport();
        }}>
        <View style={{marginTop:70,width:'90%',height:60,backgroundColor:'#FFFFFF',alignItems:'center', justifyContent:'center',alignSelf:'center',borderRadius:10,borderColor:'#72D193',borderWidth:1}}> 
          <Text style={{fontSize:25,color:'#72D193'}}>고마워 무야!</Text>
        </View>
        </TouchableOpacity>
        </>)))}
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
    fontSize: 14,
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
    left: 105, // 꼬리 위치
    bottom: 45, // 꼬리 위치
    backgroundColor: '#72D193',
    transform: [{ rotate: '135deg' }],
    borderTopLeftRadius: 10, // 둥글게 만들기
    // borderBottomLeftRadius: 10,
    // borderTopRightRadius: 10
  },
  tail_2: {
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


export default WeeklyReport;