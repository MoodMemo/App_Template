import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import * as repository from '../src/localDB/document';
import EntypoIcon from 'react-native-vector-icons/Entypo';

interface TimelineItem {
  emoji: string;
  stampName: string;
  memo: string;
  time: string;
}

interface TimelineProps {
  data: repository.IPushedStamp[];
}



const Timeline: React.FC<TimelineProps> = ({ data }) => {

  const dateFormat = {
    // ko-KR
    // hour: '2-digit', minute: '2-digit', hour12: true,
    hour: "numeric", minute: "numeric" ,
  };


  return (
    <View style={styles.container}>

      {data.map((item, index) => (
        <View key={index} style={styles.timelineItem}>
          {/* 이모지 */}
          
          <View style={styles.emojiContainer}>

            <Text style={{fontSize: 24, color: 'black'}}>{item.emoji}</Text>
            {index < data.length - 1 && <View style={styles.line2} />}
          </View>

          <View style={styles.block}>

            <View style={styles.title}>
              <Text style={{ fontSize: 12, color: '#212429'}}>{item.stampName}</Text>
              <View style={{flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 12, color: '#495057'}} >{item.dateTime.toLocaleTimeString('en-US', dateFormat)}    </Text> 
                <TouchableOpacity >
                  {/* 스탬프 수정! */}
                  <EntypoIcon name='dots-three-horizontal' color="#212429" style={{ fontWeight: 'bold', fontSize: 10}}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.line}></View>

            <Text style={styles.title}>{item.memo}</Text>
            {/* <Text style={styles.title}>{item.imageUrl}</Text> */}

          </View>
        </View>
      ))}
          


      
      
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
    flex: 1, // 양쪽 확장
    alignItems: 'center',
    // backgroundColor: 'pink', 
    alignSelf: 'flex-start', // 상단 정렬
  },
  timelineItem: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  block: {
    flex: 1,
    color: '#212429',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    paddingBottom: 9
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginHorizontal: 10,
    marginVertical: 9,
    fontSize: 12,
    color: '#212429',
  },
  line: {
    left: 0,
    right: 0,
    borderTopWidth: 1, /* 선분 스타일 설정 (여기서는 1px 두께의 선으로 설정) */
    borderTopColor: '#F0F0F0', /* 선분 색상 설정 */
  },
  line2: {
    position: 'absolute',
    top: 40,
    bottom: -10,
    left: 15,
    width: 1.5,
    backgroundColor: '#F0F0F0',
  },
  emojiContainer: {
    flexDirection: 'column',
    // alignItems: 'center',
    marginRight: 10,
    
  },
});

export default Timeline;

