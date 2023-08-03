import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import Main from './Main'

const AnimatedViewBirthday = () => {
  const [section, setSection] = useState('start');
  const [birthday, setBirthday] = useState('');
  const [job, setJob] = useState('');

  const handleNext = () => {
    if (section === 'start') {
        setSection('birthday');
    }
    else if (section === 'birthday') {
        console.log('Selected birthday:', birthday);
        setSection('job');
    } else {
      // Handle completion or other actions when occupation is entered
        console.log('Selected job:', job);
        setSection('main');
    }
  };

  return (
    <>
        {section === 'start' ? (
          <View style={styles.view}>
            <Text style={styles.title}>나에 대한 정보를</Text>
            <Text style={styles.title}>입력해 맞춤형 AI 일기를</Text>
            <Text style={styles.title}>받아 보세요.</Text>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>{(section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
            </TouchableOpacity>
          </View>
        ) : (section === 'birthday' ? (
          <View style={styles.view}>
            <Text style={styles.title}>Enter Your Birthday</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              onChangeText={(text) => setBirthday(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>{(section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
            </TouchableOpacity>
          </View>
        ) : (section === 'job' ? (
          <View style={styles.view}>
            <Text style={styles.title}>내 직업은</Text>
            <TextInput
              style={styles.input}
              placeholder="디자이너"
              onChangeText={(text) => setJob(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>{(section === 'birthday') || (section === 'start') ? '다음' : '제출'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Main birthday={birthday} job={job}/> // 새로운 정보가 추가되면 이 부분 수정해주시고, Main.tsx도 수정해주세요! (주석처리된 부분)
        )))}
    </>
  );
};


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

export default AnimatedViewBirthday;