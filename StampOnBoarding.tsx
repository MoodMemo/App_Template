import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, StyleSheet, ScrollView, TextInput, Touchable, TouchableOpacity, SafeAreaView, Image, Modal, StatusBar, Platform } from 'react-native';

import * as amplitude from './AmplitudeAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StatusBarStyle} from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';
import realm, { ICustomStamp, createPushedStamp, getAllCustomStamps, updateCustomStampPushedCountById, getCustomStampsByField } from './src/localDB/document';
import { useNavigation } from '@react-navigation/native';
import {default as Text} from "./CustomText"

const StampOnBoarding = () => {

    const [section, setSection] = useState('start');
    const [numberOfLines, setNumberOfLines] = useState(1);
    const [selectedEmotion, setSelectedEmotion] = useState('');
    const [selectedEmotionId, setSelectedEmotionId] = useState('');
    const [selectedEmotionLabel, setSelectedEmotionLabel] = useState('');
    const [date, setDate] = useState(new Date());
    const [memo, setMemo] = useState('');
    const [name,setName] = useState('');

    const navigation = useNavigation();

    const handleMemoChange = (text) => {
        setMemo(text);
        setNumberOfLines(text.split('\n').length);
      };

    const handleCreatePushedStamp = async () => {
        amplitude.submitStamp();
        console.log("체크 버튼 누름!");
        // 기록 시간 설정
        const dateTime = date.toISOString();
        // const dateTime = new Date();
    
        realm.write(() => {
          // 실제로 Realm에 PushedStamp를 생성하는 함수 호출
          createPushedStamp({
            dateTime: dateTime,
            stampName: selectedEmotionLabel,
            emoji: selectedEmotion,
            memo: memo,
            imageUrl: '', // 이미지를 추가하려면 여기에 이미지 URL을 추가
          });
        });
    
        updateCustomStampPushedCountById(selectedEmotionId, 1);
      };

    return (
      section==='start' ? (
        <View style={{justifyContent: 'center', flex:1, backgroundColor:'#FFFAF4'}}>

          <View style={{zIndex: 200, position: 'absolute', top: '4%', alignSelf: 'center', gap: 20, flexDirection: 'row'}}>
            <View style={{width: 14, height: 14, backgroundColor: '#7CD0B2', borderRadius: 7}}></View>
            <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
            <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
            <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
          </View>

          <View style={{width: '100%', height: 300, alignSelf:'center', bottom: 69.5, zIndex: 300, gap: 14, justifyContent: 'flex-end'}}>
            <View style={{left: '10%'}}>
              <View style={bubbleStyles.container}>
                <Text style={{fontSize: 17, color: '#fff', }}>기록을 감정과 함께 남기면</Text>
                <Text style={{fontSize: 17, color: '#fff', marginBottom: 5, }}>하루가 더 풍성해질거라무!</Text>
                <Text style={{fontSize: 17, color: '#fff', }}>Moo랑 함께 해보지 않겠냐무?</Text>
              </View>
              <View style={bubbleStyles.tail}></View>
            </View>

            <View style={{right: '-25%'}}>
              <View style={bubbleStyles.container}>
                <Text style={{fontSize: 20, color: '#fff', fontWeight: 'bold'}}>지금 어떤 감정이 드냐무?</Text>
              </View>
              <View style={[bubbleStyles.tail, {left: 150}]}></View>
            </View>
            <Image source={require('./assets/colorMooMedium.png')}
              style={{ width: 130, height: (130 * 139) / 130 , alignSelf:'center', }}></Image>
          </View>

          <View style={{ backgroundColor: '#fff', height: '50%', width: '100%', zIndex: 1, position: 'absolute', bottom: 0, borderTopStartRadius: 79, alignItems: 'center'}}>
            
            <View style={{position: 'absolute', bottom: 0, gap: 20, justifyContent: 'flex-end'}}>
              <View style={{alignSelf:'center', flexDirection:'row', gap: 16, }}>
                
                <TouchableOpacity style={styles.button} onPress={(async () => { 
                  // Do something before delay
                  // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                  // setIsFirstStamp(false);
                  setSelectedEmotion('😆');
                  setSelectedEmotionLabel('기쁨')
                  setSection('stamp');
                  setSelectedEmotionId(getCustomStampsByField('stampName','기쁨').id);
                  amplitude.clickFirstStamp_JOY();//첫 스탬프 기쁨 선택
                  }
                )}>
                    <Text style={[styles.buttonText, {fontSize: 36}]}>😆</Text>
                    <Text style={styles.buttonText}>기뻐</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button} onPress={(async () => { 
                  // Do something before delay
                  // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                  // setIsFirstStamp(false);
                  setSelectedEmotion('😭');
                  setSelectedEmotionLabel('슬픔');
                  setSelectedEmotionId(getCustomStampsByField('stampName','슬픔').id);
                  setSection('stamp');
                  amplitude.clickFirstStamp_SAD() //첫 스탬프 슬픔 선택
                  }
                )}>
                    <Text style={[styles.buttonText, {fontSize: 36}]}>😭</Text>
                    <Text style={styles.buttonText}>슬퍼...</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button} onPress={(async () => { 
                  // Do something before delay
                  // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                  // setIsFirstStamp(false);
                  setSelectedEmotion('🙂');
                  setSelectedEmotionLabel('평온');
                  setSelectedEmotionId(getCustomStampsByField('stampName','평온').id);
                  setSection('stamp');
                  amplitude.clickFirstStamp_CARM() //첫 스탬프 평온 선택
                  }
                )}>
                    <Text style={[styles.buttonText, {fontSize: 36}]}>🙂</Text>
                    <Text style={styles.buttonText}>그냥 그래</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginBottom: 20, alignSelf:'center', }}>
                <Text style={{color: '#495057', fontSize: 20, }}>위 스탬프 중 하나를 눌러보라무 !</Text>
              </View>
            </View>

          </View>
          
        </View>
      ) : (
      section==='stamp' ? (
        <ScrollView contentContainerStyle={{flexGrow:1}} >
          <View style={{justifyContent: 'center', flex:1, backgroundColor:'#FFFAF4'}}>

            <View style={{zIndex: 50, position: 'absolute', top: '4%', alignSelf: 'center', gap: 20, flexDirection: 'row'}}>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#7CD0B2', borderRadius: 7,}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
            </View>

            {/* <View style={{width: '100%', height: 300, alignSelf:'center', bottom: 69.5, zIndex: 300, gap: 14, justifyContent: 'flex-end'}}>
              <View style={{zIndex: 105, alignSelf: 'center', }}>
                <View style={[bubbleStyles.container, {paddingVertical: 15, width: 250}]}>
                  <Text style={{fontSize: 20, color: '#fff', zIndex: 50}}>방금 누른 감정이 왜 들었는지</Text>
                  <Text style={{fontSize: 20, color: '#fff', zIndex: 50}}>짧게 메모도 남겨보자무!</Text>
                </View>
                <View style={[bubbleStyles.tail, {}]}></View>
              </View>

              <Image source={require('./assets/colorMooMedium.png')}
              style={{ zIndex: 100, width: 130, height: (130 * 139) / 130 , alignSelf:'center', bottom: 0}}></Image>
            </View> */}

            <View style={{ backgroundColor: '#fff', height: '50%', minHeight: 350, width: '100%', zIndex: 1, position: 'absolute', bottom: 0, borderTopStartRadius: 79, paddingHorizontal: 16, justifyContent: 'flex-end', overflow: 'visible'}}>

              <View style={{zIndex: 105, alignSelf: 'center', marginBottom: 14}}>
                <View style={[bubbleStyles.container, {paddingVertical: 15, width: 250}]}>
                  <Text style={{fontSize: 20, color: '#fff', zIndex: 50}}>방금 누른 감정이 왜 들었는지</Text>
                  <Text style={{fontSize: 20, color: '#fff', zIndex: 50}}>짧게 메모도 남겨보자무!</Text>
                </View>
                <View style={[bubbleStyles.tail, {}]}></View>
              </View>

              <Image source={require('./assets/colorMooMedium.png')}
              style={{ zIndex: 100, width: 130, height: (130 * 139) / 130 , alignSelf:'center', bottom: 0}}></Image>

              <View style={[styles.stampContainer, {marginBottom: 7, gap: 5}]}>
                <Text style={styles.modalText}>찍은 스탬프</Text>
                <Text style={{fontSize:36, color: '#212429'}}>{selectedEmotion}</Text>
                <Text style={{fontSize:16, color: '#212429'}}>{selectedEmotionLabel}</Text>
              </View>

              <View style={styles.memoContainer}>
                <Text style={styles.modalText}>메모 남기기</Text>
                <View style={styles.memoContent}>
                  <TextInput
                    style={styles.memoText}
                    placeholder="메모 작성하기"
                    multiline={true}
                    maxLength={500}
                    onChangeText={handleMemoChange}
                    onFocus={() => {
                      amplitude.editStampMemo();
                    }}
                    value={memo}
                    numberOfLines={numberOfLines}
                  />
                  <Text style={styles.maxLength}>{memo.length}/500</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={(async () => { 
                    // Do something before delay
                    // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                    // setIsFirstStamp(false);
                    setSection('stampEnd');
                    //console.log(selectedEmotionId);
                    //handleCreatePushedStamp();
                    // AsyncStorage.setItem('@UserInfo:firstStamp','false');
                    amplitude.confirmFirstStamp() //첫 스탬프 입력 완료
                    }
                    )}>
                        <Text style={{ color: '#72D193', fontSize: 20, fontWeight: 'bold'}}>다 적었어!</Text>
              </TouchableOpacity>  
            </View>
            
          </View>
        </ScrollView>
      ) : (
      section==='stampEnd' ? (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
          <View style={{ justifyContent: 'center', flex:1, backgroundColor:'#EDF6E5',paddingHorizontal: 16, }}>
            
            <View style={{zIndex: 200, position: 'absolute', top: '4%', alignSelf: 'center', gap: 20, flexDirection: 'row'}}>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#7CD0B2', borderRadius: 7,}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
            </View>
            
            <View style={{zIndex: 105, alignSelf: 'center', bottom: 30}}>
              <View style={[bubbleStyles.container, {paddingVertical: 15, width: 240}]}>
                <Text style={{fontSize: 20, color: '#fff', marginBottom: 5}}>잘했다무!</Text>
                <Text style={{fontSize: 20, color: '#fff', }}>{(() => {
                        AsyncStorage.getItem('@UserInfo:userName').then((value) => {
                            setName(value);
                        })
                        return name;
                    })()}가 말해준 감정 기록은</Text>
                <Text style={{fontSize: 20, color: '#fff', }}>Moo가 잘 기록해두겠다무!</Text>
              </View>
              <View style={[bubbleStyles.tail, {}]}></View>
            </View>
            
            <Image source={require('./assets/finish_0904.png')}
            style={{ zIndex: 100, width: 209, height: (209 * 168) / 209 , alignSelf:'center', }}></Image>

            <TouchableOpacity style={styles.saveButton_2} onPress={(async () => { 
              // Do something before delay
              // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
              // setIsFirstStamp(false);
              setSection('end');
              // console.log(selectedEmotionId);
              // handleCreatePushedStamp();
              // AsyncStorage.setItem('@UserInfo:firstStamp','false');
              amplitude.okForMoosRemembering() //첫 스탬프 입력 후 튜토리얼
              }
              )}>
              <Text style={{ color: '#72D193', fontSize: 20, fontWeight: 'bold'}}>그래, 좋아!</Text>
            </TouchableOpacity> 

          </View>
        </ScrollView>
      ) : (
        <View style={{flexGrow:1}}>
          <View style={{ justifyContent: 'flex-end', flex:1, backgroundColor:'#EDF6E5',paddingHorizontal: 16, }}>
            
            <View style={{zIndex: 200, position: 'absolute', top: '4%', alignSelf: 'center', gap: 20, flexDirection: 'row'}}>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#0000000A', borderRadius: 7,}}></View>
              <View style={{width: 14, height: 14, backgroundColor: '#7CD0B2', borderRadius: 7,}}></View>
            </View>

            <View style={{gap:8, marginBottom: -20}}>
              
              <View style={{alignSelf: 'flex-end', marginBottom: 12, marginRight: 30}}> 
                <View style={bubbleStyles.container}>
                  <Text style={{fontSize: 15, color: '#fff', zIndex: 50}}>감정 기록을 2️⃣개 이상 남기면</Text>
                  <Text style={{fontSize: 15, color: '#fff', zIndex: 50}}>Moo가 일기를 만들어서</Text>
                  <Text style={{fontSize: 15, color: '#fff', zIndex: 50}}>편지💌를 보내줄거라무!</Text>
                </View>
                <View style={[bubbleStyles.tail, {left: 150}]}></View>
              </View>

              {/* <View style={{alignSelf: 'flex-end', marginBottom: 12, marginRight: 20}}> // 이거 주석 해제하면 위는 {{alignSelf: 'flex-start', marginLeft: 15, marginBottom: 12, }}>  + 밤에 
                <View style={[bubbleStyles.container, {backgroundColor: '#aeaeae', width: 200}]}>
                  <Text style={{fontSize: 13, color: '#fff', zIndex: 50}}>낮에는 Moo ☀️광합성☀️해야해서</Text>
                  <Text style={{fontSize: 13, color: '#fff', zIndex: 50}}>바로는 못 만든다무 ...💦</Text>
                </View>
                <View style={[bubbleStyles.tail, {backgroundColor: '#aeaeae', left: 150}]}></View>
              </View> */}
  
              <View style={{alignSelf: 'flex-start', marginLeft: 40}}>
                  <View style={[bubbleStyles.container, {}]}>
                    <Text style={{fontSize: 15, color: '#fff', zIndex: 50}}>다양한 감정을 준비했으니,</Text>
                    <Text style={{fontSize: 15, color: '#fff', zIndex: 50}}>나에게 딱 맞는 감정을 골라보라무!</Text>
                  </View>
                  <View style={bubbleStyles.tail}></View>
              </View>

              <View style={{alignSelf: 'flex-end', marginRight: 30}}>
                <View style={[bubbleStyles.container, {backgroundColor: '#aeaeae', width: 180}]}>
                  <Text style={{fontSize: 13, color: '#fff', zIndex: 50}}>감정은 직접 만들어도 된다무!</Text>
                </View>
                <View style={[bubbleStyles.tail, {backgroundColor: '#aeaeae', left: 130}]}></View>
              </View>

            </View>

            <View style={{alignSelf: 'center', marginLeft: 30, bottom: -35, left: -80, }}>
              <View style={[bubbleStyles.container, {width: 180}]}>
                <Text style={{fontSize: 17, color: '#fff', zIndex: 50, fontWeight: 'bold'}}>나랑 같이</Text>
                <Text style={{fontSize: 17, color: '#fff', zIndex: 50, fontWeight: 'bold'}}>꾸준히 일기 써 볼</Text>
                <Text style={{fontSize: 17, color: '#fff', zIndex: 50, fontWeight: 'bold'}}>마음이 들었냐무 ...!</Text>
              </View>
              <View style={[bubbleStyles.tail, {left: 130}]}></View>
            </View>

            <Image source={require('./assets/write_0904.png')}
            style={{ zIndex: 100, width: 160, height: (160 * 185) / 160 , alignSelf: 'flex-end', marginRight: 30, marginBottom: 10}}></Image>

            <TouchableOpacity style={styles.saveButton_3} onPress={(async () => { 
                    // Do something before delay
                    // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                    // setIsFirstStamp(false);
                    setSection('');
                    navigation.navigate('Weekly',{ showPopup: true });
                    // console.log(selectedEmotionId);
                    handleCreatePushedStamp();
                    AsyncStorage.setItem('@UserInfo:firstStamp','false');
                    amplitude.confirmEndTutorial() //첫 스탬프 입력 완료
                    }
                    )}>
                        <Text style={{ color: '#72D193', fontSize: 20, fontWeight: 'bold'}}>Moo 잘 부탁해!💚☺️</Text>
            </TouchableOpacity>

          </View>
        </View>
      ))));
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    titleContainer: {
      backgroundColor: '#FFFAF4',
      height: 133,
      borderBottomRightRadius: 43,
      // alignItems: 'center', // 가로 정렬
    },
    title: {
      // fontFamily: 'Pretendard',
      color: '#212429',
      fontWeight: '400',
      // 폰트 크기 16px
      width: '100%',
      height: '100%',
      fontSize: 20,
      marginTop: 28,
      marginLeft: 28,
      marginRight: 200,
      marginBottom: 27, // title과 Dropdown 사이 간격 조절
    },
    mooImage: {
      // 이미지 원본 크기
      // width: 100,
      // height: 100,
      width: 80,
      height: 393*79/363 ,
      position: 'absolute',
      top: 55,
      right: 35,
      // 회전
      transform: [{ rotate: '25deg' }],
    },
    options: {
      flexDirection: 'row', // 옵션들을 가로로 배치
      justifyContent: 'space-between', // 옵션들 사이 간격을 동일하게 배치
      alignItems: 'center', // 옵션들을 세로로 가운데 정렬
      marginTop: 32,
      marginHorizontal: 28,
      marginBottom:12
    },
    fixButton: {
      width: 20,
      height: 20,
    },
    button: {
      // bottom: '18%',
      width: '28%',
      // height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      borderColor:'#72D193',
      borderWidth: 1,
      // width: 133,
      gap: 15,
      borderStyle: 'dashed',
      paddingVertical: 20
    },
    saveButton: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 7,
        borderColor:'#72D193',
        borderWidth: 1, 
        marginBottom: 20
      },
    saveButton_2: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 7,
        borderColor:'#72D193',
        borderWidth: 1, 
        marginBottom: 20
      },
    saveButton_3: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 7,
        borderColor:'#72D193',
        borderWidth: 1, 
        marginBottom: 20
      },
    buttonText: {
      color: '#212429',
      fontSize: 20,
      fontWeight: '100'
    },
    modalTitleContainer: {
        flexDirection: 'row',
        display: 'flex',
        width: '100%',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      modalTitle: {
        color: '#212429',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Pretendard',
        fontWeight: '400',
        fontStyle: 'normal',
      },
      modalText: {
        fontFamily: 'Pretendard',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        color: '#495057',
        marginRight: 10
      },
      stampContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 30,
        // justifyContent 종류: flex-start, flex-end, center, space-between, space-around, space-evenly
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
      },
      stampContent: {
        flexDirection: 'row',
        display: 'flex',
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
      },
      stampText: {
        fontFamily: 'Pretendard',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
      },
      timeContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        paddingLeft: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 30,
      },
      timeText: {
        fontFamily: 'Pretendard',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
      },
      horizontalLine: {
        // width: '100%',
        height: 0.7,
        backgroundColor: '#F0F0F0',
        marginLeft: 16,
        marginRight: 19,
      },
      memoContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        gap: 12,
        marginBottom: 47
      },
      memoContent: {
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 6,
      },
      memoText: {
        alignSelf: 'stretch',
        color: '#DBDBDB',
        textAlignVertical: 'top',
        fontSize: 14,
        fontFamily: 'Pretendard',
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 24,
      },
      maxLength: {
        color: '#495057',
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'Pretendard',
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 24,
      },
  });

  const bubbleStyles = StyleSheet.create({
    container: {
      backgroundColor: '#72D193',
      padding: 10,
      // maxWidth: 200,
      width: 230,
      alignSelf: 'flex-start', // 좌측 정렬로 변경
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      // borderBottomLeftRadius: 0, // 우측 하단을 둥글게
      position: 'relative',
      overflow: 'hidden', // 클리핑 적용
      zIndex: 30
    },
    tail: {
      position: 'absolute',
      width: 20, // 꼬리의 길이
      height: 20, // 꼬리의 높이
      left: 40, // 꼬리 위치
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

export default StampOnBoarding;