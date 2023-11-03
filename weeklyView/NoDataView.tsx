import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, StatusBar} from 'react-native';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { deleteUserStamp } from '../src/graphql/mutations';
import Modal from "react-native-modal";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import { styles } from 'react-native-gifted-charts/src/LineChart/styles';


/** no navigate */
export const FromFutureView = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <View>
          <View style={[bubbleStyles.container, {width: 180, backgroundColor: '#dbdbdb', zIndex: 100}]}>
            <Text style={{fontSize: 16, color: '#fff', }}>미래에서 왔냐무?</Text>
            <Text style={{fontSize: 16, color: '#fff', }}>타임머신은 없는데무!</Text>
          </View>
          <View style={[bubbleStyles.tail, {backgroundColor: '#dbdbdb'}]}></View>
        </View>
        <Image 
          source={require('../assets/boring_gray_0904.png')}
          style={{ width: 124, height: (113 * 124) / 124 , marginTop: 20}} // 비율을 유지하며 height 자동 조절
        />
      </View>

    </View>
  );
}
export const MooWasBoredView = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <View>
          <View style={[bubbleStyles.container, {width: 130, backgroundColor: '#dbdbdb'}]}>
            <Text style={{fontSize: 16, color: '#fff',}}>심심했다무...</Text>
          </View>
          <View style={[bubbleStyles.tail, {backgroundColor: '#dbdbdb', }]}></View>
        </View>
        <Image 
          source={require('../assets/boring_gray_0904.png')}
          style={{ width: 124, height: (113 * 124) / 124 , marginTop: 20}} // 비율을 유지하며 height 자동 조절
        />
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
        <View>
          <View style={[bubbleStyles.container, {backgroundColor: '#dbdbdb', zIndex: 100}]}>
            <Text style={{fontSize: 16, color: '#fff', }}>심심하다무...</Text>
            <Text style={{fontSize: 16, color: '#fff', }}>무슨 일이 있었는지 들려달라무!</Text>
          </View>
          <View style={[bubbleStyles.tail, {backgroundColor: '#dbdbdb'}]}></View>
        </View>

        <Image 
          source={require('../assets/boring_gray_0904.png')}
          style={{ width: 124, height: (113 * 124) / 124 , marginTop: 20, marginBottom: 40}} // 비율을 유지하며 height 자동 조절
        />

        <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 46, marginBottom: 10}]} 
          onPress={() => {handleRecordEmotion(); amplitude.pushStampInTellMeYourDayView();}}>
          <Text style={{fontSize: 16, color: '#72D193', fontWeight: '600'}}>감정 스탬프 기록하기</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
export const Present_Zero_View = () => {
  const navigation = useNavigation();
  const handleRecordEmotion = () => {
    // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
    // Home 뷰로 이동하도록 설정
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, width: '100%', paddingHorizontal: 10, paddingTop: 10}}>
        {/* 무 말풍선 섹션 */}
        <View style={{marginTop: 20, flexDirection: 'row', gap: 10}}>
          <Image 
            source={require('../assets/profile.png')}
            style={{ width: 40, height: 40 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
          />
          <View>

            <View><Text style={{fontSize: 13, color: 'black', }}>Moo</Text></View>
            
            <View style={[finalBubbleStyles.tail, {}]}></View>
            <View style={[finalBubbleStyles.container, {zIndex: 100}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>Moo는 오늘도 광합성하고 있겠다무</Text>
            </View>
            <View style={[finalBubbleStyles.container, {zIndex: 100, marginTop: 8}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>스탬프 눌러서 깨워달라무 ...</Text>
            </View>
          </View> 
        </View>
        {/* 스탬프 누르기 버튼 */}
        <View style={{marginTop: 15, alignSelf: 'flex-end', marginRight: 10}}>
          <View style={[finalBubbleStyles.rightTail, {}]}></View>
          <View style={[finalBubbleStyles.rightTail, {zIndex: 101, backgroundColor: '#fff', width: 10, height: 10, top: 9, right: -2}]}></View>
          <View style={[finalBubbleStyles.container, {zIndex: 100, flexDirection: 'row',
          backgroundColor: '#fff', borderColor: '#FFCF55', borderWidth: 2,}]}>
            <Ionicons name='add-circle' color="#FFCF55" style={{ fontWeight: 'bold', fontSize: 25}} />
            <Text style={{fontSize: 20, color: '#FFCF55', }}> 스탬프 누르기</Text>
          </View>
        </View>
      </View>

      <View style={{position: 'absolute', bottom: 60, zIndex: 100, flexDirection: 'row' ,}}>
        <View style={{position: 'absolute', top: -70, left: 70, }}>
          <Image 
                source={require('../assets/bubble.png')}
                style={{ width: 120, height: (73 * 120) / 120 , 
                }} // 비율을 유지하며 height 자동 조절
              />
          <View style={{top: -55, alignItems: 'center', }}>
            {/* <Text style={{ color: '#fff' }}>스탬프 누르고</Text> */}
            <Text style={{ color: '#fff' }}>Moo 깨우기</Text>
            <Text style={{ color: '#fff' }}>0/2 ... 🫧</Text>
          </View>

          <View style={{backgroundColor: '#72D193', width: 15, height: 15, borderRadius: 20,
        position: 'absolute', bottom: 15, left: 35}}></View>
          <View style={{backgroundColor: '#72D193', width: 10, height: 10, borderRadius: 10,
        position: 'absolute', bottom: -5, left: 30}}></View>
        </View>
        <Image 
              source={require('../assets/moo_sun.png')}
              style={{ width: 130, height: (161 * 130) / 130 , left: -30}} // 비율을 유지하며 height 자동 조절
            />
        

      </View>
      
      <View style={{backgroundColor: '#94DC7B', height: 95, width: '120%', zIndex: 10,
                    position: 'absolute', bottom: 0, borderTopRightRadius: 120, borderTopLeftRadius: 120,
                    alignItems: 'center'}}>
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
        
        <View>
          <View style={[bubbleStyles.container, {backgroundColor: '#dbdbdb', zIndex: 100}]}>
            <Text style={{fontSize: 16, color: '#fff', }}>스탬프 한 개만 더 찍고 오라무!</Text>
          </View>
          <View style={[bubbleStyles.tail, {backgroundColor: '#dbdbdb'}]}></View>
        </View>

        <Image 
          source={require('../assets/emptyMoo.png')}
          style={{ width: 104, height: (107 * 104) / 104 , marginTop: 20, marginBottom: 40}} // 비율을 유지하며 height 자동 조절
        />

        <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 46, marginBottom: 10}]} 
          onPress={() => {handleRecordEmotion(); amplitude.pushStampInPleaseOneMoreStampView();}}>
          <Text style={{fontSize: 16, color: '#72D193', fontWeight: '600'}}>하나 더 누르고 올게!</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
export const PleaseOneMoreStampMini = () => {
  const navigation = useNavigation();
  const handleRecordEmotion = () => {
    // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
    // Home 뷰로 이동하도록 설정
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, alignItems: 'center', }}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>


        <View>
          <View style={[bubbleStyles.container, {zIndex: 100, width: 180}]}>
            <View style={{ alignItems: 'center', flexDirection: 'row', }}>
              <Text style={{fontSize: 14, color: '#fff', }}>스탬프 </Text>
              <Text style={{fontSize: 14, color: '#fff', fontWeight: '700', marginBottom:(Platform.OS==='android' ? 3 : 0)}}>한 개만 더</Text>
              <Text style={{fontSize: 14, color: '#fff', }}> 누르면,</Text>
            </View>
            <Text style={{fontSize: 14, color: '#fff', }}>일기를 만들 수 있다무!</Text>
          </View>
          <View style={[bubbleStyles.tail, {}]}></View>
        </View>

        <Image 
            source={require('../assets/colorMooMedium.png')}
            style={{ width: 104, height: (110 * 104) / 104 , marginTop: 20, marginBottom:20}} // 비율을 유지하며 height 자동 조절
          />

        <TouchableOpacity style={[bubbleStyles.reply, {width: 184, height: 35, marginBottom: 10, padding: 5}]} 
          onPress={() => {handleRecordEmotion(); amplitude.pushStampInPleaseOneMoreStampViewInStampSwitch();}}>
          <Text style={{fontSize: 14, color: '#72D193', fontWeight: '600'}}>하나 더 누를래!</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}





const typeChangeBtnStyles = StyleSheet.create({
  nudgingBtn: {
    alignSelf: 'center',
    height: 46,
    width: 180,
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
const bubbleStyles = StyleSheet.create({
  container: {
    backgroundColor: '#72D193',
    padding: 10,
    // maxWidth: 200,
    width: 220,
    alignSelf: 'flex-start', // 좌측 정렬로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
    position: 'relative',
    overflow: 'hidden', // 클리핑 적용
  },
  tail: {
    position: 'absolute',
    width: 20, // 꼬리의 길이
    height: 20, // 꼬리의 높이
    left: 10, // 꼬리 위치
    bottom: -5, // 꼬리 위치
    backgroundColor: '#72D193',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 10, // 둥글게 만들기
    // borderBottomLeftRadius: 10,
    // borderTopRightRadius: 10
  },
  reply: {
    backgroundColor: '#fff',
    padding: 7,
    // maxWidth: 200,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
    position: 'relative',
    borderColor: '#72D193',
    borderWidth: 1,
    overflow: 'hidden', // 클리핑 적용
  },
});
const finalBubbleStyles = StyleSheet.create({
  container: {
    backgroundColor: '#72D193',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start', // 좌측 정렬로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    position: 'relative',
    overflow: 'hidden', // 클리핑 적용
  },
  tail: {
    position: 'absolute',
    width: 15, // 꼬리의 길이
    height: 15, // 꼬리의 높이
    left: -4, // 꼬리 위치
    top: 20, // 꼬리 위치
    backgroundColor: '#72D193',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 100, // 둥글게 만들기
  },
  rightTail: {
    position: 'absolute',
    width: 15, // 꼬리의 길이
    height: 15, // 꼬리의 높이
    right: -4, // 꼬리 위치
    top: 6, // 꼬리 위치
    backgroundColor: '#FFCF55',
    // borderColor: '#72D193',
    // borderWidth: 2,
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 100, // 둥글게 만들기
  },
});


export default FromFutureView;