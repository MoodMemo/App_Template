import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";

import SettingsComponent from './SettingsComponent';


const test = () => {
  console.log('hello');
}


const Settings = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

    const settingsOptions=[
      {title:"채널톡 연동", onPress: test},
      {title:"개인정보 설정", onPress: () => {}},
      {title:"알림 설정", onPress: () => {}},
      {title:"개발자에게 문의하기", onPress: () => {}},
      {title:"개발자에게 커피 사주기", onPress: () => {}},
    ]
    return (
      <View style={{backgroundColor:'#FFFFFF',flex:1}}>
        <ScrollView>
                <View
                  style={{
                      paddingHorizontal: 20,
                      paddingBottom: 5,
                      paddingTop: 20,
                  }}>
                  <Text>프로필</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>프로필 설정 변경</Text>
                    </View>
                    <Modal isVisible={isModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsModalVisible(!isModalVisible);
                    }}
                    backdropColor='#ADADAD'
                    backdropOpacity={0.1}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            width: '80%',
                            }}>
                            <Text>I am the modal content!</Text>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>채널톡 연동</Text>
                    </View>
                    <Modal isVisible={isModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsModalVisible(!isModalVisible);
                    }}
                    backdropColor='#ADADAD'
                    backdropOpacity={0.1}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            width: '80%',
                            }}>
                            <Text>I am the modal content!</Text>
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
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>알림</Text>
                    </View>
                    <Modal isVisible={isModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsModalVisible(!isModalVisible);
                    }}
                    backdropColor='#ADADAD'
                    backdropOpacity={0.1}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            width: '80%',
                            }}>
                            <Text>I am the modal content!</Text>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                      setIsModalVisible(!isModalVisible);
                      }}>
                      <View
                          style={{
                              paddingHorizontal: 20,
                              paddingBottom: 20,
                              paddingTop: 20,
                              flexDirection: 'row',
                              justifyContent: 'space-between'
                          }}>
                          <Text style={{fontSize: 17, color:"#495057"}}>버전</Text>
                          <Text style={{fontSize: 17, color:"#DBDBDB"}}>ver 1.0</Text>
                      </View>
                      <Modal isVisible={isModalVisible}
                      animationIn={"fadeIn"}
                      animationInTiming={200}
                      animationOut={"fadeOut"}
                      animationOutTiming={200}
                      onBackdropPress={() => {
                          setIsModalVisible(!isModalVisible);
                      }}
                      backdropColor='#ADADAD'
                      backdropOpacity={0.1}>
                          <View style={{
                              flex: 1,
                              backgroundColor: "#FFFFFF",
                              width: '80%',
                              }}>
                              <Text>I am the modal content!</Text>
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
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>공지사항/이용 가이드</Text>
                    </View>
                    <Modal isVisible={isModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsModalVisible(!isModalVisible);
                    }}
                    backdropColor='#ADADAD'
                    backdropOpacity={0.1}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            width: '80%',
                            }}>
                            <Text>I am the modal content!</Text>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>고객센터/의견 보내기/오류 제보</Text>
                    </View>
                    <Modal isVisible={isModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsModalVisible(!isModalVisible);
                    }}
                    backdropColor='#ADADAD'
                    backdropOpacity={0.1}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            width: '80%',
                            }}>
                            <Text>I am the modal content!</Text>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    }}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            paddingTop: 20,
                        }}>
                        <Text style={{fontSize: 17, color:"#495057"}}>개발자에게 커피 사주기</Text>
                    </View>
                    <Modal isVisible={isModalVisible}
                    animationIn={"fadeIn"}
                    animationInTiming={200}
                    animationOut={"fadeOut"}
                    animationOutTiming={200}
                    onBackdropPress={() => {
                        setIsModalVisible(!isModalVisible);
                    }}
                    backdropColor='#ADADAD'
                    backdropOpacity={0.1}>
                        <View style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            width: '80%',
                            }}>
                            <Text>I am the modal content!</Text>
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