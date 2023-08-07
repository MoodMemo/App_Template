import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs'; // dayjs 라이브러리를 사용해서 날짜 포맷팅
import Realm from 'realm'; // Realm 라이브러리를 사용해서 데이터베이스 관리

const DiaryComponent = ({ todayReport }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todayReport.title);
  const [editedBodytext, setEditedBodytext] = useState(todayReport.bodytext);

  const handleEditButton = () => {
    setIsEditMode(true);
  };

  const handleCancelButton = () => {
    setIsEditMode(false);
  };

  const handleSaveButton = () => {
    // Realm 데이터베이스 업데이트 로직
    const realm = new Realm(/* your realm configuration */);
    realm.write(() => {
      const reportToUpdate = realm.objects('Report').filtered('date = $0', todayReport.date)[0];
      if (reportToUpdate) {
        reportToUpdate.title = editedTitle;
        reportToUpdate.bodytext = editedBodytext;
      }
    });

    setIsEditMode(false);
  };

  return (
    <View>

      <View style={[styles.title, { marginTop: 0 }]}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#212429' }}>오늘의 일기</Text>
        {!isEditMode ? (
          <TouchableOpacity onPress={handleEditButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <MCIcon name='pencil' color="#495057" style={{ fontWeight: 'bold', fontSize: 15 }} />
              <Text style={{ fontSize: 12, color: '#495057' }}> 직접 수정</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={handleCancelButton}>
              <Text style={{ fontSize: 12, color: '#495057' }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveButton}>
              <Text style={{ fontSize: 12, color: '#495057', marginLeft: 10 }}>수정 완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={diaryStyles.diaryContainer}>
        <Text style={{ fontSize: 12, color: '#212429', marginBottom: 12 }}>
          {dayjs(todayReport.date).format('YYYY년 M월 D일 ddd요일')}
        </Text>
        {isEditMode ? (
          <TextInput
            style={{ fontSize: 16, color: '#212429', marginBottom: 12 }}
            value={editedTitle}
            onChangeText={setEditedTitle}
          />
        ) : (
          <Text style={{ fontSize: 16, color: '#212429', marginBottom: 12 }}>{todayReport.title}</Text>
        )}
        
        <View style={[diaryStyles.line, { width: Dimensions.get('window').width - 70 }]} />
        {isEditMode ? (
          <TextInput
            style={{ fontSize: 12, color: '#495057', marginBottom: 15 }}
            value={editedBodytext}
            onChangeText={setEditedBodytext}
            multiline
          />
        ) : (
          <Text style={{ fontSize: 12, color: '#495057', marginBottom: 15 }}>{todayReport.bodytext}</Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          {todayReport.keyword.map((keyword) => (
            <Text key={keyword} style={diaryStyles.keyword}>
              {keyword}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default DiaryComponent;
