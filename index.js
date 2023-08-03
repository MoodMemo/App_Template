/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Amplify} from 'aws-amplify';
import config from './src/aws-exports';
//import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";

Amplify.configure(config);
PushNotification.configure({
    //알림을 클릭하면 실행됨
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    //requestPermissions: Platform.OS === 'ios'
    requestPermissions: true
  });


AppRegistry.registerComponent(appName, () => App);

