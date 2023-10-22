import React, { useState, useEffect } from 'react';
import { Image, useWindowDimensions, View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch, Linking, StatusBar, Dimensions} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionCheck from 'react-native-version-check';
import { PERMISSIONS, RESULTS, requestNotifications, checkNotifications} from "react-native-permissions";
import RNRestart from 'react-native-restart';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/MaterialCommunityIcons';

import NotificationView from './NotificationView';
import NotificationAdd from './NotificationAdd';
import ChangeProfile from './ChangeProfile';
import { tmpMooStamps, tmpGiftStamps, MooStampDivider, GiftStampDivider } from './SettingsEventComponent';
import { getAmount, buyGift} from './AutumnEventGiftAPI';

import * as amplitude from './AmplitudeAPI';

import * as Sentry from "@sentry/react-native";
import { UserFeedback } from "@sentry/react-native";
import { useFocusEffect } from '@react-navigation/native';

import {default as Text} from "./CustomText";
// import {getAmount, buyGift} from "./AutumnEventGiftAPI";

const test = () => {
  console.log('hello');
}

function getRandomInt(min:any, max:any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const clearAsyncStorage = async () => {
    await AsyncStorage.clear();
    return 0;
}

const restartApp = async () => {
    RNRestart.restart();
}

const TitleDivider = () => {
    return (
        <View>
            <Divider style={{backgroundColor:"#DDDDDD"}}/>
            <Divider style={{backgroundColor:"#DDDDDD"}}/>
        </View>
    )
}

const SubtitleDivider = () => {
    return (
        <View>
            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
        </View>
    )
}

const Settings = () => {

    const [memo, setMemo] = useState('');
    const handleMemoChange = (text) => {
        setMemo(text);
      };  
    const sentryUserFeedback = () => {

        const sentryId = Sentry.captureMessage("고객센터/의견 보내기/요류 제보");    
        // OR: const sentryId = Sentry.lastEventId();
        // var userName = await AsyncStorage.getItem('@UserInfo:userName');
        // if (userName === null) userName = '익명';

        console.log(sentryId);

        const userFeedback: UserFeedback = {
            event_id: sentryId,
            name: "사용자도 아직",
            email: "이메일은 아직 개발 안했음",
            comments: memo,
            // comments: "memo",
        };
        Sentry.captureUserFeedback(userFeedback);
        amplitude.send2sentry(userFeedback.comments);
        /*
        const userFeedback2: UserFeedback = {
            event_id: sentryId,
            name: "사용자도 아직",
            email: "이메일은 아직 개발 안했음",
            // comments: memo,
            comments: "memo",
        };
        Sentry.captureUserFeedback(userFeedback2);
        amplitude.test99999(userFeedback2.comments);
        */
        
        setMemo('');
        setIsReportModalVisible(!isReportModalVisible);
    }

    const generateNotificationMessage = (notificationTime:Date) => {
        const notificationHour=notificationTime.getHours();
        if(0<=notificationHour && notificationHour<8){
            const messageList=['안 자고 모하냐무👀','잠은 안 오냐무? 나는 슬슬 졸리다무💤', '새벽까지 할 게 많냐무...!? 화이팅이다무💪'];
            return messageList[getRandomInt(0,3)];
        }
        else if(8<=notificationHour && notificationHour<12){
            const messageList=['굿모닝이다무☀ 날씨를 보니 기분이 어떻냐무?!', '굿모닝이다무☀ 잠은 잘 자고 일어났냐무?'];
            return messageList[getRandomInt(0,2)];
        }
        else if (12<=notificationHour && notificationHour<14){
            return '점심은 맛있게 먹었는지 궁금하다무! 누구랑 뭘 먹었냐무?🍚';
        }
        else if(14<=notificationHour && notificationHour<18){
            return '오늘 하루가 곧 끝나간다무! 지금 뭘 하고 있는지 들려달라무🌈';
        }
        else if(18<=notificationHour && notificationHour<20){
            return '맛있는 저녁밥 먹었냐무? 배고프다무🍽';
        }
        else if(20<=notificationHour && notificationHour<22){
            return '오늘은 어떤 하루였는지 궁금하다무🌙';
        }
        else{
            return '일기를 만들어주겠다무🕶 어서 들어와보라무!';
        }
    }
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
    const {height,width}=useWindowDimensions();
    //const [isModalVisible, setIsModalVisible] = useState(false);
    const [isKakaoModalVisible, setIsKakaoModalVisible] = useState(false);
    const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isShopModalVisible, setIsShopModalVisible] = useState(false);
    const [isCoffeeModalVisible, setIsCoffeeModalVisible] = useState(false);
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
    const [isNotificationListModalVisible, setIsNotificationListModalVisible] = useState(false);
    const [isClearDataModalVisible, setIsClearDataModalVisible] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [isNotificationTimeChanged, setIsNotificationTimeChanged] = useState(false);
    const [isNotificationAdded, setIsNotificationAdded] = useState(false);
    const [isEventLevelModalVisible, setIsEventLevelModalVisible] = useState(false);
    const [autumnEventCoin,setAutumnEventCoin] = useState(0);
    const [autumnEventLevel,setAutumnEventLevel] = useState(1);
    const [autumnEventBoughtIce,setAutumnEventBoughtIce] = useState(false);
    const [autumnEventBoughtChicken1,setAutumnEventBoughtChicken1] = useState(false);
    const [autumnEventBoughtChicken2,setAutumnEventBoughtChicken2] = useState(false);

    const sortNotificationByTime = (a:any,b:any) => {
        if(a.time > b.time) return 1;
        else if(a.time < b.time) return -1;
        else return 0;
    }

    const editStampList = (list) => {
        let updatedList = [...list];
        if (updatedList.length % 3 === 2) {
            updatedList.push({ id: list.length + 1, image: '', });
        }
        return updatedList;
    }
    const updatedMooStamps = editStampList(tmpMooStamps);
    const updateGiftStamps = editStampList(tmpGiftStamps);

    const renderItem = ({ item }) => (
        <View style={{}}>
          <Image source={item.image} style={eventModalStyles.image} />
        </View>
      );
    const renderBoughtItem = ( key ) => {
        if (key === 'ice') {
            if (autumnEventBoughtIce) return true;
            else return false;
        } else if (key === 'chicken_1') {
            if (autumnEventBoughtChicken1) return true;
            else return false;
        } else if (key === 'chicken_2') {
            if (autumnEventBoughtChicken2) return true;
            else return false;
        }
    }
    
    useEffect(() => {
        AsyncStorage.getItem('@UserInfo:notificationAllow',(err,result)=>{
            if(JSON.parse(String(result))) setIsNotificationEnabled(true);
            else setIsNotificationEnabled(false);
            console.log('notificationallowed',result);
        });
        AsyncStorage.getItem('@UserInfo:AutumnEventCoin').then((value) => {
            setAutumnEventCoin(value);
        })
        AsyncStorage.getItem('@UserInfo:AutumnEventLevel').then((value) => {
            setAutumnEventLevel(Number(value));
        })
        AsyncStorage.getItem('@UserInfo:AutumnEventBoughtIce').then((value) => {
            if(value==='true'){
                setAutumnEventBoughtIce(true);
            }
        })
        AsyncStorage.getItem('@UserInfo:AutumnEventBoughtChicken1').then((value) => {
            if(value==='true'){
                setAutumnEventBoughtChicken1(true);
            }
        })
        AsyncStorage.getItem('@UserInfo:AutumnEventBoughtChicken2').then((value) => {
            if(value==='true'){
                setAutumnEventBoughtChicken2(true);
            }
        })
        getAmount('chicken_1').then((value)=>{
            console.log(value);
        });
      },[]);

  (async () => {
    await AsyncStorage.getItem('@UserInfo:notificationAllow',(err,result)=>{
        if(JSON.parse(String(result))) setIsNotificationEnabled(true);
        else setIsNotificationEnabled(false);
        console.log('notificationallowed',result);
    });
    await AsyncStorage.getItem('@UserInfo:AutumnEventCoin').then((value) => {
        setAutumnEventCoin(value);
    })
    AsyncStorage.getItem('@UserInfo:AutumnEventLevel').then((value) => {
        setAutumnEventLevel(Number(value));
    })
  })();

    return (
      <View style={{backgroundColor:'#FFFFFF',flex:1}}>
        <StatusBar
            backgroundColor="#FFFFFF"
            barStyle='dark-content'
        />
        <ScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        >
                {/* 프로필 섹션 */}
                <View style={tabStyles.title}>
                    <Text style={tabStyles.titleText}>프로필</Text>
                </View>
                <ChangeProfile/>
                <TitleDivider/>
                
                {/* 앱 설정 섹션 */}
                <View style={tabStyles.title}>
                  <Text style={tabStyles.titleText}>앱 설정</Text>
                </View>

                <TouchableOpacity disabled={true}>
                    <View style={[tabStyles.content, {flexDirection: 'row',justifyContent: 'space-between'}]}>
                        <Text style={tabStyles.contentText}>알림</Text>
                        <SwitchToggle
                        switchOn={isNotificationEnabled}
                        onPress={async () => {
                            if (Platform.OS === 'android') {
                                if(Platform.Version<33){
                                    if(!isNotificationEnabled){
                                        AsyncStorage.setItem('@UserInfo:notificationAllow','true');
                                        setIsNotificationEnabled(!isNotificationEnabled);
                                        repository.getAllNotifications().sort(sortNotificationByTime).map((notification)=>{
                                            console.log(4,notification.time);
                                            const notificationTime = new Date();
                                            const [hour,minute]=notification.time.split(':');
                                            notificationTime.setHours(Number(hour));
                                            notificationTime.setMinutes(Number(minute));
                                            notificationTime.setSeconds(0);
                                            if(notificationTime.getTime()<=(new Date(Date.now())).getTime()) notificationTime.setDate(notificationTime.getDate()+1);
                                            PushNotification.localNotificationSchedule({
                                                channelId: "MoodMemo_ID",
                                                smallIcon: "ic_notification",
                                                message: generateNotificationMessage(notificationTime),
                                                date: new Date(notificationTime), // 1 second from now
                                                visibility: "public",
                                                priority: "high",
                                                playSound: false,
                                                allowWhileIdle: true,
                                                id: hour+minute,
                                                repeatType: "day",
                                                repeatTime: "1" //하루 단위로 반복
                                            });
                                        });
                                        amplitude.notiONtoOFF();
                                        PushNotification.getScheduledLocalNotifications((result:any)=>{
                                            console.log(result);
                                        });
                                    }
                                    else{
                                        PushNotification.getScheduledLocalNotifications((result:any)=>{
                                            console.log(result);
                                        });
                                        AsyncStorage.setItem('@UserInfo:notificationAllow','false');
                                        setIsNotificationEnabled(!isNotificationEnabled);
                                        amplitude.notiONtoOFF();
                                        PushNotification.cancelAllLocalNotifications();
                                    }
                                }
                                else{
                                    try {
                                        const granted = await PermissionsAndroid.request(
                                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                                        );
                                        if(granted==='granted'){
                                            console.log(PermissionsAndroid.RESULTS.GRANTED);
                                            if(!isNotificationEnabled){
                                                AsyncStorage.setItem('@UserInfo:notificationAllow','true');
                                                setIsNotificationEnabled(!isNotificationEnabled);
                                                repository.getAllNotifications().sort(sortNotificationByTime).map((notification)=>{
                                                    console.log(4,notification.time);
                                                    const notificationTime = new Date();
                                                    const [hour,minute]=notification.time.split(':');
                                                    notificationTime.setHours(Number(hour));
                                                    notificationTime.setMinutes(Number(minute));
                                                    notificationTime.setSeconds(0);
                                                    if(notificationTime.getTime()<=(new Date(Date.now())).getTime()) notificationTime.setDate(notificationTime.getDate()+1);
                                                    PushNotification.localNotificationSchedule({
                                                        channelId: "MoodMemo_ID",
                                                        smallIcon: "ic_notification",
                                                        message: generateNotificationMessage(notificationTime),
                                                        date: new Date(notificationTime), // 1 second from now
                                                        visibility: "public",
                                                        priority: "high",
                                                        playSound: false,
                                                        allowWhileIdle: true,
                                                        id: hour+minute,
                                                        repeatType: "day",
                                                        repeatTime: "1" //하루 단위로 반복
                                                    });
                                                });
                                                amplitude.notiONtoOFF();
                                                PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                    console.log(result);
                                                });
                                            }
                                            else{
                                                PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                    console.log(result);
                                                });
                                                AsyncStorage.setItem('@UserInfo:notificationAllow','false');
                                                setIsNotificationEnabled(!isNotificationEnabled);
                                                amplitude.notiONtoOFF();
                                                PushNotification.cancelAllLocalNotifications();
                                            }
                                        }
                                        else if(granted==='never_ask_again'){
                                            amplitude.notiONwhenPermissionDenied();
                                            setIsNotificationModalVisible(!isNotificationModalVisible);
                                            console.log(1,'denied');
                                        }
                                    } catch (error) {
                                        console.warn(error);
                                    }
                                }
                            }
                            else{
                                try {
                                    await PushNotification.checkPermissions((result:any)=>{
                                        console.log(result);
                                        console.log(result.notificationCenter);
                                        if(result.notificationCenter){
                                            if(!isNotificationEnabled){
                                                AsyncStorage.setItem('@UserInfo:notificationAllow','true');
                                                setIsNotificationEnabled(!isNotificationEnabled);
                                                repository.getAllNotifications().sort(sortNotificationByTime).map((notification)=>{
                                                    console.log(4,notification.time);
                                                    const notificationTime = new Date();
                                                    const [hour,minute]=notification.time.split(':');
                                                    notificationTime.setHours(Number(hour));
                                                    notificationTime.setMinutes(Number(minute));
                                                    notificationTime.setSeconds(0);
                                                    if(notificationTime.getTime()<=(new Date(Date.now())).getTime()) notificationTime.setDate(notificationTime.getDate()+1);
                                                    PushNotification.localNotificationSchedule({
                                                        channelId: "MoodMemo_ID",
                                                        smallIcon: "ic_notification",
                                                        message: generateNotificationMessage(notificationTime),
                                                        date: new Date(notificationTime), // 1 second from now
                                                        visibility: "public",
                                                        playSound: false,
                                                        id: hour+minute,
                                                        repeatType: "day",
                                                        repeatTime: "1" //하루 단위로 반복
                                                    });
                                                });
                                                amplitude.notiONtoOFF();
                                                PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                    console.log(result);
                                                });
                                            }
                                            else{
                                                PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                    console.log(result);
                                                });
                                                AsyncStorage.setItem('@UserInfo:notificationAllow','false');
                                                setIsNotificationEnabled(!isNotificationEnabled);
                                                amplitude.notiONtoOFF();
                                                PushNotification.cancelAllLocalNotifications();
                                            }
                                        }
                                        else{
                                            amplitude.notiONwhenPermissionDenied();
                                            setIsNotificationModalVisible(!isNotificationModalVisible);
                                            console.log(1,'denied');
                                        }
                                    })
                                } catch (error) {
                                    console.warn(error);
                                }
                            }
                        }}
                        containerStyle={{
                            marginTop: 2,
                            width: 45,  
                            height: 25,
                            borderRadius: 25,
                            padding: 3,
                        }}
                        circleStyle={{
                            width: 20,
                            height: 20,
                            borderRadius: 20,
                        }}
                        circleColorOff='#FFFFFF'
                        circleColorOn='#FFFFFF'
                        backgroundColorOn='#72D193'
                        backgroundColorOff='#78788029'
                        />
                    </View>
                    <Modal isVisible={isNotificationModalVisible}
                        animationIn={"fadeIn"}
                        animationInTiming={200}
                        animationOut={"fadeOut"}
                        animationOutTiming={200}
                        onBackdropPress={() => {
                            setIsNotificationModalVisible(!isNotificationModalVisible);
                        }}
                        backdropColor='#CCCCCC'//'#FAFAFA'
                        backdropOpacity={0.8}
                        style={{
                            alignItems:'center'
                        }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'80%',
                            height:'20%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                alignItems:'center',
                                }}>
                                    <Text style={{fontSize: 19, color:"#495057"}}>알림을 받으시려면 기기 설정에서</Text>
                                    <Text style={{fontSize: 19, color:"#495057"}}>알림 권한을 허용해주세요!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <SubtitleDivider/>

                <TouchableOpacity disabled={!isNotificationEnabled}
                onPress={async () => {
                    setIsNotificationListModalVisible(!isNotificationListModalVisible);
                    amplitude.intoNotiList();
                    }}>
                    <View style={[tabStyles.content, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                        <Text style={{fontSize: 19, color:isNotificationEnabled ? "#495057" : "#CCCCCC"}}>알림 목록</Text>
                    </View>
                    <Modal isVisible={isNotificationListModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.outToSettingFromNotiList();
                        setIsNotificationListModalVisible(!isNotificationListModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'90%',
                            height:'60%',
                            //justifyContent:'center',
                            //alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                paddingTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                                }}>
                                    <Text style={{fontSize: 19}}>알림 목록</Text>
                            </View>
                            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                            <ScrollView
                            alwaysBounceHorizontal={false}
                            alwaysBounceVertical={false}
                            bounces={false}
                            overScrollMode="never"
                            showsVerticalScrollIndicator={true}
                            >
                                <NotificationAdd notificationAdded={isNotificationAdded} checkNotificationAdded={setIsNotificationAdded}/>
                                {
                                    repository.getAllNotifications().sort(sortNotificationByTime).map((button)=>(
                                        <NotificationView key={button.id} id={button.id} time={button.time} timeChangedProp={isNotificationTimeChanged} checkTimeChanged={setIsNotificationTimeChanged}/>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <TitleDivider/>

                {/* 이벤트 섹션 */}
                <View style={tabStyles.title}>
                  <Text style={tabStyles.titleText}>가을 이벤트</Text>
                </View>
                    <View style={[tabStyles.content,{flexDirection:'row',justifyContent:'space-between'}]}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={tabStyles.contentText}>레벨</Text>
                            <TouchableOpacity onPress={() => {
                            amplitude.test1();//이벤트 현황 켬
                            setIsEventLevelModalVisible(!isEventLevelModalVisible);
                            }}>
                            <MCIcons name="information-outline" color={'#AAAAAA'} size={22} style={{marginLeft:5,marginTop:2}}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color:'#FFCC4D',fontSize:19,marginLeft:10}}>Lv. {autumnEventLevel}</Text>
                    </View>
                    <Modal isVisible={isEventLevelModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.test1();//이벤트 현황 끔
                        setIsEventLevelModalVisible(!isEventLevelModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:340,
                            height:320,
                            borderRadius:10
                        }}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:15, marginLeft:20, marginRight:20, width:'90%'}}>
                                <Text style={{fontSize: 18, color: '#212429', marginLeft:5, marginTop:5}}>레벨 안내</Text>
                                <TouchableOpacity onPress={() => {
                                    setIsEventLevelModalVisible(!isEventLevelModalVisible);
                                    amplitude.test1();//이벤트 설명 끔
                                }}>
                                    <MCIcons name='close' color={'#DBDBDB'} size={27} style={{marginTop:4}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                alignSelf:'center',
                                width:290,
                                borderBottomWidth:1.5,
                                borderBottomColor:'#FFCC4D',
                                borderStyle:'solid',
                                marginTop:30
                            }}>
                                <View style={{
                                flexDirection:'row',
                                justifyContent:'space-between',
                                width:260,
                                alignSelf:'center',}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between',width:110,marginBottom:15}}>
                                    <Text style={{color:'#212429',fontSize:14}}>Lv. 1</Text>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                                        <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>1~2개</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row', justifyContent:'space-between',width:110,marginBottom:15}}>
                                    <Text style={{color:'#212429',fontSize:14}}>Lv. 2</Text>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                                        <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>1~3개</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between',width:260, alignSelf:'center'}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between',width:110,marginBottom:15}}>
                                    <Text style={{color:'#212429',fontSize:14}}>Lv. 3</Text>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                                        <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>2~4개</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row', justifyContent:'space-between',width:110,marginBottom:15}}>
                                    <Text style={{color:'#212429',fontSize:14}}>Lv. 4</Text>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                                        <Text style={{color:'#FFCC4D',fontSize:14,marginLeft:10}}>3~5개</Text>
                                    </View>
                                </View>
                            </View>
                            </View>
                            <Text style={{color:'#212429',fontSize:14, marginLeft:25}}>규칙 안내</Text>
                            <Text style={{color:'#212429',fontSize:14, marginLeft:25}}>- 스탬프 생성 시 은행잎을 랜덤하게 획득 가능합니다.</Text>
                            <Text style={{color:'#212429',fontSize:14, marginLeft:25}}>- 획득 가능 은행잎의 개수는 레벨에 따라 상이합니다.</Text>
                            <Text style={{color:'#212429',fontSize:14, marginLeft:25}}>레벨 변화</Text>
                            <Text style={{color:'#212429',fontSize:14, marginLeft:25}}>- 날짜를 연속해 스탬프를 남기면 레벨 +1</Text>
                            <Text style={{color:'#212429',fontSize:14, marginLeft:25}}>- 하루 동안 스탬프를 남기지 않으면 레벨 -1</Text>
                        </View>
                    </Modal>

                <SubtitleDivider/>
                    <View style={[tabStyles.content,{flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={tabStyles.contentText}>은행잎 현황</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Image source={require('./assets/autumn_event_coin.png')} style={{width:25,height:25*98/102}}/>
                            <Text style={{color:'#FFCC4D',fontSize:19,marginLeft:10}}>{autumnEventCoin}개</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                    amplitude.intoServiceCenter();
                    setIsShopModalVisible(!isShopModalVisible);
                    }}>
                        <View style={{backgroundColor:'#FFCC4D', width:350, height:55, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:10, alignSelf:'center'}}>
                            <MCIcons name='cart' color={'#FFFFFF'} size={27}/>
                            <Text style={{color:'#FFFFFF',fontSize:19, marginLeft:8}}>은행잎 상점</Text>
                        </View>
                    </TouchableOpacity>
                    <Modal isVisible={isShopModalVisible}
                        animationIn={"fadeIn"}
                        animationInTiming={200}
                        animationOut={"fadeOut"}
                        animationOutTiming={200}
                        onBackdropPress={() => {}}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{ alignItems:'center', }}>
                        
                        <View style={eventModalStyles.container}>
                            <ScrollView contentContainerStyle={{alignItems: 'center', gap: 20,}}>

                                <View style={{ width: 290, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                        <MCIcons name='cart' color={'#FFCC4D'} size={27}/>  
                                        <Text style={{fontSize: 16, color: '#FFCC4D',}}>은행잎 상점</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {setIsShopModalVisible(!isShopModalVisible); amplitude.test1();}}>
                                        <AntDesign name='close' color={'#DBDBDB'} size={27}/>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{width: 290, alignItems: 'flex-end'}}>
                                    <View style={{backgroundColor: '#FCF5E3', flexDirection:'row',justifyContent:'space-between', gap: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6}}>
                                        <Text style={{fontSize: 16, color: '#212429',}}>은행잎 현황</Text>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                                            <Text style={{color:'#FFCC4D',fontSize:16,marginLeft:10}}>{autumnEventCoin}개</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={eventModalStyles.threeByThreeContainer}>
                                    {updateGiftStamps.map((gift) => (
                                        <TouchableOpacity key={gift.id} style={eventModalStyles.btnContainer} 
                                        // onPress={() => {handleButtonPress(stampButton)}} 어떤 액션일지 몰라서
                                        // onPress={() => {console.log(getAmount('ice'))}}
                                        >
                                            {/* {renderItem({item: gift})} */}
                                            {gift.icon}
                                            {/* <MCIcons name='cart' color={'black'} size={27}/> */}
                                            <Text style={eventModalStyles.text}>{gift.name}</Text> 
                                            <View style={{flexDirection: 'row', gap: 5}}>
                                                <Image source={require('./assets/autumn_event_coin.png')} style={{width:20,height:20*98/102}}/>
                                                <Text style={[{color: '#FFCC4D', fontSize: 15,},
                                                                renderBoughtItem(gift.key) && {color: '#CCCCCC',} // 구매한 아이템은 회색으로
                                                                ]}>5개</Text>    
                                                {/* <Text style={{}}>{gift.key}개</Text>     */}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={{backgroundColor:'#FFCC4D', width:290, height:44, flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:6, alignSelf:'center'}}>
                                    <Text style={{color:'#FFFFFF',fontSize:19, marginLeft:8}}>구매하기</Text>
                                </View>

                            </ScrollView>
                        </View>
                    </Modal>
                <SubtitleDivider/>

                {/* 무드메모 섹션 */}
                <View style={tabStyles.title}>
                  <Text style={tabStyles.titleText}>무드메모</Text>
                </View>
                
                <TouchableOpacity disabled={true}>
                    <View style={[tabStyles.content, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                        <Text style={tabStyles.contentText}>버전</Text>
                        <Text style={{fontSize: 19, color:"#DBDBDB"}}>ver {VersionCheck.getCurrentVersion()}</Text>
                    </View>
                </TouchableOpacity>
                <SubtitleDivider/>

                <TouchableOpacity onPress={() => {
                    amplitude.intoServiceCenter();
                    setIsReportModalVisible(!isReportModalVisible);
                    }}>
                    <View style={tabStyles.content}>
                        <Text style={tabStyles.contentText}>고객센터/의견 보내기/오류 제보</Text>
                    </View>
                    <Modal isVisible={isReportModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.outToSettingFromServiceCenter();
                        setIsReportModalVisible(!isReportModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:330,
                            height:300,
                            // justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                // justifyContent:'center',
                                alignItems:'center',
                                paddingHorizontal: 20,
                                justifyContent: 'space-between', // 상하로 딱 붙이기
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057", paddingVertical: 10,marginTop:10,marginBottom:10}}>오류/의견은 언제나 환영이라무! 🥬</Text>
                                    {/* <Text style={{fontSize: 14, color:"#495057"}}>무가 귀기울여 듣겠다무!</Text> */}
                                    <View style={{ flexDirection: 'row', flex: 1,}}>
                                        <View style={styles.memoContent}>
                                            <TextInput
                                                style={{ fontSize: 14, color:"#000000",}}
                                                placeholder="운영진에게 메시지 남기기"
                                                multiline={true}
                                                // maxLength={500}
                                                onChangeText={handleMemoChange}
                                                value={memo}
                                                // numberOfLines={numberOfLines}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingVertical: 13,}}>
                                        <TouchableOpacity style={styles.confirmBtn} onPress={() => {sentryUserFeedback();}}>
                                            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600',}}>확인</Text>
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <SubtitleDivider/>
                
                {Platform.OS==='android' ? (<>
                    <TouchableOpacity onPress={() => {
                        amplitude.intoCoffee();
                        setIsCoffeeModalVisible(!isCoffeeModalVisible);
                        }}>
                        <View style={tabStyles.content}>
                            <Text style={tabStyles.contentText}>개발자에게 커피 사주기</Text>
                        </View>
                        <Modal isVisible={isCoffeeModalVisible}
                        animationIn={"fadeIn"}
                        animationInTiming={200}
                        animationOut={"fadeOut"}
                        animationOutTiming={200}
                        onBackdropPress={() => {
                            amplitude.outToSettingFromCoffee();
                            setIsCoffeeModalVisible(!isCoffeeModalVisible);
                        }}
                        backdropColor='#CCCCCC'//'#FAFAFA'
                        backdropOpacity={0.8}
                        style={{
                            alignItems:'center'
                        }}>
                            <View style={{
                                backgroundColor:"#FFFAF4",
                                width:'80%',
                                height:'30%',
                                justifyContent:'center',
                                alignItems:'center',
                                borderRadius:10
                            }}>
                                <View style={{
                                    justifyContent:'center',
                                    alignItems:'center',
                                    }}>
                                        <Text style={{fontSize: 19, color:"#495057", paddingBottom: 10,}}>카카오뱅크 이O하</Text>
                                        <Text style={{fontSize: 19, color:"#495057", paddingBottom: 10,}}>3333-27-9623079</Text>
                                        <Text style={{fontSize: 19, color:"#495057", }}>감사합니다!</Text>
                                </View>
                            </View>
                        </Modal>
                    </TouchableOpacity>
                    <SubtitleDivider/>
                </>) : (<></>)}

                <TouchableOpacity onPress={() => {
                    amplitude.clickReset(); //데이터 초기화하기 모달 켬
                    setIsClearDataModalVisible(!isClearDataModalVisible);
                    }}>
                    <View style={tabStyles.content}>
                        <Text style={tabStyles.contentText}>모든 데이터 초기화하기</Text>
                    </View>
                    <Modal isVisible={isClearDataModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.cancelResetWithBackDrop(); //데이터 초기화하기 모달 끔
                        setIsClearDataModalVisible(!isClearDataModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'85%',
                            height:'40%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                justifyContent:'center',
                                alignItems:'center',
                                marginTop:20,
                                }}>
                                    <Text style={{fontSize: 19, color:"#495057", paddingBottom: 10,}}>작성한 일기, 스탬프를 포함한</Text>
                                    <Text style={{fontSize: 19, color:"#495057", paddingBottom: 10,}}>모든 데이터를 초기화합니다.</Text>
                                    <Text style={{fontSize: 19, color:"#495057", paddingBottom: 10,}}>초기화한 모든 데이터는</Text>
                                    <Text style={{fontSize: 19, color:"#DD0000", paddingBottom: 10,}}>다시 복구할 수 없습니다.</Text>
                                    <Text style={{fontSize: 19, color:"#495057", paddingBottom: 10,}}>초기화하시겠습니까?</Text>
                            </View>
                            <View style={{
                                paddingHorizontal: "5%",
                                marginTop:30,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                                }}>
                                <TouchableOpacity onPress={async ()=>{
                                    amplitude.cancelResetBtn(); //데이터 초기화하기 모달 끔
                                    setIsClearDataModalVisible(!isClearDataModalVisible);
                                    }}
                                    style={styles.cancelBtn}>
                                    <Text style={{fontSize: 19}}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={async ()=>{
                                    amplitude.confirmResetBtn(); //데이터 초기화함
                                    await clearAsyncStorage();
                                    realm.write(()=>{
                                        realm.deleteAll();
                                    })
                                    RNRestart.restart();
                                }}
                                style={styles.clearBtn}>
                                    <Text style={{fontSize: 19}}>초기화</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                {/* <TitleDivider/> */}

                

        </ScrollView>
      </View>
    );
}


const tabStyles = StyleSheet.create({
    title: {
        paddingHorizontal: 20,
        paddingBottom: 5,
        paddingTop: 20,
    },
    titleText: {
        fontSize:16,color:'#999999'
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 15,
    },
    contentText: {
        fontSize: 19, color:"#495057"
    }
});
const eventModalStyles = StyleSheet.create({
    container: {
        backgroundColor:"#fff",
        width:330,
        alignItems: 'center',
        borderRadius: 12,
        paddingTop: 15,
        paddingBottom: 20,
        gap: 20
    },
    threeByThreeContainer: {
        width: 280, 
        alignContent: 'center',
        flexDirection: 'row', // 버튼들을 가로로 배열
        flexWrap: 'wrap', // 가로로 공간이 부족하면 다음 줄로 넘어감
        justifyContent: 'space-between', // 버튼들 사이의 간격을 동일하게 분배
        gap: 10,
    },
    btnContainer: {
        width: 133,
        alignItems: 'center',
        borderColor: '#FFCC4D',
        borderWidth: 1,
        borderRadius: 15,
        paddingTop: 20,
        paddingBottom: 10,
        gap: 10,
        borderStyle: 'dashed',
    },
    image: {
        width: 80,
        height: (85 * 80) / 80 ,
    },
    text: {
        textAlign: 'center',
        color: '#212429',
        fontSize: 14,
    }
});

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    view: {
      position: 'relative',
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      flex:1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
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
      fontSize: 16,
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
      cancelBtn: {
        alignSelf: 'center',
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#344054', 
        padding: 7,
        marginBottom: 16,
        backgroundColor: 'white', 
        borderColor: '#72D193',
        borderWidth:1,
        borderRadius: 8,
        flex: 1,
        marginHorizontal:20,
      },
      clearBtn: {
        alignSelf: 'center',
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#FF0000', 
        padding: 7,
        marginBottom: 16,
        backgroundColor: 'white', 
        borderColor: '#FF0000',
        borderWidth:1,
        borderRadius: 8,
        flex: 1,
        marginHorizontal:20,
      },
  });

export default Settings;