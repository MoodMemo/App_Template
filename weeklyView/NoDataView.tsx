import React, { useState, useEffect } from 'react';
import { View, Button, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, StatusBar} from 'react-native';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { deleteUserStamp } from '../src/graphql/mutations';
import Modal from "react-native-modal";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as repository from '../src/localDB/document';
import realm from '../src/localDB/document';
import * as amplitude from '../AmplitudeAPI';
import { useNavigation } from '@react-navigation/native';

import dayjs from 'dayjs';
const weekOfYear = require("dayjs/plugin/weekOfYear");
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
import "dayjs/locale/ko"; //한국어
dayjs.locale("ko");
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

import {default as Text} from "../CustomText"

import * as Sentry from '@sentry/react-native';


/** no navigate */
export const FromFutureView = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <Image 
          source={require('../assets/boring_gray_0904.png')}
          style={{ width: 124, height: (113 * 124) / 124 , marginBottom: 16}} // 비율을 유지하며 height 자동 조절
        />
        <Text style={{fontSize: 14, color: '#dbdbdb', }}>미래에서 왔냐무?</Text>
        <Text style={{fontSize: 14, color: '#dbdbdb', }}>타임머신은 없는데무!</Text>
      </View>

    </View>
  );
}
export const MooWasBoredView = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <Image 
          source={require('../assets/boring_gray_0904.png')}
          style={{ width: 124, height: (113 * 124) / 124 , marginBottom: 16}} // 비율을 유지하며 height 자동 조절
        />
        <Text style={{fontSize: 14, color: '#dbdbdb', }}>심심했다무...</Text>
      </View>

    </View>
  );
}
/** navigate */
export const TellMeYourDayView = () => {
  const navigation = useNavigation();
  const handleRecordEmotion = () => {
    // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
    // Home 뷰로 이동하도록 설정
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <Image 
          source={require('../assets/boring_gray_0904.png')}
          style={{ width: 124, height: (113 * 124) / 124 , marginBottom: 16}} // 비율을 유지하며 height 자동 조절
        />
        <Text style={{fontSize: 14, color: '#dbdbdb', }}>심심하다무...</Text>
        <Text style={{fontSize: 14, color: '#dbdbdb', }}>무슨 일이 있었는지 들려달라무!</Text>

        <TouchableOpacity style={typeChangeBtnStyles.nudgingBtn} 
          onPress={() => {handleRecordEmotion(); amplitude.pushStampInTellMeYourDayView();}}>
          <Text style={{fontSize: 14, color: '#ffffff', fontWeight: '600'}}>감정 스탬프 기록하기</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
export const PleaseOneMoreStampView = () => {
  const navigation = useNavigation();
  const handleRecordEmotion = () => {
    // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
    // Home 뷰로 이동하도록 설정
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <Image 
          source={require('../assets/emptyMoo.png')}
          style={{ width: 104, height: (107 * 104) / 104 , marginBottom: 16}} // 비율을 유지하며 height 자동 조절
        />
        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10, }}>
          <Text style={{fontSize: 14, color: '#495057', }}>스탬프 </Text>
          <Text style={{fontSize: 14, color: '#495057', fontWeight: '700'}}>한 개만 더</Text>
          <Text style={{fontSize: 14, color: '#495057', }}> 찍으면, 일기를 만들 수 있다무!</Text>
        </View>

        <TouchableOpacity style={typeChangeBtnStyles.nudgingBtn} 
          onPress={() => {handleRecordEmotion(); amplitude.pushStampInPleaseOneMoreStampView();}}>
          <Text style={{fontSize: 14, color: '#ffffff', fontWeight: '600'}}>감정 스탬프 기록하기</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}





const typeChangeBtnStyles = StyleSheet.create({
  nudgingBtn: {
    alignSelf: 'center',
    height: 46,
    width: 165,
    justifyContent: 'center', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#72D193',
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  twotypebtn: {
    alignSelf: 'center',
    height: 36,
    width: 304,
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    marginTop: 7,
    padding: 2,
    borderRadius: 8,
  },
  activeType: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 14, color: '#72D193', fontWeight:'600'
  },
  activeFont: {fontSize: 14, color: '#72D193', fontWeight:'600'},
  deactiveType: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  deactiveFont: {fontSize: 14, color: '#B7B7B7', fontWeight:'400'},
});


export default FromFutureView;