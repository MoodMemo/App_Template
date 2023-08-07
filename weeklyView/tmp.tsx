import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ExampleScrollView = () => {
  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>스크롤 가능한 내용 1</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        <Text style={styles.text}>스크롤 가능한 내용 2</Text>
        {/* 추가적인 스크롤 가능한 내용들 */}
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ExampleScrollView;