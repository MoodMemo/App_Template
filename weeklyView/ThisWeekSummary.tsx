import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import moment from 'moment';

const ThisWeekSummary = (selectedDate) => {

  const getDatesForWeek = () => {
    const desiredWeekNumber = moment().year(selectedDate.selectedYear).month(selectedDate.selectedMonth - 1).date(1).week() + selectedDate.selectedWeek - 1;
    const startDate = moment().year(selectedDate.selectedYear).week(desiredWeekNumber).startOf('week');
    const endDate = moment().year(selectedDate.selectedYear).week(desiredWeekNumber).endOf('week');
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDatesForWeek();
  

  return (
    <View>
      <Text>시작일: {startDate.format('YYYY년 MM월 DD일 dddd')}</Text> 
      <Text>종료일: {endDate.format('YYYY년 MM월 DD일 dddd')}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start', // 좌측 정렬
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  dropdownButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  dropdownButtonText: {
    fontSize: 16,
    // color: 'red',
    backgroundColor: '#fafafa',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  dropdownOptions: {
    backgroundColor: '#fafafa',
    marginTop: 5,
    padding: 3,
    paddingRight: 20,
    shadowColor: 'gray',
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },   // 그림자 오프셋
    shadowOpacity: 0.2,        // 그림자 투명도
    shadowRadius: 4,           // 그림자 블러 반경
    elevation: 4,              // 안드로이드에서 그림자를 표시하기 위한 설정
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  option: {
    padding: 5,
  },
});

export default ThisWeekSummary;
