// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const App = () => {
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [username, setUsername] = useState('');
//   const [birth, setBirth] = useState('');
//   const [job, setJob] = useState('');
//   const [notificationAllow, setNotificationAllow] = useState(false);
//   const [registerDate, setRegisterDate] = useState('');
//   const [progressedDate, setProgressedDate] = useState('');

//   useEffect(() => {
//     // 컴포넌트가 마운트되었을 때, AsyncStorage에서 데이터를 불러옵니다.
//     getData();
//   }, []);

//   const saveData = async () => {
//     try {
//       // AsyncStorage에 각각의 데이터를 저장합니다.
//       await AsyncStorage.setItem('@MyStorage:isRegistered', isRegistered ? 'true' : 'false');
//       await AsyncStorage.setItem('@MyStorage:username', username);
//       await AsyncStorage.setItem('@MyStorage:birth', birth);
//       await AsyncStorage.setItem('@MyStorage:job', job);
//       await AsyncStorage.setItem('@MyStorage:notificationAllow', notificationAllow ? 'true' : 'false');
//       await AsyncStorage.setItem('@MyStorage:registerDate', registerDate);
//       await AsyncStorage.setItem('@MyStorage:progressedDate', progressedDate);
//       console.log('Data saved successfully!');
//     } catch (error) {
//       console.log('Error saving data:', error);
//     }
//   };

//   const getData = async () => {
//     try {
//       // AsyncStorage에서 각각의 데이터를 불러옵니다.
//       const isRegisteredData = await AsyncStorage.getItem('@MyStorage:isRegistered');
//       setIsRegistered(isRegisteredData === 'true');

//       const usernameData = await AsyncStorage.getItem('@MyStorage:username');
//       setUsername(usernameData || '');

//       const birthData = await AsyncStorage.getItem('@MyStorage:birth');
//       setBirth(birthData || '');

//       const jobData = await AsyncStorage.getItem('@MyStorage:job');
//       setJob(jobData || '');

//       const notificationAllowData = await AsyncStorage.getItem('@MyStorage:notificationAllow');
//       setNotificationAllow(notificationAllowData === 'true');

//       const registerDateData = await AsyncStorage.getItem('@MyStorage:registerDate');
//       setRegisterDate(registerDateData || '');

//       const progressedDateData = await AsyncStorage.getItem('@MyStorage:progressedDate');
//       setProgressedDate(progressedDateData || '');
//     } catch (error) {
//       console.log('Error retrieving data:', error);
//     }
//   };

//   const clearData = async () => {
//     try {
//       // AsyncStorage에서 모든 데이터를 제거합니다.
//       await AsyncStorage.clear();
//       setIsRegistered(false);
//       setUsername('');
//       setBirth('');
//       setJob('');
//       setNotificationAllow(false);
//       setRegisterDate('');
//       setProgressedDate('');
//       console.log('All data cleared successfully!');
//     } catch (error) {
//       console.log('Error clearing data:', error);
//     }
//   };

//   return (
//     <View>
//       <Text>isRegistered: {isRegistered ? 'true' : 'false'}</Text>
//       <Text>username: {username}</Text>
//       <Text>birth: {birth}</Text>
//       <Text>job: {job}</Text>
//       <Text>notificationAllow: {notificationAllow ? 'true' : 'false'}</Text>
//       <Text>registerDate: {registerDate}</Text>
//       <Text>progressedDate: {progressedDate}</Text>
//       <Button title="Save Data" onPress={saveData} />
//       <Button title="Clear Data" onPress={clearData} />
//     </View>
//   );
// };

// export default App;
