import React, { useState } from 'react';
import { Dimensions, Image, View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import { Divider } from 'react-native-paper';

import Main from './Main'

import * as amplitude from './AmplitudeAPI';

import {default as Text} from "./CustomText"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function saveUserInfo_toAsyncStorage(userName:any, birthday:any, job:any) {
  const createUser = async (userName:any, birthday:any, job:any) => {
    try {
      await AsyncStorage.setItem('@UserInfo:isRegistered', 'true');
      await AsyncStorage.setItem('@UserInfo:userName', userName);
      await AsyncStorage.setItem('@UserInfo:birth', birthday);
      await AsyncStorage.setItem('@UserInfo:birthShow', birthday);
      await AsyncStorage.setItem('@UserInfo:job', job);
      //await AsyncStorage.setItem('@UserInfo:notificationAllow', 'true');
      await AsyncStorage.setItem('@UserInfo:registerDate', new Date().toString());
      // await AsyncStorage.setItem('@UserInfo:progressedDate', progressedDate); -> 얘는 나중에 스탬프 찍으면 업데이트
      console.log("create user finished");
    } catch (e) {
      console.log('Error saving data:', e);
    }
  }
  const getUser = async () => {
    try {
      const isRegistered = await AsyncStorage.getItem('@UserInfo:isRegistered');
      if (isRegistered !== null) {
        // value previously stored
        console.log("isRegistered: " + isRegistered);
      }
      const name = await AsyncStorage.getItem('@UserInfo:userName');
      if (isRegistered !== null) {
        // value previously stored
        console.log("userName: " + name);
      }
      const birth = await AsyncStorage.getItem('@UserInfo:birth');
      if (birth !== null) {
        // value previously stored
        console.log("birth: " + birth);
      }
      const job = await AsyncStorage.getItem('@UserInfo:job');
      if (job !== null) {
        // value previously stored
        console.log("job: " + job);
      }
      const registerDate = await AsyncStorage.getItem('@UserInfo:registerDate');
      if (registerDate !== null) {
        // value previously stored
        console.log("registerDate: " + registerDate);
      }
    } catch (e) {
      // error reading value
      console.log("error reading value");
    }
  }
  createUser(userName, birthday, job);
  getUser();
}

async function test_realm_ver4() {
  Realm.open({}).then((realm) => {
      console.log("Realm is located at: " + realm.path);
  });

  const deleteAll = () => {
    realm.deleteAll(); // 얘는 웬만하면 사용 안하는걸로 ..! 여기만 예외적으로 사용할 가능성이 있슴다
    console.log("delete all finished"); 
  }
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
      time: "23:00"
    });
    console.log("create default notification finished");
  }
  const createDefaultCustomStamp = () => {
    repository.createCustomStamp({
      stampName: "기쁨",
      emoji: "😆"
    });
    repository.createCustomStamp({
      stampName: "슬픔",
      emoji: "😭"
    });
    repository.createCustomStamp({
      stampName: "짜증",
      emoji: "😡"
    });
    repository.createCustomStamp({
      stampName: "평온",
      emoji: "🙂"
    });
    repository.createCustomStamp({
      stampName: "피곤",
      emoji: "😴"
    });
    console.log("create default custom stamp finished");
  }
  const createDefaultPushedStamp = () => {
    repository.createPushedStamp({
      dateTime: new Date(),
      stampName: "기쁨",
      emoji: "😆",
      memo: "기쁨 스탬프 눌렀다무",
      imageUrl: "이미지는 안넣었다무"
    });
    repository.createPushedStamp({
      dateTime: new Date("2021-08-03 09:00:00"),
      stampName: "슬픔",
      emoji: "😭",
      memo: "슬픔 스탬프 눌렀다무",
      imageUrl: "이미지는 안넣었다무"
    });
    console.log("create default pushed stamp finished");
  }
  const createPushedStampDocument = () => {
    repository.createPushedStamp({});
    console.log("create pushed stamp document finished");
  }
  const createDefaultDailyReport = () => {
    repository.createDailyReport({
      date: "2023-08-03",
      title: "테스트 일기랍니다",
      bodytext: "테스트 일기 내용입니다",
      keyword: ["소마", "희희하하", "무드메모"]
    });
    console.log("create default daily report finished");
  }
  const createDailyReportDocument = () => {
    repository.createDailyReport({});
    console.log("create daily report document finished");
  }

  realm.write(() => {
    //deleteAll();
    //createDefaultNotification();
    createDefaultCustomStamp();
    // createDefaultPushedStamp();
    // createDefaultDailyReport();
    // createPushedStampDocument();
    // createDailyReportDocument();
  });
  console.log("** create default data finished");
}

function getRandomInt(min:any, max:any) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const AnimatedViewBirthday = () => {
  const [section, setSection] = useState('start');
  const [showingBirthday,setShowingBirthday] = useState('NNNN/NN/NN');
  const [birthday, setBirthday] = useState(new Date());
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const generateNotificationMessage = (notificationTime:Date) => {
    const notificationHour=notificationTime.getHours();
    if(0<=notificationHour && notificationHour<8){
        const messageList=['안 자고 모하냐무👀','잠은 안 오냐무? 나는 슬슬 졸리다무💤', '새벽까지 할 게 많냐무...!? 화이팅이다무💪'];
        return messageList[getRandomInt(0,3)];
    }
    else if(8<=notificationHour && notificationHour<12){
        const messageList=['굿모닝이다무☀ 날씨를 보니 기분이 어떻냐무?!', '굿모닝이다무☀ 잠은 잘 자고 일어났냐무?'];
        return messageList[getRandomInt(0,2)];
    }
    else if (12<=notificationHour && notificationHour<14){
        return '점심은 맛있게 먹었는지 궁금하다무! 누구랑 뭘 먹었냐무?🍚';
    }
    else if(14<=notificationHour && notificationHour<18){
        return '오늘 하루가 곧 끝나간다무! 지금 뭘 하고 있는지 들려달라무🌈';
    }
    else if(18<=notificationHour && notificationHour<20){
        return '맛있는 저녁밥 먹었냐무? 배고프다무🍽';
    }
    else if(20<=notificationHour && notificationHour<22){
        return '오늘은 어떤 하루였는지 궁금하다무🌙';
    }
    else{
        return '일기를 만들어주겠다무🕶 어서 들어와보라무!';
    }
  }

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
          time: "21:00"
        });
        console.log("create default notification finished");
      };
      realm.write(() => {
        deleteAll();
        createDefaultNotification();
      });
      repository.getAllNotifications().map((notification)=>{
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
            message: generateNotificationMessage(notificationTime),
            date: new Date(notificationTime), // 1 second from now
            visibility: "public",
            playSound: false,
            id: hour+minute,
            repeatType: "day",
            repeatTime: "1" //하루 단위로 반복
        });
      });
      PushNotification.getScheduledLocalNotifications((result:any)=>{
          console.log(result);
      });
      console.log("** create default data finished");
      console.log(repository.getAllNotifications().length);
  }

  const formatDate = (rawDate:Date) => {
    let date = new Date(rawDate);
    return `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')}`
  }

  const handleNext = async () => {
    if (section === 'start') {
        // amplitude.userRegiStart();
        setSection('name');
    }
    else if (section === 'name') {
      if(name===''){
        setIsWarningVisible(true);
      }
      else{
        setIsWarningVisible(false);
        console.log('Selected name:', name);
        setSection('birthday');
      }
    }
    else if (section === 'birthday') {
      if(showingBirthday==='NNNN/NN/NN'){
        setIsWarningVisible(true);
      }
      else{
        setIsWarningVisible(false);
        console.log('Selected birthday:', birthday);
        setSection('job');
      }
    }
    else {
      if(job===''){
        setIsWarningVisible(true);
      }
      else {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
            if(granted===PermissionsAndroid.RESULTS.GRANTED){
              AsyncStorage.setItem('@UserInfo:notificationAllow','true');
              console.log(1);
              connectRealmNotification();
              setSection('main');
            }
            else{
              AsyncStorage.setItem('@UserInfo:notificationAllow','false');
              setSection('main');
            }
            console.log(granted);
            saveUserInfo_toAsyncStorage(name, showingBirthday, job);
            test_realm_ver4();
          }
          catch (error) {
            setSection('main');
          }
        }
        else if (Platform.OS === 'ios') {
          PushNotificationIOS.requestPermissions().then(data => {
            if (data.alert || data.badge || data.sound) {
              AsyncStorage.setItem('@UserInfo:notificationAllow', 'true');
              connectRealmNotification();
            } else {
              AsyncStorage.setItem('@UserInfo:notificationAllow', 'false');
            }
            // 다른 iOS 관련 코드 (예: 사용자 정보 저장)
            saveUserInfo_toAsyncStorage(name, showingBirthday, job);
            test_realm_ver4();
            setSection('main');
          }).catch(error => {
            console.error('Notification permission error:', error);
            setSection('main');
          });
        }
        console.log('Selected job:', job);
      }
    };
  }

  return (
    <>
        {section === 'start' ? (
          <View style={styles.view}>
            <View style={{justifyContent: 'center',
            flex:1}}>
              <Image 
                source={require('./assets/colorMooMedium.png')}
                style={{ width: 123, height: (123 * 131) / 123 , position: 'relative', bottom: '14%', left: windowWidth-160, overflow: 'hidden'}}></Image>
              <View style={{
                position:'relative',
                bottom:'12%'
              }}>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>어서와라<Text style={{
                  fontSize: 24,
                  color:"#FCD49B",
                }}>무</Text></Text>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>나는 '무드메모'의 요정,</Text>
                <Text style={{
                  fontSize: 32,
                  fontWeight:'bold',
                  color:"#72D193",
                  marginLeft: '5%'
                }}>무(Moo)</Text>
              </View>
              <View style={{
                position:'relative',
                bottom:'8%'
              }}>
                <Text style={{
                  fontSize: 18,
                  color:"#212429",
                  marginLeft: '5%'
                }}>이제부터 나를 따라와라무!</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={()=>{
                handleNext();
                amplitude.userRegiStart();
              }}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '완료'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (section === 'birthday' ? (
          <View style={styles.view}>
            <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:3,
                marginTop:50,
                width: '90%',
                backgroundColor:"#FAFAFA",
                marginLeft:'5%',
                borderRadius:5,
              }}/>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:3,
                marginTop:50,
                width:'50%',
                backgroundColor:"#72D193",
                marginLeft:'5%',
                borderRadius:5,
              }}/>
            <View style={{justifyContent: 'center',
            flex:1}}>
              <View style={{
                position:'relative',
                bottom:'6%'
              }}>
                <Text style={{
                    fontSize: 24,
                    color:"#212429",
                    marginLeft: '5%'
                  }}>생일을 입력해달라<Text style={{
                    fontSize: 24,
                    color:"#FCD49B",
                  }}>무</Text></Text>
                <TouchableOpacity onPress={() => {setIsDatePickerVisible(!isDatePickerVisible)}}>
                  <Text style={{fontSize:25, marginLeft: '5%', paddingTop:20, color: '#E2E2E2'}}>{showingBirthday}</Text>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#000000",width:'50%',marginLeft:'5%'}}/>
              </View>
              <Modal isVisible={isDatePickerVisible}
                  animationIn={"fadeIn"}
                  animationInTiming={200}
                  animationOut={"fadeOut"}
                  animationOutTiming={200}
                  onBackdropPress={() => {
                      setIsDatePickerVisible(!isDatePickerVisible);
                  }}
                  backdropColor='#CCCCCC'//'#FAFAFA'
                  backdropOpacity={0.8}
                  style={{
                      alignItems:'center',
                  }}>
                  <View style={{
                        backgroundColor:"#FFFFFF",
                        width:340,
                        height:(Platform.OS==='android' ? 340 : 370),
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                        paddingTop: 20,
                        justifyContent:'space-between',
                        //justifyContent:'center',
                        //alignItems:'center',
                        borderRadius:10
                        }}>
                      <View style={{
                          paddingBottom: 20,
                          }}>
                              <Text style={{fontSize: 17, color:"#495057"}}>생일 입력</Text>
                      </View>
                      <View style={{
                          paddingBottom: 20,
                          alignItems:'center',
                          }}>
                          <DatePicker date={birthday}
                          onDateChange={(changedDate) => {
                              setBirthday(changedDate);}}
                          mode='date'
                          theme='light'/>
                      </View>
                      <TouchableOpacity style={{alignItems:'center',}}
                      onPress={()=>{
                        setShowingBirthday(formatDate(birthday));
                        setIsDatePickerVisible(!isDatePickerVisible);
                      }}>
                        <Text style={{paddingTop: 20, fontSize: 17, marginBottom: 10}}>저장</Text>
                      </TouchableOpacity>  
                  </View>     
              </Modal>
              {isWarningVisible &&
              <View style={styles.warning}>
                <Text style={{color: '#FF7168', fontSize: 16,}}>입력은 필수다무!</Text>
              </View>}
              <TouchableOpacity style={styles.button} onPress={()=>{
                handleNext();
                amplitude.userRegiBirthday(birthday.toDateString());
              }}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '완료'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (section === 'job' ? (
          <View style={styles.view}>
            <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:3,
                marginTop:50,
                width:'90%',
                backgroundColor:"#72D193",
                marginLeft:'5%',
                borderRadius:5,
              }}/>
            <View style={{justifyContent: 'center',
            flex:1}}>
              <View style={{
                position:'relative',
                bottom:'6%'
              }}>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>직업을 알려달라<Text style={{
                  fontSize: 24,
                  color:"#FCD49B",
                }}>무</Text></Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="10자 이내 입력"
                placeholderTextColor='#DBDBDB'
                onChangeText={(text) => setJob(text)}
              />
              {isWarningVisible && 
              <View style={styles.warning}>
                <Text style={{color: '#FF7168', fontSize: 16, }}>입력은 필수다무!</Text>
              </View>}
              <TouchableOpacity style={styles.button} onPress={()=>{
                handleNext();
                amplitude.userRegiJob_Fin(job);
              }}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '완료'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (section === 'name' ? (
          <View style={styles.view}>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:3,
                marginTop:50,
                width: '90%',
                backgroundColor:"#FAFAFA",
                marginLeft:'5%',
                borderRadius:5,
              }}/>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:3,
                marginTop:50,
                width:'15%',
                backgroundColor:"#72D193",
                marginLeft:'5%',
                borderRadius:5,
              }}/>
            <View style={{justifyContent: 'center',
            flex:1}}>
              <View style={{
                position:'relative',
                bottom:'6%'
              }}>
                <Text style={{
                  fontSize: 24,
                  color:"#212429",
                  marginLeft: '5%'
                }}>무가 불러줄 이름을 말해달라<Text style={{
                  fontSize: 24,
                  color:"#FCD49B",
                }}>무</Text></Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="10자 이내 입력"
                placeholderTextColor='#DBDBDB'
                onChangeText={(text) => setName(text)}
              />
              {isWarningVisible &&
              <View style={styles.warning}>
                <Text style={{color: '#FF7168', fontSize: 16,}}>입력은 필수다무!</Text>
              </View>}
              <TouchableOpacity style={styles.button} onPress={() => {
                handleNext();
                amplitude.userRegiName(name);
              }}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '완료'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Main username={name}/> // 새로운 정보가 추가되면 이 부분 수정해주시고, Main.tsx도 수정해주세요! (주석처리된 부분)
        ))))}
    </>
  );
};


const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    paddingTop:5,
    marginTop:50,
    width: '90%',
    backgroundColor:"#EAEAEA",
    marginHorizontal:'5%'
  },
  container: {
    flex: 1,
  },
  view: {
    position: 'relative',
    backgroundColor: '#ffffff',

    flex:1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 15
  },
  input: {
    position:'relative',
    bottom:'3%',
    fontSize:18,
    color: '#000000',
    width: '90%',
    marginLeft: '5%',
    padding: 10,
    marginBottom: 20,
    borderWidth:1,
    borderRadius: 10,
    borderColor:'#F0F0F0',
    marginHorizontal:16
  },
  button: {
    position: 'absolute',
    bottom: '3%',
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#72D193',
    borderRadius: 7,
    marginHorizontal:'5%'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  warning: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    alignItems: 'center',
    transform:[{translateX:-50}]
  },
});

export default AnimatedViewBirthday;