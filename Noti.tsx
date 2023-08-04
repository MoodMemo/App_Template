import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidStyle} from '@notifee/react-native';

async function Noti() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
	//android의 경우 기본값이 authorizaed

    if (enabled) {
      await messaging()
        .getToken()
        .then(fcmToken => {
          console.log(fcmToken); //fcm token을 활용해 특정 device에 push를 보낼 수 있다.
        })
        .catch(e => console.log('error: ', e));
    }
  }

export default Noti;