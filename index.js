/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Amplify} from 'aws-amplify';
import config from './src/aws-exports';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import * as amplitude from './AmplitudeAPI';
import AmplitudeInit from './AmplitudeAPI';
import * as Sentry from '@sentry/react-native';

Amplify.configure(config);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
messaging().onMessage(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
/*
messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the kill state!', remoteMessage);
});
*/

AmplitudeInit();

PushNotification.configure({

  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  //알림을 클릭하면 실행됨
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    amplitude.test1(); //알림 클릭 앰플리튜드
  },

  popInitialNotification: true,
  //requestPermissions: Platform.OS === 'ios'
  requestPermissions: true
  });

PushNotification.createChannel(
  {
    channelId: "MoodMemo_ID",
    channelName: "MoodMemo"
  }
)

Sentry.init({ 
  dsn: 'https://3554b53489972dd0d1159d97e9cc6eb7@o4505669151555584.ingest.sentry.io/4505669208375296', 
});



Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);

