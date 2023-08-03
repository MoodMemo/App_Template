/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';

import AnimatedViewBirthday from './AnimatedViewBirthday';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Main from './Main'
import { create } from 'react-test-renderer';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  
  (async () => { 
    // Do something before delay
    console.log('before delay')

    await new Promise(f => setTimeout(f, 1000));

    // Do something after
    console.log('after delay')
    }
  )();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const check=0;

  SplashScreen.hide();

  const isRegistered = AsyncStorage.getItem('@UserInfo:isRegistered');

  if (isRegistered !== null) {
    console.log("isRegistered: " + isRegistered);
    return (
      <SafeAreaView style={styles.container}>
        <Main birthday={null} job={null}/>
      </SafeAreaView>
    );
  }
  else
  {
    return (
      <SafeAreaView style={styles.container}>
        <AnimatedViewBirthday />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor:"#FFFFFF",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
});

export default App;