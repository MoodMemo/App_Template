import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch} from 'react-native';
import { Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import SwitchToggle from 'react-native-switch-toggle';


const test = () => {
  console.log('hello');
}


const Settings = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isKakaoModalVisible, setIsKakaoModalVisible] = useState(false);
  const [isNoticeModalVisible, setIsNoticeModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isCoffeeModalVisible, setIsCoffeeModalVisible] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    return (
      <View style={{backgroundColor:'#FFFFFF',flex:1}}>
        <ScrollView>
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
                            alignItems:'center'
                        }}>
                            <View style={{
                                }}>
                                    <Text>프로필 설정 변경은 개발 중!</Text>
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
                            alignItems:'center'
                        }}>
                            <View style={{
                                }}>
                                    <Text>채널톡 연동은 개발 중!</Text>
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
                <TouchableOpacity>
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
                          onPress={() => setIsNotificationEnabled(!isNotificationEnabled)}
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
                </TouchableOpacity>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <Divider style={{backgroundColor:"#EAEAEA",width:'90%',marginHorizontal:'5%'}}/>
                <TouchableOpacity>
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
                            alignItems:'center'
                        }}>
                            <View style={{
                                }}>
                                    <Text>공지사항/이용 가이드는 개발 중!</Text>
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
                            alignItems:'center'
                        }}>
                            <View style={{
                                }}>
                                    <Text>고객센터/의견 보내기/오류 제보는 개발 중!</Text>
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
                            alignItems:'center'
                        }}>
                            <View style={{
                                }}>
                                    <Text>나는 커피 못 마셔</Text>
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