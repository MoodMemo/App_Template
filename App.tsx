/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';

import AnimatedViewBirthday from './AnimatedViewBirthday';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';

import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import VersionCheck from 'react-native-version-check';

import codePush , {CodePushOptions} from "react-native-code-push";

import * as Progress from 'react-native-progress';

import { useSafeAreaInsets, useSafeAreaFrame } from 'react-native-safe-area-context';

import Main from './Main'
import { create } from 'react-test-renderer';

import {default as Text} from "./CustomText"
//import {requestUserPermission, notificationListener} from "./src/utils/PushNotification";

import * as Sentry from '@sentry/react-native';
import * as amplitude from './AmplitudeAPI';

const getToken = async() => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  if (enabled) {
    const token = await messaging().getToken();
    console.log('fcm token :',token);
    console.log('Authorization status:', authStatus);
  }
}

function getRandomInt(min:any, max:any) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const Stack = createNativeStackNavigator();

const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
};

/**
 * AsyncStorage, Realm 초기화
 */
const initiailze = () => {
  AsyncStorage.removeItem('@UserInfo:isRegistered');

  const deleteAll = () => {
    realm.deleteAll(); // 얘는 웬만하면 사용 안하는걸로 ..! 여기만 예외적으로 사용할 가능성이 있슴다
    console.log("delete all finished");
  }
  realm.write(() => {
    deleteAll();
  });
}

function App(): JSX.Element {

  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [isCodePushUpdateNeeded, setIsCodePushUpdateNeeded] = useState(false);
  const [showCodePushUpdate,setShowCodePushUpdate]=useState(false);
  const [progress,setProgress] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const AppVersionCheck = async () => {
    let CurrentVersion = VersionCheck.getCurrentVersion();
    let LatestVersion = await VersionCheck.getLatestVersion();
    VersionCheck.needUpdate({
      currentVersion: CurrentVersion,
      latestVersion: LatestVersion,
    }).then((res: any) => {
      if (res.isNeeded) {
        setIsUpdateNeeded(true);
      }
    });
  };

  // const setIsCodePushUpdateNeededAsync = async (value:any) => {
  //   setIsCodePushUpdateNeeded(value);
  //   await new Promise(f => setTimeout(f, 200));
  //   console.log('async code push',isCodePushUpdateNeeded);
  // }

  const codePushVersionCheck = async () => {
    try{
      const update = await codePush.checkForUpdate();
      console.log('app started',update);
      if(update){
        setIsCodePushUpdateNeeded(true);
        amplitude.codePushUpdating();
        return true;
      }
      else{
        console.log('no update');
        return false;
      }
    }
    catch(error){
      console.log('codepush error');
      console.error(error);
      return false;
    }
  }

  const sortNotificationByTime = (a:any,b:any) => {
    if(a.time > b.time) return 1;
    else if(a.time < b.time) return -1;
    else return 0;
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

  useEffect(()=>{AsyncStorage.getItem('@UserInfo:isRegistered',async(err,result)=>{
    if(result!==null) 
    {
      setIsRegistered(true);
    }
    else{
      AsyncStorage.setItem('@UserInfo:firstStamp','true');
    }
});

const reloadNotification = async () => {
  AsyncStorage.getItem('@UserInfo:notificationAllow',async(err,result)=>{
    if(result==='true'){
      await PushNotification.cancelAllLocalNotifications();
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
            priority: "high",
            allowWhileIdle: true,
            id: hour+minute,
            repeatType: "day",
            repeatTime: "1" //하루 단위로 반복
        });
    });
    }
  })
}

(async () => { 
  // Do something before delay
  await new Promise(f => setTimeout(f, 600));
  await AppVersionCheck();
  //await getToken();
  //setShowCodePushUpdate(true);
  const codePushUpdateAvailable = await codePushVersionCheck();
  // await reloadNotification();
  SplashScreen.hide();
  // Do something after
  console.log('codepush check :',codePushUpdateAvailable);
  if(codePushUpdateAvailable){
    console.log('codepush updating now');
    codePush.sync({
      installMode:codePush.InstallMode.IMMEDIATE,
      mandatoryInstallMode:codePush.InstallMode.IMMEDIATE
    },
    (status) => {
      switch (status) {
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              // Show "downloading" modal
              setShowCodePushUpdate(true);
              break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
              // Hide "downloading" modal
              //setShowCodePushUpdate(false);
              break;
      }
    },
    ({ receivedBytes, totalBytes, }) => {
      /* Update download modal progress */
      setProgress(receivedBytes/totalBytes);
    })
  }
  }
)();
amplitude.beginSession();},[]);
  //initiailze(); //처음에는 주석 해제하고 실행해서 초기화 한 다음에 바로 껐다가, 주석 처리하고 다시 실행합시다!

  

  if (isUpdateNeeded) {
    console.log('update needed');
    return (
      <SafeAreaView style={{backgroundColor:'#55B275',flex:1,justifyContent:'center',alignItems:'center',}}>
        <View style={{
          backgroundColor:"#FFFAF4",
          width:330,
          height:280,
          justifyContent:'center',
          alignItems:'center',
          borderRadius:15
        }}>
          <Image 
                source={require('./assets/colorMooMini.png')}
                style={{width:74*0.8,height:78*0.8,position: 'relative', overflow: 'hidden',marginBottom:20,marginTop:10}}></Image>
          <Text style={{fontSize:18,fontWeight:'bold',color:'#101828'}}>업데이트가 필요하다<Text style={{fontSize:18,fontWeight:'bold',color:'#FFCC4D'}}>무</Text></Text>
          <Text style={{color:'#475467',marginTop:10}}>더 새로워진 무드메모 앱으로</Text>
          <Text style={{color:'#475467',marginBottom:24}}>업데이트해달라무 !!</Text>
          <View style={{flexDirection: 'row',
                        justifyContent: 'space-between',
                        width:'90%'}}>
            {/* <TouchableOpacity onPress={()=>{
              BackHandler.exitApp();
            }}>
              <View style={{
                backgroundColor:"#FFFFFF",
                width:140,
                height:44,
                justifyContent:'center',
                alignItems:'center',
                borderRadius:8,
                borderColor:'#72D193',
                borderWidth:1,
              }}>
                <Text style={{fontSize:16,fontWeight:'bold',color:'#72D193'}}>앱 종료</Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={()=>{
              if (Platform.OS == "android") {
                Linking.openURL('https://play.google.com/store/apps/details?id=com.moodmemo');
              } else {
                Linking.openURL('https://apps.apple.com/kr/app/%EB%AC%B4%EB%93%9C%EB%A9%94%EB%AA%A8/id6467786547');
              }
            }}>
              <View style={{
                  backgroundColor:"#72D193",
                  width:300,
                  height:44,
                  justifyContent:'center',
                  alignItems:'center',
                  borderRadius:8,
                  borderColor:'#72D193',
                  borderWidth:1,
              }}>
                <Text style={{fontSize:16,fontWeight:'bold',color:'#FFFFFF'}}>업데이트 하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
  else if (showCodePushUpdate) {
    return (
    <SafeAreaView style={{backgroundColor:'#75D295',flex:1,justifyContent:'center',alignItems:'center',}}>
      <Image 
                source={require('./assets/analyze_0904.png')}
                style={{width:1065*0.07,height:1317*0.07,position: 'relative', overflow: 'hidden',marginBottom:20,marginTop:10}}></Image>
      <Text style={{fontSize:18,fontWeight:'bold',color:'#FFFFFF'}}>업데이트 중이다<Text style={{fontSize:18,fontWeight:'bold',color:'#FFF3E3'}}>무</Text>...</Text>
      <Text style={{color:'#475467',marginTop:10}}>무드메모의 필수 요소들을</Text>
      <Text style={{color:'#475467',marginBottom:50}}>열심히 가져오고 있다무!!</Text>
      <Progress.Bar
        progress={progress}
        borderColor='#FFF3E3'
        color='#FFF3E3'
        width={200}
      />
    </SafeAreaView>);
  }
  else if (isRegistered) {
    repository.updatePushedStampCount(); // db 4->5 migration
    console.log("isRegistered: " + isRegistered);
    return (
      // <SafeAreaView style={styles.container}>
      //   <Main/>
      // </SafeAreaView>
      <Main/>
    );
  }
  else
  {
    return (
      <SafeAreaView style={styles.container}>
        <AnimatedViewBirthday/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor:"#FFFFFF",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    // backgroundColor:'#FFFAF4'
  },
});

// export default App;
export default codePush(codePushOptions)(Sentry.wrap(App));