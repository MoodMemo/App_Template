import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import DatePicker from 'react-native-date-picker';
import PushNotification from "react-native-push-notification";

import * as amplitude from './AmplitudeAPI';

import {default as Text} from "./CustomText"

import NotificationAddSave from './NotificationAddSave';

function getRandomInt(min:any, max:any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const NotificationAdd = ({notificationAdded,checkNotificationAdded}:any) => {

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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isModalNoticeVisible, setIsModalNoticeVisible] = useState(false);
    //console.log(time);
    //date.setHours(hour);
    //date.setMinutes(minute);
    return (
        <View>
            <TouchableOpacity onPress={() => {
                    amplitude.intoAddNewNoti();
                    setIsModalVisible(!isModalVisible);
                }}>
                <View style={{
                    paddingHorizontal: 35,
                    paddingBottom: 20,
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                    }}>
                        <Text style={{fontSize: 19}}>+ 알림 추가</Text>
                </View>
            </TouchableOpacity>
            <Modal isVisible={isModalVisible}
                animationIn={"fadeIn"}
                animationInTiming={200}
                animationOut={"fadeOut"}
                animationOutTiming={200}
                onBackdropPress={() => {
                    amplitude.cancelNewNoti();
                    setIsModalVisible(!isModalVisible);
                }}
                backdropColor='#CCCCCC'//'#FAFAFA'
                backdropOpacity={0.8}
                style={{
                    alignItems:'center'
                }}>
                    <View style={{
                        backgroundColor:"#FFFFFF",
                        width:340,
                        height:(Platform.OS==='android' ? 340 : 370),
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                        paddingTop: 20,
                        //justifyContent:'center',
                        //alignItems:'center',
                        borderRadius:10
                        }}>
                        <View style={{
                            paddingBottom: '10%',
                            }}>
                                <Text style={{fontSize: 19, color:"#495057"}}>알림 추가</Text>
                        </View>
                        <View style={{
                            paddingBottom: 10,
                            alignItems:'center',
                            }}>
                            <DatePicker date={date} onDateChange={(changedDate) => {
                            setDate(changedDate);
                            }} mode="time"
                            theme="light"/>
                        </View>
                        <View style={{
                            paddingHorizontal: "15%",
                            padding:'8%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                            }}>
                                {/* <TouchableOpacity onPress={()=>{
                                    const notificationTime=String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');
                                    console.log(notificationTime);
                                    console.log("**********");
                                    amplitude.saveNewNoti(notificationTime);
                                    if(repository.getNotificationsByField("time",notificationTime)===undefined){
                                        realm.write(() => {repository.createNotification({
                                            day: [true, true, true, true, true, false, false],
                                            time: notificationTime
                                          });});
                                        //console.log(changedDate);
                                        console.log(date);
                                        if(date.getTime()<=(new Date(Date.now())).getTime()) date.setDate(date.getDate()+1);
                                        PushNotification.localNotificationSchedule({
                                            channelId: "MoodMemo_ID",
                                            smallIcon: "ic_notification",
                                            message: generateNotificationMessage(date),
                                            date: date, //입력 받은 시간으로 알림 설정
                                            visibility: "public",
                                            playSound: false,
                                            id: String(date.getHours()).padStart(2,'0')+String(date.getMinutes()).padStart(2,'0'), //알림의 id는 0000 형식, 앞의 두 개는 시간, 뒤의 두 개는 분임, 시간이 겹치는 알림은 존재하지 않도록 알림 생성 이전에 처리함.
                                            repeatType: "day",
                                            repeatTime: "1" //하루 단위로 반복
                                          });
                                        checkNotificationAdded(!notificationAdded);//알림 추가 시 알림 목록 모달 리렌더링
                                        console.log(repository.getAllNotifications());
                                        setIsModalVisible(!isModalVisible);//저장 눌렀으면 모달이 꺼지도록
                                    }
                                    else{
                                        setIsModalNoticeVisible(!isModalNoticeVisible);
                                    }
                                }}>
                                    <Text style={{fontSize: 17}}>저장</Text>
                                </TouchableOpacity> */}
                                <NotificationAddSave date={date} checkNotificationAdded={checkNotificationAdded} notificationAdded={notificationAdded} setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible}/>
                                <TouchableOpacity onPress={()=>{
                                    amplitude.cancelNewNoti();
                                    setIsModalVisible(!isModalVisible);
                                }}>
                                    <Text style={{fontSize: 19}}>취소</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
            </Modal>
        </View>
    );
};

export default NotificationAdd;