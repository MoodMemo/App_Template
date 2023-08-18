import React, { useState } from 'react';
import { useWindowDimensions, View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch, Linking} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotificationView from './NotificationView';
import NotificationAdd from './NotificationAdd';
import ChangeProfile from './ChangeProfile';

import * as amplitude from './AmplitudeAPI';

import * as Sentry from "@sentry/react-native";
import { UserFeedback } from "@sentry/react-native";
import { useFocusEffect } from '@react-navigation/native';


const test = () => {
  console.log('hello');
}

const Settings = () => {


    const [memo, setMemo] = useState('');
    const handleMemoChange = (text) => {
        setMemo(text);
      };  
    const sentryUserFeedback = () => {

        const sentryId = Sentry.captureMessage("고객센터/의견 보내기/요류 제보");    
        // OR: const sentryId = Sentry.lastEventId();
        // var userName = await AsyncStorage.getItem('@UserInfo:userName');
        // if (userName === null) userName = '익명';

        console.log(sentryId);

        const userFeedback: UserFeedback = {
            event_id: sentryId,
            name: "사용자도 아직",
            email: "이메일은 아직 개발 안했음",
            comments: memo,
            // comments: "memo",
        };
        Sentry.captureUserFeedback(userFeedback);
        amplitude.test11(userFeedback.comments)
        
        const userFeedback2: UserFeedback = {
            event_id: sentryId,
            name: "사용자도 아직",
            email: "이메일은 아직 개발 안했음",
            // comments: memo,
            comments: "memo",
        };
        Sentry.captureUserFeedback(userFeedback2);
        amplitude.test11(userFeedback2.comments);
        
        setMemo('');
        setIsReportModalVisible(!isReportModalVisible);
    }

    // const handleOpenLink = async () => {
    //     const url = 'http://pf.kakao.com/_xhGnxgxj'; // 원하는 웹 링크
    
    //     // 웹 링크를 열기 위해 Linking.openURL()을 사용합니다.
    //     const supported = await Linking.canOpenURL(url);
    
    //     if (supported) {
    //       await Linking.openURL(url);
    //     } else {
    //       console.log("Don't know how to open URL: " + url);
    //     }
    //   };
  const {height,width}=useWindowDimensions();
  //const [isModalVisible, setIsModalVisible] = useState(false);
  const [isKakaoModalVisible, setIsKakaoModalVisible] = useState(false);
  const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isCoffeeModalVisible, setIsCoffeeModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [isNotificationListModalVisible, setIsNotificationListModalVisible] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isNotificationTimeChanged, setIsNotificationTimeChanged] = useState(false);
  const [isNotificationAdded, setIsNotificationAdded] = useState(false);

  const sortNotificationByTime = (a:any,b:any) => {
    if(a.time > b.time) return 1;
    else if(a.time < b.time) return -1;
    else return 0;
  }

  (async () => {
    await AsyncStorage.getItem('@UserInfo:notificationAllow',(err,result)=>{
        if(JSON.parse(String(result))) setIsNotificationEnabled(true);
        else setIsNotificationEnabled(false);
        console.log('notificationallowed',result);
    });
  })();
   
  

    return (
      <View style={{backgroundColor:'#FFFFFF',flex:1}}>
        <ScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        >
                <View
                  style={{
                      paddingHorizontal: 20,
                      paddingBottom: 5,
                      paddingTop: 20,
                  }}>
                  <Text>프로필</Text>
                </View>
                <ChangeProfile/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    amplitude.connectToKakaoChatBot();
                    setIsKakaoModalVisible(!isKakaoModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>채널톡 연동</Text>
                    </View>
                    <Modal isVisible={isKakaoModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsKakaoModalVisible(!isKakaoModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'80%',
                            height:'30%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057"}}>채널톡 연동은 개발 중!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#DDDDDD"}}/>
                <Divider style={{backgroundColor:"#DDDDDD"}}/>
                <View
                  style={{
                      paddingHorizontal: 20,
                      paddingBottom: 5,
                      paddingTop: 20,
                  }}>
                  <Text>앱 설정</Text>
                </View>
                <TouchableOpacity disabled={true}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>알림</Text>
                        <SwitchToggle
                          switchOn={isNotificationEnabled}
                          onPress={async () => {
                            if (Platform.OS === 'android') {
                                try {
                                    const granted = await PermissionsAndroid.request(
                                      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                                    );
                                    if(granted==='granted'){
                                        console.log(PermissionsAndroid.RESULTS.GRANTED);
                                        if(!isNotificationEnabled){
                                            AsyncStorage.setItem('@UserInfo:notificationAllow','true');
                                            setIsNotificationEnabled(!isNotificationEnabled);
                                            repository.getAllNotifications().sort(sortNotificationByTime).map((notification)=>{
                                                console.log(4,notification.time);
                                                const notificationTime = new Date();
                                                const [hour,minute]=notification.time.split(':');
                                                notificationTime.setHours(Number(hour));
                                                notificationTime.setMinutes(Number(minute));
                                                notificationTime.setSeconds(0);
                                                if(notificationTime.getTime()<=(new Date(Date.now())).getTime()) notificationTime.setDate(notificationTime.getDate()+1);
                                                PushNotification.localNotificationSchedule({
                                                    channelId: "MoodMemo_ID",
                                                    smallIcon: "ic_notification",
                                                    message: notification.time + ' 알림',
                                                    date: new Date(notificationTime), // 1 second from now
                                                    visibility: "public",
                                                    playSound: false,
                                                    id: hour+minute,
                                                    repeatType: "day",
                                                    repeatTime: "1" //하루 단위로 반복
                                                });
                                            });
                                            amplitude.notiONtoOFF();
                                            PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                console.log(result);
                                            });
                                        }
                                        else{
                                            PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                console.log(result);
                                            });
                                            AsyncStorage.setItem('@UserInfo:notificationAllow','false');
                                            setIsNotificationEnabled(!isNotificationEnabled);
                                            amplitude.notiONtoOFF();
                                            PushNotification.cancelAllLocalNotifications();
                                        }
                                    }
                                    else if(granted==='never_ask_again'){
                                        amplitude.notiONwhenPermissionDenied();
                                        setIsNotificationModalVisible(!isNotificationModalVisible);
                                        console.log(1,'denied');
                                    }
                                  } catch (error) {
                                    console.warn(error);
                                  }
                            }
                          }}
                          containerStyle={{
                            marginTop: 2,
                            width: 45,  
                            height: 25,
                            borderRadius: 25,
                            padding: 3,
                          }}
                          circleStyle={{
                            width: 20,
                            height: 20,
                            borderRadius: 20,
                          }}
                          circleColorOff='#FFFFFF'
                          circleColorOn='#FFFFFF'
                          backgroundColorOn='#00E3AD'
                          backgroundColorOff='#78788029'
                        />
                    </View>
                    <Modal isVisible={isNotificationModalVisible}
                        animationIn={"fadeIn"}
                        animationInTiming={200}
                        animationOut={"fadeOut"}
                        animationOutTiming={200}
                        onBackdropPress={() => {
                            setIsNotificationModalVisible(!isNotificationModalVisible);
                        }}
                        backdropColor='#CCCCCC'//'#FAFAFA'
                        backdropOpacity={0.8}
                        style={{
                            alignItems:'center'
                        }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'80%',
                            height:'20%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                alignItems:'center',
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057"}}>알림을 받으시려면 기기 설정에서</Text>
                                    <Text style={{fontSize: 17, color:"#495057"}}>알림 권한을 허용해주세요!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity disabled={!isNotificationEnabled}
                onPress={async () => {
                    setIsNotificationListModalVisible(!isNotificationListModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                        <Text style={{fontSize: 17, color:isNotificationEnabled ? "#495057" : "#CCCCCC"}}>알림 목록</Text>
                    </View>
                    <Modal isVisible={isNotificationListModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.outToSettingFromNotiList();
                        setIsNotificationListModalVisible(!isNotificationListModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'90%',
                            height:'60%',
                            //justifyContent:'center',
                            //alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                paddingTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                                }}>
                                    <Text style={{fontSize: 17}}>알림 목록</Text>
                            </View>
                            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                            <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                            <ScrollView
                            alwaysBounceHorizontal={false}
                            alwaysBounceVertical={false}
                            bounces={false}
                            overScrollMode="never"
                            showsVerticalScrollIndicator={true}
                            >
                                <NotificationAdd notificationAdded={isNotificationAdded} checkNotificationAdded={setIsNotificationAdded}/>
                                {
                                    repository.getAllNotifications().sort(sortNotificationByTime).map((button)=>(
                                        <NotificationView key={button.id} id={button.id} time={button.time} timeChangedProp={isNotificationTimeChanged} checkTimeChanged={setIsNotificationTimeChanged}/>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#DDDDDD"}}/>
                <Divider style={{backgroundColor:"#DDDDDD"}}/>
                <View
                  style={{
                      paddingHorizontal: 20,
                      paddingBottom: 5,
                      paddingTop: 20,
                  }}>
                  <Text>무드메모</Text>
                </View>
                <TouchableOpacity disabled={true}>
                      <View
                          style={{
                              paddingHorizontal: 20,
                              paddingBottom: 20,
                              paddingTop: 20,
                              flexDirection: 'row',
                              justifyContent: 'space-between'
                          }}>
                          <Text style={{fontSize: 17, color:"#495057"}}>버전</Text>
                          <Text style={{fontSize: 17, color:"#DBDBDB"}}>ver 1.0.0</Text>
                      </View>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    amplitude.intoGuide();
                    setIsNoticeModalVisible(!isNoticeModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>공지사항/이용 가이드</Text>
                    </View>
                    <Modal isVisible={isNoticeModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.outToSettingFromGuide();
                        setIsNoticeModalVisible(!isNoticeModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'80%',
                            height:'30%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057"}}>공지사항/이용 가이드는 개발 중!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    amplitude.intoServiceCenter();
                    setIsReportModalVisible(!isReportModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>고객센터/의견 보내기/오류 제보</Text>
                    </View>
                    <Modal isVisible={isReportModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.outToSettingFromServiceCenter();
                        setIsReportModalVisible(!isReportModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'80%',
                            height:'30%',
                            // justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                // justifyContent:'center',
                                alignItems:'center',
                                paddingHorizontal: 20,
                                justifyContent: 'space-between', // 상하로 딱 붙이기
                                }}>
                                    <Text style={{fontSize: 14, color:"#495057", paddingVertical: 10,}}>오류/의견은 언제나 환영이라무! 🥬</Text>
                                    {/* <Text style={{fontSize: 14, color:"#495057"}}>무가 귀기울여 듣겠다무!</Text> */}
                                    <View style={{ flexDirection: 'row', flex: 1,}}>
                                        <View style={styles.memoContent}>
                                            <TextInput
                                                style={{ fontSize: 12, color:"#DBDBDB",}}
                                                placeholder="운영진에게 메세지 남기기"
                                                multiline={true}
                                                // maxLength={500}
                                                onChangeText={handleMemoChange}
                                                value={memo}
                                                // numberOfLines={numberOfLines}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingVertical: 13,}}>
                                        <TouchableOpacity style={styles.confirmBtn} onPress={() => {sentryUserFeedback();}}>
                                            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600',}}>확인</Text>
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    amplitude.intoCoffee();
                    setIsCoffeeModalVisible(!isCoffeeModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>개발자에게 커피 사주기</Text>
                    </View>
                    <Modal isVisible={isCoffeeModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        amplitude.outToSettingFromCoffee();
                        setIsCoffeeModalVisible(!isCoffeeModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFAF4",
                            width:'80%',
                            height:'30%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                justifyContent:'center',
                                alignItems:'center',
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057", paddingBottom: 10,}}>카카오뱅크 ㅇㅈㅎ</Text>
                                    <Text style={{fontSize: 17, color:"#495057", paddingBottom: 10,}}>3333-27-9623079</Text>
                                    <Text style={{fontSize: 17, color:"#495057", }}>감사합니다!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    view: {
      position: 'relative',
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      flex:1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 20,
    },
    button: {
      position: 'absolute',
      bottom: 20,
      width: '90%',
      alignItems: 'center',
      backgroundColor: '#EFEFEF',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
    },
    confirmBtn: {
        alignSelf: 'center',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#72D193', 
        borderRadius: 8,
        flex: 1,
        
    },
    memoContent: { 
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'column',
        display: 'flex',
        // width: 320,
        paddingHorizontal: 16,
        paddingVertical: 10,
        // gap: 6,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // borderRadius: 6,
      },
  });

export default Settings;