/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
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

import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";

import Main from './Main'
import { create } from 'react-test-renderer';

//import {requestUserPermission, notificationListener} from "./src/utils/PushNotification";

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  
  (async () => { 
    // Do something before delay
    console.log('before delay')

    await new Promise(f => setTimeout(f, 1000));

    // Do something after
    console.log('after delay')
    }
  )();

  useEffect(() => {
    scheduleNotifications();
  })

  const scheduleNotifications = () =>{
    console.log(Date.now());
    const notifications = [
      {
        channelId: 'Test_Id',
        message: 'Notification 1',
        date: new Date(Date.now() + 1000), // 1 second from now
        visibility: "public",
        playSound: false
      },
      {
        channelId: 'Test_Id',
        message: 'Notification 2',
        date: new Date(Date.now() + 5000), // 5 seconds from now
        visibility: "public",
        playSound: false
      },
      {
        channelId: 'Test_Id',
        message: 'Notification 3',
        date: new Date(Date.now() + 10000), // 10 seconds from now
        visibility: "public",
        playSound: false
      },
    ];

    notifications.forEach((notification) => {
      PushNotification.localNotificationSchedule(notification)
    })
  }

  /*
  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);
  */
  /*
  useEffect(() => {
    pushNotification();
  }, []);

  async function pushNotification() {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('token', fcmToken);
    }
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        'A new FCM message arrived in foreground mode',
        JSON.stringify(remoteMessage),
      );
    });
    return unsubscribe;
  }, []);
  */
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const check=0;

  SplashScreen.hide();
  
  if(check==0)
  {
    return (
      <SafeAreaView style={styles.container}>
        <AnimatedViewBirthday />
      </SafeAreaView>
    );
  }
  else
  {
    return (
      <SafeAreaView style={styles.container}>
        <Main birthday={null} job={null}/>
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