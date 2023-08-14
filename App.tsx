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
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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

import Main from './Main'
import { create } from 'react-test-renderer';

//import {requestUserPermission, notificationListener} from "./src/utils/PushNotification";

import * as Sentry from '@sentry/react-native';

Sentry.init({ 
  dsn: 'https://3554b53489972dd0d1159d97e9cc6eb7@o4505669151555584.ingest.sentry.io/4505669208375296', 
});


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

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  //initiailze(); //처음에는 주석 해제하고 실행해서 초기화 한 다음에 바로 껐다가, 주석 처리하고 다시 실행합시다!

  Sentry.captureMessage('앱 시작');

  AsyncStorage.getItem('@UserInfo:isRegistered',(err,result)=>{
      if(result!==null) 
      {
        setIsRegistered(true);
      }
  });

  (async () => { 
    // Do something before delay
    await new Promise(f => setTimeout(f, 300));
    SplashScreen.hide();
    // Do something after
    }
  )();

  if (isRegistered) {
    console.log("isRegistered: " + isRegistered);
    return (
      <SafeAreaView style={styles.container}>
        <Main/>
      </SafeAreaView>
    );
  }
  else
  {
    AsyncStorage.setItem('@UserInfo:notificationAllow','false');
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