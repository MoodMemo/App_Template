/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Amplify} from 'aws-amplify';
import config from './src/aws-exports';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';

Amplify.configure(config);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the kill state!', remoteMessage);
});

/*
PushNotification.configure({

  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  //알림을 클릭하면 실행됨
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },

  popInitialNotification: true,
  //requestPermissions: Platform.OS === 'ios'
  requestPermissions: true
  });

PushNotification.createChannel(
  {
    channelId:"Test_Id",
    channelName:"Test_Name"
  }
)
*/
AppRegistry.registerComponent(appName, () => App);

