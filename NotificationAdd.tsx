import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import DatePicker from 'react-native-date-picker';
import PushNotification from "react-native-push-notification";

import * as amplitude from './AmplitudeAPI';

const NotificationAdd = ({notificationAdded,checkNotificationAdded}:any) => {

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
                        <Text style={{fontSize: 17}}>+ 알림 추가</Text>
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
                        width:'90%',
                        height:'47%',
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
                                <Text style={{fontSize: 17, color:"#495057"}}>알림 추가</Text>
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
                                <TouchableOpacity onPress={()=>{
                                    amplitude.saveNewNoti();
                                    const notificationTime=String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');
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
                                            message: notificationTime+' 알림',
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
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    amplitude.cancelNewNoti();
                                    setIsModalVisible(!isModalVisible);
                                }}>
                                    <Text style={{fontSize: 17}}>취소</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
            </Modal>
            <Modal isVisible={isModalNoticeVisible}
                animationIn={"fadeIn"}
                animationInTiming={200}
                animationOut={"fadeOut"}
                animationOutTiming={200}
                onBackdropPress={() => {
                    amplitude.saveDuplicatedNoti();
                    setIsModalNoticeVisible(!isModalNoticeVisible);
                }}
                backdropColor='#CCCCCC'//'#FAFAFA'
                backdropOpacity={0.5}
                style={{
                    alignItems:'center'
                }}>
                    <View style={{
                        backgroundColor:"#FFFFFF",
                        width:'50%',
                        height:'20%',
                        justifyContent:'center',
                        alignItems:'center',
                        borderRadius:10
                        }}>
                        <Text style={{fontSize: 17}}>이미 해당 시간에</Text>
                        <Text style={{fontSize: 17}}>알림이 있어요!</Text>
                    </View>
            </Modal>
        </View>
    );
};

export default NotificationAdd;