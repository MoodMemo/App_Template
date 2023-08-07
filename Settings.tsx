import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotificationView from './NotificationView';
import NotificationAdd from './NotificationAdd';




const test = () => {
  console.log('hello');
}

const Settings = () => {

  //const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
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

  /** 
  알림 추가하는 테스트 함수입니다. 
  **/
  const connectRealmNotification = async () => {
    Realm.open({}).then((realm) => {
        console.log("Realm is located at: " + realm.path);
    });
    const deleteAll = () => {
        realm.deleteAll(); // 얘는 웬만하면 사용 안하는걸로 ..! 여기만 예외적으로 사용할 가능성이 있슴다
        console.log("delete all finished");
    };
    const createDefaultNotification = () => {
        repository.createNotification({
          day: [true, true, true, true, true, false, false],
          time: "09:00"
        });
        repository.createNotification({
          day: [true, true, true, true, true, true, true],
          time: "13:00"
        });
        repository.createNotification({
          day: [true, true, true, true, true, true, true],
          time: "19:00"
        });
        repository.createNotification({
          day: [true, true, true, true, true, true, true],
          time: "22:15"
        });
        console.log("create default notification finished");
      };
      realm.write(() => {
        deleteAll();
        createDefaultNotification();
      });
      
      console.log("** create default data finished");
      console.log(repository.getAllNotifications().length);
  }

  (async () => {
    await AsyncStorage.getItem("isNotificationAllowed",(err,result)=>{
        if(JSON.parse(String(result))) setIsNotificationEnabled(true);
        else setIsNotificationEnabled(false);
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
            <TouchableOpacity>
                <View
                  style={{
                      paddingHorizontal: 20,
                      paddingBottom: 5,
                      paddingTop: 20,
                  }}>
                  <Text>프로필</Text>
                </View>
            </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIsProfileModalVisible(!isProfileModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>프로필 설정 변경</Text>
                    </View>
                    <Modal isVisible={isProfileModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsProfileModalVisible(!isProfileModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFFFF",
                            width:'80%',
                            height:'50%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057"}}>프로필 설정 변경은 개발 중!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
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
                            backgroundColor:"#FFFFFF",
                            width:'80%',
                            height:'50%',
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
                                    if(granted===PermissionsAndroid.RESULTS.GRANTED){
                                        console.log(PermissionsAndroid.RESULTS.GRANTED);
                                        if(!isNotificationEnabled){
                                            AsyncStorage.setItem('isNotificationAllowed','true');
                                            setIsNotificationEnabled(!isNotificationEnabled);
                                            repository.getAllNotifications().sort(sortNotificationByTime).map((notification)=>{
                                                const notificationTime = new Date();
                                                const [hour,minute]=notification.time.split(':');
                                                notificationTime.setHours(Number(hour));
                                                notificationTime.setMinutes(Number(minute));
                                                notificationTime.setSeconds(0);
                                                if(notificationTime.getTime()<=(new Date(Date.now())).getTime()) notificationTime.setDate(notificationTime.getDate()+1);
                                                PushNotification.localNotificationSchedule({
                                                    channelId: "MoodMemo_ID",
                                                    message: notification.time + ' Notification',
                                                    date: new Date(notificationTime), // 1 second from now
                                                    visibility: "public",
                                                    playSound: false,
                                                    id: hour+minute
                                                });
                                            })
                                            PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                console.log(result);
                                            });
                                        }
                                        else{
                                            PushNotification.getScheduledLocalNotifications((result:any)=>{
                                                console.log(result);
                                            });
                                            AsyncStorage.setItem('isNotificationAllowed','false');
                                            setIsNotificationEnabled(!isNotificationEnabled);
                                            PushNotification.cancelAllLocalNotifications();
                                        }
                                    }
                                    else if(granted==='never_ask_again'){
                                        setIsNotificationModalVisible(!isNotificationModalVisible);
                                        console.log('denied');
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
                            backgroundColor:"#FFFFFF",
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
                    await connectRealmNotification();
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
                        setIsNotificationListModalVisible(!isNotificationListModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFFFF",
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
                          <Text style={{fontSize: 17, color:"#DBDBDB"}}>ver 0.1</Text>
                      </View>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
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
                        setIsNoticeModalVisible(!isNoticeModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFFFF",
                            width:'80%',
                            height:'50%',
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
                        setIsReportModalVisible(!isReportModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFFFF",
                            width:'80%',
                            height:'50%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057"}}>고객센터/의견 보내기/오류 제보는 개발 중!</Text>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
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
                        setIsCoffeeModalVisible(!isCoffeeModalVisible);
                    }}
                    backdropColor='#CCCCCC'//'#FAFAFA'
                    backdropOpacity={0.8}
                    style={{
                        alignItems:'center'
                    }}>
                        <View style={{
                            backgroundColor:"#FFFFFF",
                            width:'80%',
                            height:'50%',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:10
                        }}>
                            <View style={{
                                }}>
                                    <Text style={{fontSize: 17, color:"#495057"}}>나 커피 못 마셔</Text>
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
  });

export default Settings;