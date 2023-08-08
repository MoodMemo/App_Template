import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import DatePicker from 'react-native-date-picker';
import PushNotification from "react-native-push-notification";

const NotificationView = ({id,time,timeChangedProp,checkTimeChanged}:any) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isModalNoticeVisible, setIsModalNoticeVisible] = useState(false);
    //console.log(time);
    var [hour, minute] = time.split(':');
    console.log(hour,minute);
    return (
        <View>
            <Divider style={{backgroundColor:"#EAEAEA",width:'80%',marginHorizontal:'10%'}}/>
            <Divider style={{backgroundColor:"#EAEAEA",width:'80%',marginHorizontal:'10%'}}/>
            <Divider style={{backgroundColor:"#EAEAEA",width:'80%',marginHorizontal:'10%'}}/>
            <TouchableOpacity onPress={() => {
                    date.setHours(hour);
                    date.setMinutes(minute);
                    setIsModalVisible(!isModalVisible);
                }}>
                <View style={{
                    paddingHorizontal: 35,
                    paddingBottom: 20,
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                    }}>
                        <Text style={{fontSize: 17}}>{time}</Text>
                </View>
            </TouchableOpacity>
            <Modal isVisible={isModalVisible}
                animationIn={"fadeIn"}
                animationInTiming={200}
                animationOut={"fadeOut"}
                animationOutTiming={200}
                onBackdropPress={() => {
                    setIsModalVisible(!isModalVisible);
                }}
                backdropColor='#CCCCCC'//'#FAFAFA'
                backdropOpacity={0.8}
                style={{
                    alignItems:'center'
                }}>
                    <View style={{
                        backgroundColor:"#FFFFFF",
                        width:'85%',
                        height:'45%',
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
                                <Text style={{fontSize: 17, color:"#495057"}}>알림 수정</Text>
                        </View>
                        <View style={{
                            paddingBottom: 20,
                            alignItems:'center',
                            }}>
                            <DatePicker date={date} onDateChange={(changedDate) => {
                            setDate(changedDate);
                            }} mode="time"/>
                        </View>
                        <View style={{
                            paddingHorizontal: "20%",
                            paddingBottom: 20,
                            paddingTop: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                            }}>
                                <TouchableOpacity onPress={()=>{
                                    const notificationTime=String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');
                                    if(notificationTime===time){
                                        setIsModalVisible(!isModalVisible);
                                    }
                                    else if(repository.getNotificationsByField("time",notificationTime)===undefined){
                                        repository.updateNotificationById(id,{time:notificationTime});
                                        PushNotification.cancelLocalNotification(hour+minute);
                                        //console.log(changedDate);
                                        console.log(date);
                                        if(date.getTime()<=(new Date(Date.now())).getTime()) date.setDate(date.getDate()+1);
                                        PushNotification.localNotificationSchedule({
                                            channelId: "MoodMemo_ID",
                                            message: notificationTime+" 알림",
                                            date: date, //입력 받은 시간으로 알림 설정
                                            visibility: "public",
                                            playSound: false,
                                            id: String(date.getHours()).padStart(2,'0')+String(date.getMinutes()).padStart(2,'0'), //알림의 id는 0000 형식, 앞의 두 개는 시간, 뒤의 두 개는 분임, 시간이 겹치는 알림은 존재하지 않도록 알림 생성 이전에 처리함.
                                            repeatType: "day",
                                            repeatTime: "1" //하루 단위로 반복
                                        });
                                        PushNotification.getScheduledLocalNotifications((result:any)=>{
                                            console.log(result);
                                        });
                                        checkTimeChanged(!timeChangedProp);
                                        setIsModalVisible(!isModalVisible);
                                    }
                                    else{
                                        setIsModalNoticeVisible(!isModalNoticeVisible);
                                    }
                                    //console.log(changedDate);
                                    //console.log(repository.getAllNotifications());
                                    }}>
                                    <Text style={{fontSize: 17}}>저장</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    realm.write(() => {repository.deleteNotification(repository.getNotificationsByField("id",id));});
                                    PushNotification.cancelLocalNotification(hour+minute);
                                    checkTimeChanged(!timeChangedProp);
                                    setIsModalVisible(!isModalVisible);
                                    PushNotification.getScheduledLocalNotifications((result:any)=>{
                                        console.log(result);
                                    });
                                }}>
                                    <Text style={{fontSize: 17, color:"#FF0000"}}>삭제</Text>
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

export default NotificationView;