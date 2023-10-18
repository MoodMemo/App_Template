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
      }

    return (section==='start' ? (<View style={{justifyContent: 'center',
    flex:1,
    backgroundColor:'#FFFAF4'}}>
      <Image 
        source={require('./assets/colorMooMedium.png')}
        style={{ width: 123, height: (123 * 131) / 123 , position: 'absolute', bottom: 200, left:140, alignSelf:'center', overflow: 'hidden', transform:[{rotate:'11.91deg'}]}}></Image>
      <TouchableOpacity disabled={true} style={{
          position: 'absolute',
          bottom: 400,
          width: '90%',
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#72D193',
          borderRadius: 7,
          marginHorizontal:'5%'
        }}>
            <Text style={{
                fontSize: 26,
                color:"#FFFFFF",
            }}>처음으로 감정을 남기는 걸</Text>
            <Text style={{
                fontSize: 26,
                color:"#FFFFFF",
            }}>무가 도와주겠다무!</Text>
            <Text style={{
                fontSize: 26,
                color:"#FFFFFF",
            }}>지금의 감정은 어떠냐무~?</Text>
      </TouchableOpacity>
      <View style={{
        position: 'absolute',
        left:180,
        bottom: 360,
        width:0,
        height:0,
        borderTopWidth:20,
        borderTopColor:'#72D193',
        borderLeftWidth:20,
        borderLeftColor:'#FFFFFF00',
        borderRightWidth:20,
        borderRightColor:'#FFFFFF00',
        borderBottomWidth:20,
        borderBottomColor:'#FFFFFF00',
        }}/>
      <View style={{top:330,width:'90%',alignSelf:'center',flexDirection:'row',justifyContent:'space-between'}}>
        <TouchableOpacity style={styles.button} onPress={(async () => { 
          // Do something before delay
          // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
          // setIsFirstStamp(false);
          setSelectedEmotion('😆');
          setSelectedEmotionLabel('기쁨')
          setSection('stamp');
          setSelectedEmotionId(getCustomStampsByField('stampName','기쁨').id);
          amplitude.test1();//첫 스탬프 기쁨 선택
          }
        )}>
            <Text style={styles.buttonText}>기뻐😆</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={(async () => { 
          // Do something before delay
          // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
          // setIsFirstStamp(false);
          setSelectedEmotion('😭');
          setSelectedEmotionLabel('슬픔');
          setSelectedEmotionId(getCustomStampsByField('stampName','슬픔').id);
          setSection('stamp');
          amplitude.test1() //첫 스탬프 슬픔 선택
          }
        )}>
            <Text style={styles.buttonText}>슬퍼...😭</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={(async () => { 
          // Do something before delay
          // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
          // setIsFirstStamp(false);
          setSelectedEmotion('🙂');
          setSelectedEmotionLabel('평온');
          setSelectedEmotionId(getCustomStampsByField('stampName','평온').id);
          setSection('stamp');
          amplitude.test1() //첫 스탬프 평온 선택
          }
        )}>
            <Text style={styles.buttonText}>그냥 그래🙂</Text>
        </TouchableOpacity>
      </View>
    </View>) : (section==='stamp' ? (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View style={{
                flex:1,
                backgroundColor:'#FFFAF4'
            }}>
                <View style={styles.stampContainer}>
                  <Text style={styles.modalText}>찍은 스탬프</Text>
                  <View style={styles.stampContent}>
                    <Text style={styles.stampText}>{selectedEmotion}</Text>
                    <Text style={styles.stampText}>{selectedEmotionLabel}</Text>
                  </View>
                </View>
                <View style={styles.horizontalLine} />
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
        <Image 
        source={require('./assets/colorMooMedium.png')}
        style={{ width: 123, height: (123 * 131) / 123 , position: 'absolute', top: 470, left:250, alignSelf:'center', overflow: 'hidden', transform:[{rotate:'11.91deg'}]}}></Image>
        <TouchableOpacity disabled={true} style={{
          position: 'absolute',
          top: 470,
          width: 200,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#72D193',
          borderRadius: 7,
          marginHorizontal:'5%'
        }}>
            <Text style={{
                fontSize: 22,
                color:"#FFFFFF",
            }}>방금 고른 감정을</Text>
            <Text style={{
                fontSize: 22,
                color:"#FFFFFF",
            }}>왜 골랐는지</Text>
            <Text style={{
                fontSize: 22,
                color:"#FFFFFF",
            }}>메모를 적어달라무!</Text>
      </TouchableOpacity>
      <View style={{
        position: 'absolute',
        left:230,
        top: 500,
        width:0,
        height:0,
        borderTopWidth:20,
        borderTopColor:'#FFFFFF00',
        borderLeftWidth:20,
        borderLeftColor:'#72D193',
        borderRightWidth:20,
        borderRightColor:'#FFFFFF00',
        borderBottomWidth:20,
        borderBottomColor:'#FFFFFF00',
        }}/>
    <TouchableOpacity style={styles.saveButton} onPress={(async () => { 
                // Do something before delay
                // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                // setIsFirstStamp(false);
                setSection('stampEnd');
                //console.log(selectedEmotionId);
                //handleCreatePushedStamp();
                // AsyncStorage.setItem('@UserInfo:firstStamp','false');
                amplitude.test1() //첫 스탬프 입력 완료
                }
                )}>
                    <Text style={styles.buttonText}>다 적었어!</Text>
        </TouchableOpacity>  
    </View>
    </ScrollView>
    ) : (section==='stampEnd' ? 
    (<ScrollView contentContainerStyle={{flexGrow:1}}>
    <View style={{
        flex:1,
        backgroundColor:'#FFFAF4'
    }}>
        <Image 
            source={require('./assets/colorMooMedium.png')}
            style={{ width: 123, height: (123 * 131) / 123 , alignSelf:'center', overflow: 'hidden', position: 'absolute', bottom: 200, left:140, transform:[{rotate:'11.91deg'}]}}></Image>
        <TouchableOpacity disabled={true} style={{
            position: 'absolute',
            bottom: 400,
            width: '90%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#72D193',
            borderRadius: 7,
            marginHorizontal:'5%'
            }}>
                <Text style={{
                    fontSize: 26,
                    color:"#FFFFFF",
                }}>잘했다무!</Text>
                <Text style={{
                    fontSize: 26,
                    color:"#FFFFFF",
                }}>{(() => {
                    AsyncStorage.getItem('@UserInfo:userName').then((value) => {
                        setName(value);
                    })
                    return name;
                })()}가 남긴 스탬프는</Text>
                <Text style={{
                    fontSize: 26,
                    color:"#FFFFFF",
                }}>무가 계속 기억하겠다무!</Text>
        </TouchableOpacity>
        <View style={{
            position: 'absolute',
            left:180,
            bottom: 360,
            width:0,
            height:0,
            borderTopWidth:20,
            borderTopColor:'#72D193',
            borderLeftWidth:20,
            borderLeftColor:'#FFFFFF00',
            borderRightWidth:20,
            borderRightColor:'#FFFFFF00',
            borderBottomWidth:20,
            borderBottomColor:'#FFFFFF00',
            }}/>
        <TouchableOpacity style={styles.saveButton} onPress={(async () => { 
                // Do something before delay
                // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                // setIsFirstStamp(false);
                setSection('end');
                // console.log(selectedEmotionId);
                // handleCreatePushedStamp();
                // AsyncStorage.setItem('@UserInfo:firstStamp','false');
                amplitude.test1() //첫 스탬프 입력 후 튜토리얼
                }
                )}>
                    <Text style={styles.buttonText}>그래 좋아!</Text>
        </TouchableOpacity> 
        </View>
    </ScrollView>) : (
        <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={{
            flex:1,
            backgroundColor:'#FFFAF4'
        }}>
            <Image 
                source={require('./assets/colorMooMedium.png')}
                style={{ width: 123, height: (123 * 131) / 123 , alignSelf:'center', overflow: 'hidden', position: 'absolute', bottom: 150, left:140, transform:[{rotate:'11.91deg'}]}}></Image>
            <TouchableOpacity disabled={true} style={{
                position: 'absolute',
                bottom: 350,
                width: '90%',
                height: 320,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#72D193',
                borderRadius: 7,
                marginHorizontal:'5%'
                }}>
                    <Text style={{
                        fontSize: 26,
                        color:"#FFFFFF",
                    }}>스탬프를 두 개 이상 남기면</Text>
                    <Text style={{
                        fontSize: 26,
                        color:"#FFFFFF",
                    }}>일기를 만들어주겠다무!{"\n"}</Text>
                    <Text style={{
                        fontSize: 26,
                        color:"#FFFFFF",
                    }}>더 많은 감정을 준비했으니,</Text>
                    <Text style={{
                        fontSize: 26,
                        color:"#FFFFFF",
                    }}>지금 딱 맞는 감정을 골라보라무!{"\n"}</Text>
                    <Text style={{
                        fontSize: 26,
                        color:"#FFFFFF",
                    }}>딱 맞는 감정이 없다면</Text>
                    <Text style={{
                        fontSize: 26,
                        color:"#FFFFFF",
                    }}>직접 만들 수도 있다무!</Text>
            </TouchableOpacity>
            <View style={{
                position: 'absolute',
                left:180,
                bottom: 310,
                width:0,
                height:0,
                borderTopWidth:20,
                borderTopColor:'#72D193',
                borderLeftWidth:20,
                borderLeftColor:'#FFFFFF00',
                borderRightWidth:20,
                borderRightColor:'#FFFFFF00',
                borderBottomWidth:20,
                borderBottomColor:'#FFFFFF00',
                }}/>
            <TouchableOpacity style={styles.saveButton} onPress={(async () => { 
                    // Do something before delay
                    // await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                    // setIsFirstStamp(false);
                    setSection('');
                    navigation.navigate('Weekly');
                    // console.log(selectedEmotionId);
                    handleCreatePushedStamp();
                    AsyncStorage.setItem('@UserInfo:firstStamp','false');
                    amplitude.test1() //첫 스탬프 입력 완료
                    }
                    )}>
                        <Text style={styles.buttonText}>고마워 무야!</Text>
            </TouchableOpacity> 
            </View>
        </ScrollView>
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
      bottom: '18%',
      width: '30%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 7,
      borderColor:'#72D193',
      borderWidth: 1
    },
    saveButton: {
        position:'absolute',
        bottom: 20,
        width: '90%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 7,
        borderColor:'#72D193',
        borderWidth: 1
      },
    buttonText: {
      color: '#72D193',
      fontSize: 18,
      fontWeight: 'bold'
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
      },
      stampContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        paddingLeft: 16,
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
        padding: 16,
        justifyContent: 'flex-start',
        gap: 7,
      },
      memoContent: {
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        height: 200,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 6,
      },
      memoText: {
        alignSelf: 'stretch',
        color: '#212429',
        textAlignVertical: 'top',
        fontSize: 16,
        fontFamily: 'Pretendard',
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 24,
      },
      maxLength: {
        color: '#495057',
        top: 100,
        textAlign: 'right',
        fontSize: 14,
        fontFamily: 'Pretendard',
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 24,
      },
  });

export default StampOnBoarding;