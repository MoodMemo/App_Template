import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from "react-native-push-notification";
import DatePicker from 'react-native-date-picker';
import Modal from "react-native-modal";
import { Divider } from 'react-native-paper';

import Main from './Main'

async function saveUserInfo_toAsyncStorage(userName:any, birthday:any, job:any) {
  const createUser = async (userName:any, birthday:any, job:any) => {
    try {
      await AsyncStorage.setItem('@UserInfo:isRegistered', 'true');
      await AsyncStorage.setItem('@UserInfo:userName', userName);
      await AsyncStorage.setItem('@UserInfo:birth', birthday);
      await AsyncStorage.setItem('@UserInfo:birthShow', birthday);
      await AsyncStorage.setItem('@UserInfo:job', job);
      await AsyncStorage.setItem('@UserInfo:notificationAllow', 'true');
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



const AnimatedViewBirthday = () => {
  const [section, setSection] = useState('start');
  const [showingBirthday,setShowingBirthday] = useState('NNNN/NN/NN');
  const [birthday, setBirthday] = useState(new Date());
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

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
            message: notification.time + ' Notification',
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
        setSection('name');
    }
    else if (section === 'name') {
      console.log('Selected name:', name);
      setSection('birthday');
    }
    else if (section === 'birthday') {
        console.log('Selected birthday:', birthday);
        setSection('job');
    } else {
      // Handle completion or other actions when occupation is entered
      if (Platform.OS === 'android') {
          try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
                if(granted===PermissionsAndroid.RESULTS.GRANTED){
                  saveUserInfo_toAsyncStorage(name, showingBirthday, job);
                  connectRealmNotification();
                }
              } catch (error) {
              }
      console.log('Selected job:', job);
      setSection('main');
    };
  };
};

  return (
    <>
        {section === 'start' ? (
          <View style={styles.view}>
            <View style={{justifyContent: 'center',
            alignItems: 'center',
            flex:1}}>
              <Text style={styles.title}>나에 대한 정보를</Text>
              <Text style={styles.title}>입력해 맞춤형 AI 일기를</Text>
              <Text style={styles.title}>받아 보세요.</Text>
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (section === 'birthday' ? (
          <View style={styles.view}>
            <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:5,
                marginTop:50,
                width: '80%',
                backgroundColor:"#FAFAFA",
                marginLeft:'10%',
                borderRadius:5,
              }}/>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:5,
                marginTop:50,
                width: '40%',
                backgroundColor:"#72D193",
                marginLeft:'10%',
                borderRadius:5,
              }}/>
            <View style={{justifyContent: 'center',
            alignItems: 'center',
            flex:1}}>
              <Text style={styles.title}>내 생일은</Text>
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
                      alignItems:'center'
                  }}>
                  <View style={{
                        backgroundColor:"#FFFFFF",
                        width:'100%',
                        height:'47%',
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                        paddingTop: 20,
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
                          mode='date'/>
                      </View>
                      <TouchableOpacity style={{alignItems:'center',}}
                      onPress={()=>{
                        setShowingBirthday(formatDate(birthday));
                        setIsDatePickerVisible(!isDatePickerVisible);
                      }}>
                        <Text style={{paddingTop: 20, fontSize: 17,}}>저장</Text>
                      </TouchableOpacity>  
                  </View>     
              </Modal>
              <TouchableOpacity onPress={() => {setIsDatePickerVisible(!isDatePickerVisible)}}>
                <Text style={{fontSize:25, color: '#E2E2E2'}}>{showingBirthday}</Text>
              </TouchableOpacity>
              <Divider style={{backgroundColor:"#000000",width:'50%',marginHorizontal:'5%'}}/>
              <Divider style={{backgroundColor:"#000000",width:'50%',marginHorizontal:'5%'}}/>
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (section === 'job' ? (
          <View style={styles.view}>
            <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:5,
                marginTop:50,
                width: '80%',
                backgroundColor:"#FAFAFA",
                marginLeft:'10%',
                borderRadius:5,
              }}/>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:5,
                marginTop:50,
                width: '80%',
                backgroundColor:"#72D193",
                marginLeft:'10%',
                borderRadius:5,
              }}/>
            <View style={{justifyContent: 'center',
            alignItems: 'center',
            flex:1}}>
              <Text style={styles.title}>내 직업은</Text>
                <TextInput
                  style={styles.input}
                  placeholder="디자이너"
                  placeholderTextColor='#E2E2E2'
                  onChangeText={(text) => setJob(text)}
                />
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (section === 'name' ? (
          <View style={styles.view}>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:5,
                marginTop:50,
                width: '80%',
                backgroundColor:"#FAFAFA",
                marginLeft:'10%',
                borderRadius:5,
              }}/>
              <Divider style={{
                position: 'absolute',
                top: 0,
                paddingTop:5,
                marginTop:50,
                width: '15%',
                backgroundColor:"#72D193",
                marginLeft:'10%',
                borderRadius:5,
              }}/>
            <View style={{justifyContent: 'center',
            alignItems: 'center',
            flex:1}}>
              <Text style={styles.title}>내 이름은</Text>
              <TextInput
                style={styles.input}
                placeholder="홍길동"
                placeholderTextColor='#E2E2E2'
                onChangeText={(text) => setName(text)}
              />
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>{(section === 'name') || (section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Main/> // 새로운 정보가 추가되면 이 부분 수정해주시고, Main.tsx도 수정해주세요! (주석처리된 부분)
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
    fontSize:25,
    color: '#E2E2E2',
    textAlign: 'center',
    width: '40%',
    padding: 10,
    marginBottom: 20,
    borderBottomWidth:1,
    borderBottomColor:'#E2E2E2',
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

export default AnimatedViewBirthday;