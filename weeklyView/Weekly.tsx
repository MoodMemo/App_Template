import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import moment from 'moment';
import ThisWeekSummary from './ThisWeekSummary';
import getDatesBetween, { getEmoji, getStamp } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


interface DropdownProps {
  label: string;
  options: { label: string; value: number }[];
  selectedValue: number;
  onValueChange: (value: number) => void;
}
const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionPress = (value: number) => {
    onValueChange(value);
    setIsOpen(false);
  };

  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedMonth, setSelectedMonth] = useState<number>(8);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  // 해당 주차의 첫째 날과 마지막 날을 구하는 함수
  const getDatesForWeek = () => {
    const startDate = moment().year(selectedYear).month(selectedMonth - 1).week(selectedWeek).startOf('week');
    const endDate = moment().year(selectedYear).month(selectedMonth - 1).week(selectedWeek).endOf('week');
    return { startDate, endDate };
  };
  const { startDate, endDate } = getDatesForWeek();

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={styles.dropdownButtonText}>
          {selectedValue}{label} 🔽
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleOptionPress(option.value)}
              style={{ padding: 5 }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};



const Weekly = () => {

  const handleGenerateDiary = () => {
    // AI 일기 생성 버튼 클릭 시 동작 (일기 생성 로직)
    // 이 부분에 실제로 일기를 생성하는 로직을 구현해야 합니다.
  };


  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedMonth, setSelectedMonth] = useState<number>(8);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };
  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
  };

  const getDatesForWeek = () => {
    const desiredWeekNumber = moment().year(selectedYear).month(selectedMonth - 1).date(1).week() + selectedWeek - 1;
    const startDate = moment().year(selectedYear).week(desiredWeekNumber).startOf('week');
    const endDate = moment().year(selectedYear).week(desiredWeekNumber).endOf('week');
    return { startDate, endDate };
  };
  const { startDate, endDate } = getDatesForWeek();

  const [today, setToday] = useState(moment('2023-08-01'));
  const todayStampList = () => {
    console.log("todayStampList");
    return getStamp(today);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={false}>
      
      {/* 1 & 2. - 상단바 */}
      <View style={{backgroundColor: 'white'}}>
        {/* 1. 년, 월, 주 선택 부분 */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
          <Dropdown
            label="년"
            options={[
              { label: '2022년', value: 2022 },
              { label: '2023년', value: 2023 },
              // 이하 생략
            ]}
            selectedValue={selectedYear}
            onValueChange={handleYearChange}
          />
          <Dropdown
            label="월"
            options={[
              { label: '1월', value: 1 },
              { label: '2월', value: 2 },
              { label: '8월', value: 8 },
              // 이하 생략
            ]}
            selectedValue={selectedMonth}
            onValueChange={handleMonthChange}
          />
          <Dropdown
            label="주"
            options={[
              { label: '1주', value: 1 },
              { label: '2주', value: 2 },
              // 이하 생략
            ]}
            selectedValue={selectedWeek}
            onValueChange={handleWeekChange}
          />
        </View>
        
        {/* 2. 이번 주의 요일, 날짜, 이모지들 */}
        <View style={styles.weekInfo}>
          <View style={styles.emojisContainer}>
            {/* TODO - 간격을 완벽하게 동일하게 조정해야함 & 오늘 날짜/ 일요일 날짜는 색상 변경할 것 */}
            {getDatesBetween(startDate, endDate).map((date) => (
              <TouchableOpacity key={date.format('YYYYMMDD')}>
                <Text style={styles.emoji}>{date.format('ddd')}</Text>
                <Text style={styles.emoji}>{date.format('DD')}</Text>
                <Text style={styles.emoji}>{getEmoji(getStamp(date))}</Text>
              </TouchableOpacity>            
            ))}
          </View>
        </View>
      </View>

      {/* 3. 오늘의 감정 리스트 */}
      <View style={styles.todayEmotionList_text}>
        <Text style={styles.title}>감정 리스트</Text>
        <Text style={{fontSize: 16}}>자세히 보기</Text>
      </View>
      <View style={styles.todayEmotionList}>
        {getStamp(moment('2023-08-01')).map((stamp) => (
          <Text key={stamp.id} style={styles.emotion_2}>{stamp.emoji} {stamp.stampName}</Text>
        ))}
      </View>

      {/* 4. AI 일기 생성 버튼 */}
      <TouchableOpacity onPress={handleGenerateDiary} style={styles.generateButton}>
        <Text style={styles.generateButtonText}>+  AI 일기 생성하기</Text>
      </TouchableOpacity>

      {/* 5. 업로드된 사진 (이미지 컴포넌트로 띄워줄 수 있음)
      <View style={styles.uploadedImage}>
        <Image source={uploadedImage} style={styles.image} />
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  dropdownButton: {
    paddingTop: 15,
    paddingLeft: 15,
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







  container: {
    // padding: 20,
    backgroundColor: '#FAFAFA',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  weekInfo: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  emojisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  emoji: {
    fontSize: 16,
    textAlign: 'center',
  },
  todayEmotionList: {
    flexDirection: 'row',
    marginBottom: 20,
    // backgroundColor: 'purple',
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  todayEmotionList_text: {
    flexDirection: 'row',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    alignItems: 'baseline', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  emotion: {
    fontSize: 18,
    marginBottom: 10,
  },
  emotion_2: {
    fontSize: 18,
    marginBottom: 5,
    marginRight: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  generateButton: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 7,
    justifyContent: 'flex-start',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  uploadedImage: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default Weekly;