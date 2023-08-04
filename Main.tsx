import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import Home from './Home';
import Weekly from './weeklyView/Weekly';
import Settings from './Settings';

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import * as queries from './src/graphql/queries'
import realm from './src/localDB/document';
import * as repository from './src/localDB/document';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return <Home/>; //Home.tsx
}

function WeeklyScreen() {
  return <Weekly/>; //Home.tsx
}

function SettingsScreen() {
  return <Settings/>; //Home.tsx
}

/**
graphql 테스트용 함수
**/
async function test() {
  const allStamps = await API.graphql(graphqlOperation(queries.listStamps));
  console.log(allStamps);
  console.log(allStamps.data.listStamps.items);
}


/*
realm 테스트용 함수 -> 삭제하셔도 됩니다!
 */
async function test2(birthday, job) {  // 구 버전 - user document ver.
  Realm.open({}).then((realm) => {
      console.log("Realm is located at: " + realm.path);
    });
  const createUser = (birthday, job) => {
    realm.write(() => {
      realm.create('User', {
        id: new Date().getTime().toString(),
        // name: "haeun",
        // birth: new Date("2001-12-30"),
        birth: new Date(birthday),
        // job: "student",
        job: job,
        // notificationAllow: true,
        // noficationsTime: ["09:00", "13:00", "17:00", "23:00"],
        startDate: new Date(),
        continueDate: 0,
      });
    });
  }
  createUser(birthday, job);
  console.log("create user finished");
  // const getUser = async () => {
  //   try {
  //     let localUser: Results<IUser> = await realm.objects("User");
  //     setUser(localUser[0]);
  //   } catch (e) {
  //     Alert.alert("유저데이터가 없어요");
  //   }
  // };
  // getUser();
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
  const createDefaultDailyReport = () => {
    repository.createDailyReport({
      date: "2023-08-03",
      title: "테스트 일기랍니다",
      bodytext: "테스트 일기 내용입니다",
      keyword: ["소마", "희희하하", "무드메모"]
    });
    console.log("create default daily report finished");
  }

  realm.write(() => {
    deleteAll();
    createDefaultNotification();
    createDefaultCustomStamp();
    createDefaultPushedStamp();
    createDefaultDailyReport();
  });
  console.log("** create default data finished");
}

async function test_realm_ver4_RUD() { // 테스트 완료 ! 지워도 됩니다! 참고용으로 두었어요
  Realm.open({}).then((realm) => {
      console.log("Realm is located at: " + realm.path);
  }
  );

  const tmp = repository.getAllNotifications()[0];
  console.log(tmp.time); // 09:00

  repository.updateNotification(tmp, {time: "09:01"});
  const tmp2 = repository.getAllNotifications()[0];
  console.log(tmp2.time); // 09:01

  repository.updateNotificationById(tmp2.id, {time: "09:00"});
  const tmp3 = repository.getAllNotifications()[0];
  console.log(tmp3.time); // 09:00

  realm.write(() => {
    repository.deleteNotification(tmp3);
  });
  
  console.log(repository.getAllNotifications());
}

/** asyncstorage 테스트용 함수
 */
async function test_saveUserInfo_toAsyncStorage(birthday, job) {
  const createUser = async (birthday, job) => {
    try {
      await AsyncStorage.setItem('@UserInfo:isRegistered', 'true');
      // await AsyncStorage.setItem('@UserInfo:userName', userName);
      await AsyncStorage.setItem('@UserInfo:birth', birthday);
      await AsyncStorage.setItem('@UserInfo:job', job);
      // await AsyncStorage.setItem('@UserInfo:notificationAllow', notificationAllow ? 'true' : 'false'); -> 얘는 나중에 알림 허용할 때 가져가셔용
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
  createUser(birthday, job);
  getUser();
}



function Main({ birthday, job }) {
  if (birthday !== null) {
    //test(); //graphql 테스트를 위해 넣어뒀음
    // test2(birthday, job); //realm 테스트를 위해 넣어뒀음
    test_saveUserInfo_toAsyncStorage(birthday, job); //asyncstorage 테스트를 위해 넣어뒀음
    test_realm_ver4();
    test_realm_ver4_RUD();
  }
  return (
    /*
    하단 바와 함께 그에 맞는 탭이 렌더링됩니다.
    각 탭은 컴포넌트로 관리하며,
    Home -> HomeScreen
    Weekly -> WeeklyScreen
    Settings -> SettingsScreen입니다.
    */
    //TODO : css 분리 작업, 불필요한 반복 줄이기
    <NavigationContainer>
      {/*
        Navigator와 관련된 컴포넌트들은 NavigationContainer 안에 넣어줘야 했습니다.
      */}
      <Tab.Navigator
      initialRouteName="Home" //기본은 홈 화면이도록
      screenOptions={{
        tabBarShowLabel: false, //이게 true면 하단 바 아이콘 밑에 label도 같이 렌더링됩니다.
        headerShown: false, //이게 true면 각 탭의 상단에 해당 Tab의 label이 렌더링됩니다. 매우 보기 싫습니다.
        tabBarActiveTintColor:"#484C52",
        tabBarInactiveTintColor:"#484C524D"
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen} //홈 화면
          options={{
            tabBarIcon: ({color, size}) => (
              <Octicons name="smiley" color={color} size={size} /> //하단 바 아이콘
            ),
          }}
        />
        <Tab.Screen
          name="Search"

          component={WeeklyScreen} //위클리 화면
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} /> //하단 바 아이콘
            ),
          }}
        />
        <Tab.Screen
          name="설정"
          component={SettingsScreen} //설정 화면
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="settings" color={color} size={size} /> //하단 바 아이콘
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Main;