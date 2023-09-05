/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
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

import Main from './Main'
import { create } from 'react-test-renderer';

import {default as Text} from "./CustomText"
//import {requestUserPermission, notificationListener} from "./src/utils/PushNotification";

import * as Sentry from '@sentry/react-native';
import * as amplitude from './AmplitudeAPI';

const Stack = createNativeStackNavigator();

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

  //initiailze(); //처음에는 주석 해제하고 실행해서 초기화 한 다음에 바로 껐다가, 주석 처리하고 다시 실행합시다!

  AsyncStorage.getItem('@UserInfo:isRegistered',(err,result)=>{
      if(result!==null) 
      {
        setIsRegistered(true);
      }
  });

  (async () => { 
    // Do something before delay
    await new Promise(f => setTimeout(f, 600));
    await AppVersionCheck();
    SplashScreen.hide();
    // Do something after
    }
  )();

  amplitude.beginSession(); // 앱 시작

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
                Linking.openURL('a');
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
  else if (isRegistered) {
    repository.updatePushedStampCount(); // db 4->5 migration
    console.log("isRegistered: " + isRegistered);
    return (
      <SafeAreaView style={styles.container}>
        <Main/>
      </SafeAreaView>
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
  },
});

// export default App;
export default Sentry.wrap(App);