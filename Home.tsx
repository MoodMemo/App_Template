import React, { useState, useEffect, useCallback, useRef} from 'react';
import { Dimensions, View, StyleSheet, Touchable, TouchableOpacity, SafeAreaView, Image, StatusBar, Platform, Button, PermissionsAndroid } from 'react-native';
import Modal from "react-native-modal";
import Dropdown from './Dropdown';
import StampView from './StampView';
import StampList from './StampList';
// import PushNotification from "react-native-push-notification";
import * as amplitude from './AmplitudeAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StatusBarStyle} from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets, initialWindowMetrics} from 'react-native-safe-area-context';

import {default as Text} from "./CustomText"
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraRoll, useCameraRoll } from '@react-native-camera-roll/camera-roll';

import {Alert, Linking} from 'react-native';
import Permissions, {PERMISSIONS} from 'react-native-permissions';

const Home = ({name}:any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['최근 생성 순'];
  const [fixModalVisible, setFixModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isFirstStamp,setIsFirstStamp]=useState(false);
  const [isStampTemplateAdded,setIsStampTemplateAdded]=useState(true);
  const [isEventModalVisible,setIsEventModalVisible] = useState(false);
  const [photos, getPhotos, save] = useCameraRoll();

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

  useEffect(() => {
    // AsyncStorage에서 userName 값을 가져와서 설정
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
    console.log(isFirstStamp);
  }, []);

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
  console.log('aa',name);
  return (
    <>
    <StatusBar
        backgroundColor="#FFFAF4"
        barStyle='dark-content'
      />
    {isFirstStamp===false ? (<View style={styles.view}>
    <View style={styles.titleContainer}>
      {/* 드롭다운 컴포넌트 */}
      <Text style={styles.title}>지금 어떤 기분이냐무~?{'\n'}{`${name===undefined ? userName : name}`}의{'\n'}감정을 알려줘라무!</Text>
    </View>
    <Image source={require('./assets/colorMooMedium.png')} style={styles.mooImage}/>
    <View style={styles.options}>
      <Dropdown options={options} onSelectOption={handleOptionSelect} />
      <TouchableOpacity style={styles.fixButton} onPress={handleFixButton}>
        <Image source={require('./assets/edit.png')} />
      </TouchableOpacity>

      {/* // 된 거 */}
      <Button title="사진 테스트" onPress={checkPermission}/>
      <Button title="사진 불러오기" onPress={fetchImagesFromGallery}/>
      {
        photos?.edges?.map((item, index) => {
          return (
            <Image
              key={index}
              style={{width: 100, height: 100}}
              source={{uri: item.node.image.uri}}
            />
          );
        })
      }
    </View>
    {/* 감정 스탬프 뷰 */}
    <StampView/>
    {/* 스탬프 설정 모달 */}
    <StampList visible={fixModalVisible} closeModal={handleFixModalClose}/>
  </View>) : (<View style={{justifyContent: 'center',
            flex:1,
            backgroundColor:'#FFFAF4'}}>
              <Image 
                source={require('./assets/colorMooMedium.png')}
                style={{ width: 123, height: (123 * 131) / 123 , position: 'relative', bottom: '6%', alignSelf:'center', overflow: 'hidden', transform:[{rotate:'11.91deg'}]}}></Image>
              <View style={{
                position:'relative'
              }}>
                <Text style={{
                  fontSize: 26,
                  color:"#212429",
                  marginLeft: '5%'
                }}>지금의 감정은 어떠냐무~?</Text>
                <Text style={{
                  fontSize: 26,
                  color:"#212429",
                  marginLeft: '5%'
                }}>감정을 남겨보지 않겠냐무?</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={(async () => { 
                // Do something before delay
                await AsyncStorage.setItem('@UserInfo:firstStamp','false');
                setIsFirstStamp(false);
                amplitude.userRegiFin_andStampGo() //스탬프 첫 입력 유도
                }
              )}>
                  <Text style={styles.buttonText}>감정 스탬프 남기러 가기!</Text>
              </TouchableOpacity>
            </View>)}
  </>
  );
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    titleContainer: {
      backgroundColor: '#FFFAF4',
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
      marginTop: 32,
      marginHorizontal: 28,
      marginBottom:12
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
  });

export default Home;
