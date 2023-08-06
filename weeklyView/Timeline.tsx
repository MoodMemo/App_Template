import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface TimelineItem {
  emoji: string;
  memo: string;
  time: string;
}

interface TimelineProps {
  data: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text>Timeline</Text>
      <Text>Timeline</Text>

      <View style={styles.timelineItem}>
        <Text>Timeline</Text>
        <Text> ** </Text>
        <Text>Timeline</Text>
        <Text> ** </Text>
      </View>

      
      
    </View>
  );
};

// {data.map((item, index) => (
//   <View key={index} style={styles.timelineItem}>
//     {/* 이모지 */}
//     <View>
//       <Text>{item.emoji}</Text>
//     </View>

//     {/* 블럭 */}
//     <View style={styles.block}>
//       <Text>{item.memo}</Text>
//       <Text>{item.time}</Text>
//     </View>

//     {/* 선 */}
//     {index < data.length - 1 && (
//       <View style={styles.line} />
//     )}
//   </View>
// ))}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'purple', 
    alignSelf: 'flex-start', 
    justifyContent: 'flex-start',
    // paddingVertical: 20,
    flex: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'baseline',
    // flexWrap: 'wrap',
    marginBottom: 20,
  },
  block: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  line: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#ccc',
    top: 0,
    left: 25, // 이모지 너비와 같은 값으로 설정
  },
});

export default Timeline;
