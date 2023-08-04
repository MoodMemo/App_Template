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


export default ThisWeekSummary;
