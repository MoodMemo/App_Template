import React, { useState, useEffect, useCallback, useRef} from 'react';
import { Dimensions, View, StyleSheet, Touchable, TouchableOpacity, SafeAreaView, Image, StatusBar, Platform, Button, PermissionsAndroid } from 'react-native';
import Modal from "react-native-modal";
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
import StampOnBoarding from './StampOnBoarding';
import AutumnEventDetailModal from './AutumnEventDetailModal';
// import PushNotification from "react-native-push-notification";
import * as amplitude from './AmplitudeAPI';
import * as repository from './src/localDB/document';
import realm from './src/localDB/document';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StatusBarStyle} from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';

import {default as Text} from "./CustomText"
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraRoll, useCameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

import {Alert, Linking} from 'react-native';
import Permissions, {PERMISSIONS} from 'react-native-permissions';

import dayjs from 'dayjs';
import "dayjs/locale/ko"; //한국어
dayjs.locale("ko");
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import * as nodata from './weeklyView/NoDataView';
import { getStamp } from './weeklyView/DocumentFunc';
import CustomStamp from './CustomStamp';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({name,first}:any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isFirstStamp,setIsFirstStamp]=useState(false);
  const [isStampTemplateAdded,setIsStampTemplateAdded]=useState(true);
  const [isEventModalVisible,setIsEventModalVisible] = useState(false);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCameraPermission, setCameraPermission] = useState<boolean>(false);

  const openSettingsAlert = useCallback(({title}: {title: string}) => {
    Alert.alert(title, '', [
      {
        isPreferred: true,
        style: 'default',
        text: 'Open Settings',
        onPress: () => Linking?.openSettings(),
      },
      {
        isPreferred: false,
        style: 'destructive',
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  }, []);

  const checkAndroidPermissions = useCallback(async () => {
    if (parseInt(Platform.Version as string, 10) >= 33) {
      const permissions = await Permissions.checkMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]);
      if (
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.GRANTED &&
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.GRANTED
      ) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.requestMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]);
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.GRANTED &&
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.GRANTED
      ) {
        setHasPermission(true);
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.DENIED ||
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === Permissions.RESULTS.DENIED
      ) {
        checkAndroidPermissions();
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.BLOCKED ||
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.BLOCKED
      ) {
        openSettingsAlert({
          title: 'Please allow access to your photos and videos from settings',
        });
      }
    } else {
      const permission = await Permissions.check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (permission === Permissions.RESULTS.GRANTED) {
        setHasPermission(true);        
        return;
      }
      const res = await Permissions.request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (res === Permissions.RESULTS.GRANTED) {
        setHasPermission(true);
      }
      if (res === Permissions.RESULTS.DENIED) {
        checkAndroidPermissions();
      }
      if (res === Permissions.RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow access to the photo library from settings',
        });
      }
    }
  }, [openSettingsAlert]);

  const checkPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const permission = await Permissions.check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (permission === Permissions.RESULTS.GRANTED ||
          permission === Permissions.RESULTS.LIMITED) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (res === Permissions.RESULTS.GRANTED ||
          res === Permissions.RESULTS.LIMITED) {
        setHasPermission(true);
      }
      if (res === Permissions.RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow access to the photo library from settings',
        });
      }
    } else if (Platform.OS === 'android') {
      checkAndroidPermissions();
    }
  }, [checkAndroidPermissions, openSettingsAlert]);

  
  // 이미지 불러오기 함수
  const fetchImagesFromGallery = async () => {
    if (!hasPermission) {
      // 권한이 없으면 이미지를 불러올 수 없습니다.
      Alert.alert('Error', 'You need to give permission to access the gallery.');
      return;
    }

    try {
      const photos = await CameraRoll.getPhotos({
        first: 20,  // 처음 20개의 이미지 불러오기
        assetType: 'Photos',  // 'Photos' 또는 'Videos' 또는 'All'
      });

      console.log(photos); // 갤러리에서 불러온 이미지 정보 확인
    } catch (error) {
      console.error('Error fetching images: ', error);
    }
  };

  const fetchPhotos = useCallback(async () => {
    console.log("fecthPhotos 함수 실행");
    const res = await CameraRoll.getPhotos({
      first: 10,
      assetType: 'Photos',
    });
    setPhotos(res?.edges);
  }, []);
  
  useEffect(() => {
    if (hasPermission) {
      fetchPhotos();
    }
  }, [hasPermission, fetchPhotos]);


  useEffect(() => {
    // AsyncStorage에서 userName 값을 가져와서 설정
    AsyncStorage.getItem('@UserInfo:addedStampTemplate')
      .then((value) => {
        if(value!=='true'){
          setIsStampTemplateAdded(false);
        }
    }).catch((error) => {
      console.error("Error fetching addedStampTemplate:", error);
    });
    AsyncStorage.getItem('@UserInfo:userName')
      .then((value) => {
        if (value) {
          setUserName(value);
        }
      })
      .catch((error) => {
        console.error("Error fetching userName:", error);
      });
    AsyncStorage.getItem('@UserInfo:firstStamp')
    .then((value) => {
      if (value==='true') {
        setIsFirstStamp(true);
      }
      else{
        setIsFirstStamp(false);
      }
    })
    .catch((error) => {
      console.error("Error fetching firstStamp:", error);
    });
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
    console.log(isStampTemplateAdded,'isStampTemplateAdded',first);
    setTodayStampCnt(getStamp(currentDate).length);
  }, []);

  const addStampTemplate = () => {
    repository.createCustomStamp({
      stampName: "요리",
      emoji: "🍽️"
    });
    repository.createCustomStamp({
      stampName: "운동",
      emoji: "💪"
    });
    repository.createCustomStamp({
      stampName: "아이디어",
      emoji: "💡"
    });
    repository.createCustomStamp({
      stampName: "투두",
      emoji: "✅"
    });
  };

  const handleStampTemplateAddedTrue = () => {
    setIsStampTemplateAdded(true);
    AsyncStorage.setItem('@UserInfo:addedStampTemplate','true');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleFixButton = () => {
    amplitude.showCustomStampList();
    setFixModalVisible(true);
  };

  const handleFixModalClose = () => {
    amplitude.exitCustomStampList();
    setFixModalVisible(false);
  };


  const currentDate = dayjs();
  const formattedDate = currentDate.format('M월 D일');
  const [todayStampCnt, setTodayStampCnt] = useState(0);
  


  // console.log('aa',name);
  return (
    <>
    <StatusBar
        backgroundColor="#FFFFF9"
        barStyle='dark-content'
      />
    {isFirstStamp===false ? (<>
    <View style={styles.view}>
      {/* 현재 상태 확인 */} 
      <View style={newStyles.moo_status}>
        <View style={{flexDirection: 'row', }}>
          {todayStampCnt !== 0 ? (<Image source={require('./assets/sun_vivid.png')} style={{ width: 32, height: (30 * 32) / 32, marginRight: 7 }} />
          ) : (<Image source={require('./assets/sun_hazy.png')} style={{ width: 32, height: (30 * 32) / 32, marginRight: 7 }} />)}
          {todayStampCnt >= 2 ? (<Image source={require('./assets/sun_vivid.png')} style={{ width: 32, height: (30 * 32) / 32 }} />
          ) : (<Image source={require('./assets/sun_hazy.png')} style={{ width: 32, height: (30 * 32) / 32 }} />)}
        </View>
        <Text style={{color: '#FEB954', fontSize: 16,}}>{formattedDate}, Moo는 광합성 중...</Text>
      </View>
      {/* 이벤트 배너 영역 */}
      <TouchableOpacity style={{marginTop: 14}} onPress={() => {
        setIsEventModalVisible(!isEventModalVisible);
        amplitude.clickEventInfoModal();//이벤트 배너 켬
      }}><Image source={require('./assets/autumn_event_banner_2.png')} style={styles.bannerImage}/>
      </TouchableOpacity>
      {/* 무의 메세지 영역 */}
      <nodata.Home_Moo_Message name={userName}/>
      {/* 나의 감정스탬프들 영역 */}
      <CustomStamp handleFixButtonFromCSP={handleFixButton}/>
      {/* 스탬프 설정 모달 */}
      <StampList visible={fixModalVisible} closeModal={handleFixModalClose}/>
    </View>
  {/* <Modal isVisible={isPhotoModalVisible}
    animationIn={"fadeIn"}
    animationInTiming={200}
    animationOut={"fadeOut"}
    animationOutTiming={200}
    onBackdropPress={() => {
      setIsPhotoModalVisible(!isPhotoModalVisible);
  }}
  backdropColor='#CCCCCC'//'#FAFAFA'
  backdropOpacity={0.8}>
    <View style={{backgroundColor:'#FFFFFF', height:windowHeight*0.8, width:windowWidth*0.8, borderRadius:20, alignItems:'center'}}>
      <Text style={{fontSize: 20, color:'#72D193', marginTop: 20}}>사진을 선택해봐무!</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center', alignItems:'center', marginTop: 20}}>
        {photos.map((p, i) => {
          return (
            <TouchableOpacity key={i} onPress={() => {
              console.log(p.node.image.uri);
              setIsPhotoModalVisible(!isPhotoModalVisible);
            }}>
              <Image
                key={i}
                style={{
                  width: windowWidth*0.2,
                  height: windowWidth*0.2,
                  margin: 5,
                }}
                source={{uri: p.node.image.uri}}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  </Modal> */}
  <Modal isVisible={isEventModalVisible}
    animationIn={"fadeIn"}
    animationInTiming={200}
    animationOut={"fadeOut"}
    animationOutTiming={200}
    onBackdropPress={() => {
      amplitude.cancelEventInfoModalByCancelBtn();//이벤트 배너 끔
      setIsEventModalVisible(!isEventModalVisible);
  }}
  backdropColor='#CCCCCC'//'#FAFAFA'
  backdropOpacity={0.8}
  style={{ alignItems:'center', }}>
    <AutumnEventDetailModal isModalVisible={isEventModalVisible} setIsModalVisible={setIsEventModalVisible}/>
  </Modal></>
  ) : ( <StampOnBoarding/> // 첫 스탬프 입력일 경우 온보딩으로
  // <View style={{justifyContent: 'center',
  //       flex:1,
  //       backgroundColor:'#FFFAF4'}}>
  //         <Image 
  //           source={require('./assets/colorMooMedium.png')}
  //           style={{ width: 123, height: (123 * 131) / 123 , position: 'relative', bottom: '6%', alignSelf:'center', overflow: 'hidden', transform:[{rotate:'11.91deg'}]}}></Image>
  //         <View style={{
  //           position:'relative'
  //         }}>
  //           <Text style={{
  //             fontSize: 26,
  //             color:"#212429",
  //             marginLeft: '5%'
  //           }}>지금의 감정은 어떠냐무~?</Text>
  //           <Text style={{
  //             fontSize: 26,
  //             color:"#212429",
  //             marginLeft: '5%'
  //           }}>감정을 남겨보지 않겠냐무?</Text>
  //         </View>
  //         <TouchableOpacity style={styles.button} onPress={(async () => { 
  //           // Do something before delay
  //           await AsyncStorage.setItem('@UserInfo:firstStamp','false');
  //           setIsFirstStamp(false);
  //           amplitude.userRegiFin_andStampGo() //스탬프 첫 입력 유도
  //           }
  //         )}>
  //             <Text style={styles.buttonText}>감정 스탬프 남기러 가기!</Text>
  //         </TouchableOpacity>
  //       </View>
  )}

  <Modal isVisible={!first&&!isStampTemplateAdded}
      animationIn={"fadeIn"}
      animationInTiming={200}
      animationOut={"fadeOut"}
      animationOutTiming={200}
      backdropColor='#CCCCCC'//'#FAFAFA'
      backdropOpacity={0.8}
      style={{
          alignItems:'center'
      }}>
          <View style={{
              backgroundColor:"#FFFAF4",
              width:350,
              height:530,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:20
          }}>

              <View style={{
                  justifyContent:'center',
                  alignItems:'center',
                  }}>

                  <View style={{marginBottom: 50}}>
                    <Text style={{fontSize: 19, color:'#72D193',}}>업데이트 소식!</Text>
                  </View>

                    <TouchableOpacity disabled={true} style={{
                    padding: 10,
                    width: 200,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: '#72D193',
                    borderRadius: 10,
                    position: 'relative',
                    marginRight: 50,
                    }}>
                      <Text style={{fontSize: 19, color:"#FFFFFF", }}>Moo가 독특한 스탬프를</Text>
                      <Text style={{fontSize: 19, color:"#FFFFFF", }}>만들어봤다무!</Text>
                    </TouchableOpacity>
                    <View style={{
                      width: 20, // 꼬리의 길이
                      height: 20, // 꼬리의 높이
                      left: -80, // 꼬리 위치
                      bottom: 15, // 꼬리 위치
                      backgroundColor: '#72D193',
                      transform: [{ rotate: '45deg' }],
                      borderTopLeftRadius: 10, // 둥글게 만들기
                      marginBottom: 10,
                    }}/>

                    <TouchableOpacity disabled={true} style={{
                    padding: 10,
                    width: 225,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: '#72D193',
                    borderRadius: 10,
                    position: 'relative',
                    marginLeft: 25,
                    }}>
                      <Text style={{fontSize: 19, color:"#FFFFFF", }}>한 번 추가해보지 않을래무?</Text>
                    </TouchableOpacity>
                    <View style={{
                      width: 20, // 꼬리의 길이
                      height: 20, // 꼬리의 높이
                      left: 80, // 꼬리 위치
                      bottom: 15, // 꼬리 위치
                      backgroundColor: '#72D193',
                      transform: [{ rotate: '45deg' }],
                      borderTopLeftRadius: 10, // 둥글게 만들기
                    }}/>
                    <Image source={require('./assets/colorMooMedium.png')} style={{
                      width: 90,
                      height: 393*89/363,
                      transform: [{ rotate: '25deg' }],
                      marginBottom: 20}}/>
              </View>

              <View style={{
                  paddingHorizontal: "5%",
                  marginTop:30,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                  }}>
                  <TouchableOpacity onPress={async ()=>{
                      amplitude.cancelAddStampTemplate(); //스탬프 템플릿 추가 안 함
                      handleStampTemplateAddedTrue();
                      }}
                      style={styles.cancelBtn}>
                      <Text style={{fontSize: 19, color: '#FF7168'}}>음 .. 괜찮아</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async ()=>{
                      amplitude.confirmAddStampTemplate(); //스탬프 템플릿 추가함
                      handleStampTemplateAddedTrue();
                      realm.write(addStampTemplate);
                  }}
                  style={styles.clearBtn}>
                      <Text style={{fontSize: 19, color: '#72D193'}}>좋아!</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
  </>
  );
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: '#FFFFF9',
    },
    titleContainer: {
      backgroundColor: '#FFFAEE',
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
      marginTop: 23,
      marginHorizontal: 28,
    },
    fixButton: {
      width: 20,
      height: 20,
    },
    button: {
      position: 'absolute',
      bottom: '18%',
      width: '90%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#72D193',
      borderRadius: 7,
      marginHorizontal:'5%'
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold'
    },
    cancelBtn: {
      alignSelf: 'center',
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#FF7168', 
      padding: 7,
      marginBottom: 16,
      backgroundColor: 'white', 
      borderColor: '#FF7168',
      borderWidth:1,
      borderRadius: 8,
      flex: 1,
      marginHorizontal:10,
    },
    clearBtn: {
      alignSelf: 'center',
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#344054',
      padding: 7,
      marginBottom: 16,
      backgroundColor: 'white', 
      borderColor: '#72D193',
      borderWidth:1,
      borderRadius: 8,
      flex: 1,
      marginHorizontal:10,
    },
    bannerImage: {
      width:windowWidth-30,
      height:(windowWidth-30)*240/1440,
      borderRadius:10,
      alignSelf:'center',
    }
  });
const newStyles = StyleSheet.create({
  moo_status: {
    marginTop: 28, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  customStamps: {
    backgroundColor: '#fff', width: '100%', flex:1, alignSelf: 'center',marginTop: 44,
    elevation: 4, 
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.5,
    borderTopLeftRadius: 20, borderTopRightRadius: 20
  },
});
export default Home;
