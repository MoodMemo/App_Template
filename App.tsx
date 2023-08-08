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

import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";

import Main from './Main'
import { create } from 'react-test-renderer';

//import {requestUserPermission, notificationListener} from "./src/utils/PushNotification";

const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  const [isRegistered, setIsRegistered] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  AsyncStorage.removeItem('@UserInfo:isRegistered'); //-> 처음부터 돌리고 싶으면 주석 해제하고 빌드

  
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

export default App;