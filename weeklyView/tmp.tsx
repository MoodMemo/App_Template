import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Timeline from './Timeline';

const data = [
  { emoji: '😀', stampName: '신남', memo: '첫 번째 이모지', time: '10:00 AM' },
  { emoji: '🚀', stampName: '로켓', memo: '두 번째 이모지', time: '11:30 AM' },
  { emoji: '🎉', stampName: '축하', memo: '세 번째 이모지', time: '1:15 PM' },
  // 추가적인 데이터를 넣어주면 됩니다.
];

const Tmp = () => {
  return (
    <View style={styles.container}>
      <Timeline data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Tmp;
