import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import Home from './Home';
import Weekly from './Weekly';
import Settings from './Settings';

import Amplify, {API, graphqlOperation} from 'aws-amplify';
import * as queries from './src/graphql/queries'


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

function Main() {
  //test(); //graphql 테스트를 위해 넣어뒀음
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
          name="Settings"
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