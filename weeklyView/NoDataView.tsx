import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, StatusBar, Animated, Easing} from 'react-native';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { deleteUserStamp } from '../src/graphql/mutations';
import Modal from "react-native-modal";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as repository from '../src/localDB/document';
import realm from '../src/localDB/document';
import * as amplitude from '../AmplitudeAPI';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

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

import {AnimatedCircularProgress} from 'react-native-circular-progress';

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





function Bubble({ text, imageSource, delay, toneDown, letter, last, button, loading, setIsLoadingFinished }) {
  const [progress, setProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();
    const handleRecordEmotion = () => {
      // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
      // Home 뷰로 이동하도록 설정
      navigation.navigate('Home');
    };

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay), // 딜레이를 설정
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // 애니메이션 지속 시간
        easing: Easing.linear,
        useNativeDriver: true, // 네이티브 드라이버 사용
      }),
    ]).start();
  }, [fadeAnim, delay]);

  useEffect(() => {
    if(loading){
      const interval = setInterval(() => {
        if (progress < 100) {
          setProgress(progress+7>100 ? 100 : progress+7);
        } else {
          setIsLoadingFinished(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [progress]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {imageSource ? (
        <Image source={imageSource}
          style={{ width: 80, height: (92 * 80) / 80 , zIndex: 100, marginBottom: 8}} // 비율을 유지하며 height 자동 조절
          />
      ) : (
      toneDown ? (loading ? 
        <View style={{flexDirection:'row'}}>
          <View style={[finalBubbleStyles.container, {backgroundColor: '#DDECE3'}]}>
            <Text style={{ fontSize: 16, color: '#fff' }}>{text}</Text>
          </View>
          <AnimatedCircularProgress size={35} width={3} fill={progress} tintColor={'#72D193'} backgroundColor={'#DDDDDD'} style={{left:8}}>
            {
              (fill)=>(<Text style={{fontSize:11,color:'#72D193'}}>{progress}%</Text>)
            }
          </AnimatedCircularProgress>
        </View>
         : 
        <View style={[finalBubbleStyles.container, {backgroundColor: '#DDECE3'}]}>
          <Text style={{ fontSize: 16, color: '#fff' }}>{text}</Text>
        </View>
      ) : (
      letter ? (
        <View style={{flexDirection: 'row', }}>
          <TouchableOpacity style={[finalBubbleStyles.gotoLetter_container, {}]}
          onPress={() => {amplitude.test2(); letter();}}>
            <FontAwesome name='envelope-o' color="#72D193" style={{ fontWeight: 'bold', fontSize: 25}} />
            <Text style={{fontSize: 16, color: '#72D193', }}>Moo의 편지 확인하기</Text>
          </TouchableOpacity>
          <Text style={{fontSize: 14, color: '#72D193', marginLeft: 3, alignSelf: 'flex-end', paddingVertical: 10,}}>← Click!</Text>
        </View>
      ) : (
      last ? (
        <View style={[finalBubbleStyles.container, {zIndex: 100, alignItems: 'flex-start'}]}>
          <Text style={{fontSize: 16, color: '#fff', }}>편지를 보고 오늘의 하루가 어땠는지</Text>
          <Text style={{fontSize: 16, color: '#fff', }}>생각해보지 않겠냐무?</Text>
        </View>
      ) : (
      button ? (
        <TouchableOpacity style={{marginTop: 0, alignSelf: 'flex-end', marginRight: 16, }}
        onPress={() => {handleRecordEmotion(); amplitude.pushStampInPleaseOneMoreStampViewInStampSwitch();}}>
          <View style={[finalBubbleStyles.gotoStamp_container]}>
            <Ionicons name='add-circle' color="#495057" style={{ fontWeight: 'bold', fontSize: 28}} />
            <Text style={{fontSize: 16, color: '#495057', }}> 스탬프 누르기!</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={finalBubbleStyles.container}>
          <Text style={{ fontSize: 16, color: '#fff' }}>{text}</Text>
        </View>
      )))))}
    </Animated.View>
  );
}

export const Home_Moo_Message = ({ name }: { name: string }) => {
  const navigation = useNavigation();
  const handleRecordEmotion = () => {
    // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
    // Home 뷰로 이동하도록 설정
    navigation.navigate('Home');
  };
  const [userName, setUserName] = useState('');
  return (
    <View style={{justifyContent: 'space-between', marginHorizontal: 15, marginTop: 20}}>
      {/* 무 말풍선 섹션 */}
      <View style={{flexDirection: 'row', gap: 10}}>
        <Image 
          source={require('../assets/profile.png')}
          style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
        />
        <View>
          <View style={{marginBottom: 4}}><Text style={{fontSize: 18, color: '#212429', fontWeight: 'bold',}}>Moo</Text></View>
          <View style={[finalBubbleStyles.container, {zIndex: 100}]}>
            <Text style={{fontSize: 16, color: '#fff', }}>Moo는 광합성☀️ 중이지만{`\n`}{name}의 감정을 듣고싶다무</Text>
          </View>
          <View style={[finalBubbleStyles.container, {zIndex: 100, }]}>
            <Text style={{fontSize: 16, color: '#fff', }}>무슨 일이 있었는지 알려달라무!</Text>
          </View>
        </View> 
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
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      {/* 말풍선 영역 */}
      <View style={{flex: 1, width: '100%', paddingHorizontal: 10,}}>
        {/* 무 말풍선 섹션 */}
        <View style={{marginTop: 15, flexDirection: 'row', gap: 10}}>
          <Image 
            source={require('../assets/profile.png')}
            style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
          />
          <View>
            <View ><Text style={{fontSize: 16, color: '#212429', fontWeight: 'bold'}}>Moo</Text></View>
            <View style={[finalBubbleStyles.container, {zIndex: 100}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>Moo는 오늘도 광합성하고 있겠다무</Text>
            </View>
            <View style={[finalBubbleStyles.container, {zIndex: 100, }]}>
              <Text style={{fontSize: 16, color: '#fff', }}>스탬프 눌러서 깨워달라무 ...</Text>
            </View>
          </View> 
        </View>
        {/* 스탬프 누르기 버튼 */}
        <TouchableOpacity style={{marginTop: 15, alignSelf: 'flex-end', marginRight: 10}}
        onPress={() => {handleRecordEmotion(); amplitude.pushStampInTellMeYourDayView();}}>
          <View style={[finalBubbleStyles.gotoStamp_container]}>
            <Ionicons name='add-circle' color="#495057" style={{ fontWeight: 'bold', fontSize: 28}} />
            <Text style={{fontSize: 16, color: '#495057', }}> 스탬프 누르기!</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* 무 영역 */}
      <View>
        {/* 무 이미지 */}
        <Image source={require('../assets/moo_zero.png')} style={{ width: 160, height: (147.5 * 160) / 160, margin: 17,}}/>
        {/* 무 상태 */}
        <View style={finalBubbleStyles.moo_status_bar}>
          <MCIcon name='lock' color="#fff" style={{ fontWeight: 'bold', fontSize: 25}} />
          <Text style={{fontSize: 18, color: '#fff', }}> Moo 깨우기 ... </Text>
          <Text style={{fontSize: 20, color: '#7D705B', fontWeight: 'bold'}}>0/2</Text>
        </View>
      </View>
    </View>
  );
}
export const Present_One_MiniView = () => {
    const navigation = useNavigation();
    const handleRecordEmotion = () => {
      // [감정 스탬프 기록하기] 버튼을 눌렀을 때 실행되는 함수
      // Home 뷰로 이동하도록 설정
      navigation.navigate('Home');
    };
    return (
      <View style={{flex: 1, justifyContent: 'space-between',}}>
        
        {/* 무 말풍선 섹션 */}
        <View style={{marginTop: 15, flexDirection: 'row', gap: 10, marginLeft: 16}}>
          <Image 
            source={require('../assets/profile.png')}
            style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
          />
          <View>
            <View ><Text style={{fontSize: 16, color: '#212429', fontWeight: 'bold'}}>Moo</Text></View>
            <Bubble text="알았다무..! 저녁까지 광합성하려고 했는데" delay={0} />
            <Bubble text="스탬프 하나 더 누르면.. 일어나보겠다무" delay={800} />
          </View> 
        </View>
        
        {/* 스탬프 누르기 버튼 */}
        <Bubble button={true} delay={1600} />

        {/* 무 영역 */}
        <View>
          {/* 무 이미지 */}
          <Image source={require('../assets/moo_one.png')} style={{ width: 160, height: (154.65 * 160) / 160, margin: 17,}}/>
          {/* 무 상태 */}
          <View style={finalBubbleStyles.moo_status_bar}>
            <MCIcon name='lock' color="#fff" style={{ fontWeight: 'bold', fontSize: 25}} />
            <Text style={{fontSize: 18, color: '#fff', }}> Moo 깨우기 ... </Text>
            <Text style={{fontSize: 20, color: '#7D705B', fontWeight: 'bold'}}>1/2</Text>
          </View>
        </View>
      </View>
    );
}
export const Present_WakeUp_MiniView = ({setLoadingEnded}) => {

  const [isLoadingFinished, setIsLoadingFinished] = useState(false);

  useEffect(()=>{
    if(isLoadingFinished){
      console.log('loading finished');
      setLoadingEnded(true);
    }
  },[isLoadingFinished])
    return (
      <View style={{flex: 1, alignItems: 'center', }}>
        {/* 말풍선 영역 */}
        <View style={{flex: 1, width: '100%', paddingHorizontal: 10, paddingTop: 10}}>
          {/* 무 말풍선 섹션 */}
          <View style={{marginTop: 20, flexDirection: 'row', gap: 10}}>
            <Image 
              source={require('../assets/profile.png')}
              style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
            />
            <View>
              <View><Text style={{fontSize: 16, color: '#212429', fontWeight: 'bold'}}>Moo</Text></View>
              {/* 여기부터 말풍선 */}
              <Bubble text="Moo 일어났다무..." delay={0} />
              <Bubble text="앗! 이런 일이 있었구나무" delay={800} />
              <Bubble imageSource={require('../assets/write_0904.png')} delay={1600} />
              <Bubble text="편지쓰는중 ... 기다려보라무" delay={2400} toneDown={true} loading={true} setIsLoadingFinished={setIsLoadingFinished}/>
            </View> 
          </View>
        </View>
      </View>
    );
}
export const Present_FinishWriting_MiniView = ({handleStampORDiaryFromPFM}) => {
  // const [stampORdiaryFromPFM, setStampORdiaryFromPFM] = useState(true); // true = stamp, false = diary
  const handleClick = () => {
    handleStampORDiaryFromPFM()
  };
  const [userName, setUserName] = useState('');
  return (
    <View style={{flex: 1, alignItems: 'center',}}>
      {/* 말풍선 영역 */}
      <View style={{flex: 1, width: '100%', paddingHorizontal: 10, paddingTop: 10}}>
        {/* 무 말풍선 섹션 */}
        <View style={{marginTop: 20, flexDirection: 'row', gap: 10}}>
          <Image 
            source={require('../assets/profile.png')}
            style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
          />
          <View>
            <View><Text style={{fontSize: 16, color: '#212429', fontWeight: 'bold'}}>Moo</Text></View>
            {/* 여기부터 말풍선 */}
            <View style={[finalBubbleStyles.container, {zIndex: 100}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>Moo 일어났다무...</Text>
            </View>
            <View style={[finalBubbleStyles.container, {zIndex: 100, }]}>
              <Text style={{fontSize: 16, color: '#fff', }}>앗! 이런 일이 있었구나무</Text>
            </View>
            {/* 여기부터 버블 애니메이션 */}
            <Bubble text="Moo가 편지를 써봤다무 ...!💌" delay={0} />
            <Bubble letter={handleClick} delay={800} />
            <Bubble last={true} delay={1600} />
          </View> 
        </View>
      </View>
    </View>
  );
}


export const Future_View = () => {
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      {/* 말풍선 영역 */}
      <View style={{flex: 1, width: '100%', paddingHorizontal: 10,}}>
        {/* 무 말풍선 섹션 */}
        <View style={{marginTop: 15, flexDirection: 'row', gap: 10}}>
          <Image 
            source={require('../assets/profile.png')}
            style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
          />
          <View>
            <View><Text style={{fontSize: 16, color: '#dbdbdb', fontWeight: 'bold'}}>Moo</Text></View>
            <View style={[finalBubbleStyles.container, {zIndex: 100, backgroundColor: '#dbdbdb'}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>미래에서 왔냐무?</Text>
            </View>
            <View style={[finalBubbleStyles.container, {zIndex: 100, backgroundColor: '#dbdbdb'}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>타임머신은 없는데무!</Text>
            </View>
          </View> 
        </View>
      </View>
      {/* 무 영역 */}
      <View>
        {/* 무 이미지 */}
        {/* <Image source={require('../assets/boring_gray_0904.png')}
          style={{ width: 130, height: (117.46 * 130) / 130 , margin: 17}}/> */}
        {/* 무 상태 */}
        <View style={[finalBubbleStyles.moo_status_bar, {backgroundColor: '#dbdbdb'}]}>
          <MCIcon name='lock' color="#fff" style={{ fontWeight: 'bold', fontSize: 25}} />
          <Text style={{fontSize: 18, color: '#fff', }}> Moo 깨우기 ...?</Text>
        </View>
      </View>
    </View>
  );
}
export const Past_Zero_View = () => {
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      {/* 말풍선 영역 */}
      <View style={{flex: 1, width: '100%', paddingHorizontal: 10,}}>
        {/* 무 말풍선 섹션 */}
        <View style={{marginTop: 15, flexDirection: 'row', gap: 10}}>
          <Image 
            source={require('../assets/profile.png')}
            style={{ width: 34, height: 34 , zIndex: 100,}} // 비율을 유지하며 height 자동 조절
          />
          <View>
            <View><Text style={{fontSize: 16, color: '#dbdbdb', fontWeight: 'bold'}}>Moo</Text></View>
            <View style={[finalBubbleStyles.container, {zIndex: 100, backgroundColor: '#dbdbdb'}]}>
              <Text style={{fontSize: 16, color: '#fff', }}>심심했다무...</Text>
            </View>
          </View> 
        </View>
      </View>
      {/* 무 영역 */}
      <View>
        {/* 무 이미지 */}
        <Image source={require('../assets/boring_gray_0904.png')}
          style={{ width: 130, height: (117.46 * 130) / 130 , margin: 17}}/>
        {/* 무 상태 */}
        <View style={[finalBubbleStyles.moo_status_bar, {backgroundColor: '#dbdbdb'}]}>
          <MCIcon name='lock' color="#fff" style={{ fontWeight: 'bold', fontSize: 25}} />
          <Text style={{fontSize: 18, color: '#fff', }}> Moo는 잘 잤다고 합니다</Text>
        </View>
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
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignSelf: 'flex-start', // 좌측 정렬로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'relative',
    overflow: 'hidden', // 클리핑 적용
    marginBottom: 8,
    zIndex: 100,
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
  gotoStamp_container: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignSelf: 'flex-start', // 좌측 정렬로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: '#DDECE3',
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden', // 클리핑 적용
    zIndex: 100, flexDirection: 'row', 
  },
  gotoLetter_container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start', // 좌측 정렬로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'relative',
    overflow: 'hidden', // 클리핑 적용
    zIndex: 100, marginBottom: 8, flexDirection: 'row', gap: 6,
    borderColor: '#72D193',
    borderWidth: 2,
  },
  moo_status_bar: {
    backgroundColor: '#FCD49B', width: '100%', zIndex: 10, paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end'
  },
});


export default FromFutureView;