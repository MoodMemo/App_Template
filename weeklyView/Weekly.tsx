import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import moment from 'moment';
import 'moment/locale/ko'; // 한국어로 변환
import ThisWeekSummary from './ThisWeekSummary';
import getDatesBetween, { getEmoji, getStamp, tmp_createDummyData } from './DocumentFunc';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { deleteUserStamp } from '../src/graphql/mutations';
import Modal from "react-native-modal";
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


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

  return (
    <View style={dropDownStyles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={dropDownStyles.dropdownButton}>
        <View>
          <Text style={dropDownStyles.dropdownButtonText}>
            {selectedValue}{label}
          </Text>
          <FontAwesomeIcon name='sort-down' size={16} color="#737373" style={{position: 'absolute', right: 7, top: 5}}/>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={dropDownStyles.dropdownOptions}>
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

  const [today, setToday] = useState<moment.Moment>(moment());
  const handleTodayChange = (date: moment.Moment) => { setToday(moment(date.subtract(2, 'days'))); };

  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedMonth, setSelectedMonth] = useState<number>(8);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const handleYearChange = (year: number) => { setSelectedYear(year); };
  const handleMonthChange = (month: number) => { setSelectedMonth(month); };
  const handleWeekChange = (week: number) => { setSelectedWeek(week); };

  const getDatesForWeek = () => {
    const desiredWeekNumber = moment().year(selectedYear).month(selectedMonth - 1).date(1).week() + selectedWeek - 1;
    const startDate = moment().year(selectedYear).week(desiredWeekNumber).startOf('week');
    const endDate = moment().year(selectedYear).week(desiredWeekNumber).endOf('week');
    return { startDate, endDate };
  };
  const { startDate, endDate } = getDatesForWeek();

  const [isDetailModelVisible, setIsDetailModalVisible] = useState(false);




  // tmp_createDummyData();

  return (
    <ScrollView contentContainerStyle={{backgroundColor: '#FAFAFA',}} horizontal={false}>
      
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
              { label: '7월', value: 7 },
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
              { label: '3주', value: 2 },
              { label: '4주', value: 2 },
              // 이하 생략
            ]}
            selectedValue={selectedWeek}
            onValueChange={handleWeekChange}
          />
        </View>
        
        {/* 2. 이번 주의 요일, 날짜, 이모지들 */}
        <View style={styles.emojisContainer}>
          {/* TODO - 스탬프가 7개 이상일 경우 +n 등을 띄워야 함 */}
          {getDatesBetween(startDate, endDate).map((date) => (
            <TouchableOpacity key={date.format('YYYYMMDD')} onPress={() => handleTodayChange(date)}>
              <View style={[styles.day, date.isSame(today, 'day') && styles.day_today]}>
                <Text style={[
                  styles.dayText,
                  date.isoWeekday() === 7 && styles.dayText_sunday]}>{date.format('ddd')}</Text>
                <Text style={[
                  styles.dayText, 
                  date.isoWeekday() === 7 && styles.dayText_sunday,
                  date.isSame(today, 'day') && styles.dayText_today,
                  date.isAfter(moment()) && styles.dayText_notYet]}>{date.format('DD')}</Text>
                <Text style={[
                  styles.dayText,
                  { flex:1,
                    fontSize: getEmoji(getStamp(date)).length >= 3 ? 14 : 14}
                  ]}>{getEmoji(getStamp(date))}</Text>
              </View>
            </TouchableOpacity>            
          ))}
        </View>
      </View>


      {/* 3. 오늘의 감정 리스트 */}
      <View style={styles.title}>
        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#212429'}}>감정 리스트</Text>
        <TouchableOpacity onPress={() => { setIsDetailModalVisible(!isDetailModelVisible); }}>
          <Text style={{fontSize: 16, color: '#495057'}}>자세히 보기</Text>
          {/* <Modal presentationStyle={"fullScreen pageSheet, formSheet"}/> */}
          <Modal
            isVisible = {isDetailModelVisible}
            // presentationStyle='pageSheet'
            animationIn={"fadeIn"}
            animationInTiming={200}
            animationOut={"fadeOut"}
            animationOutTiming={200}
            onBackdropPress={() => {setIsDetailModalVisible(!isDetailModelVisible);}}
            backdropColor='#CCCCCC' 
            backdropOpacity={0.9}
            style={{ alignItems:'center' }}
            backdropTransitionInTiming={0} // Disable default backdrop animation
            backdropTransitionOutTiming={0} // Disable default backdrop animation
          >
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 20, width: 370, height: 500}}>
              <Text>TODAY</Text>  
              <Text>{today.format('M월 D일 dd')}</Text>
              <Text>스탬프 상세 히스토리</Text>
              <Text></Text>
              {getStamp(today.add(1, 'day')).map((stamp) => (
                <Text key={stamp.id} style={styles.emotion}>
                  {stamp.emoji} {stamp.stampName} **시간: {stamp.dateTime.getHours()}:{stamp.dateTime.getMinutes()}
                  **메모: {stamp.memo} **사진: {stamp.imageUrl}
                </Text>
              ))}
            </View>
          </Modal>
        </TouchableOpacity>
      </View>
        {/* <Text>{today.toString()}</Text> */}
      {/* 3-1. 감정 리스트 */}
      <View style={styles.todayEmotionList}>
        {getStamp(today.add(1, 'day')).map((stamp) => (
          <Text key={stamp.id} style={styles.emotion}>{stamp.emoji} {stamp.stampName}</Text>
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



const dropDownStyles = StyleSheet.create({
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
    color: '#212429',
    backgroundColor: '#fafafa',
    padding: 5,
    paddingHorizontal: 12,
    paddingRight: 22,
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
});


const styles = StyleSheet.create({

  emojisContainer: {
    flexDirection: 'row',
    // backgroundColor: '#92AAFF', // blue
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  day: {
    width: (Dimensions.get('window').width) / 7,
    height: (Dimensions.get('window').height) / 7,
    // backgroundColor: '#FFE092', // yellow
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  day_today: {
    borderBottomWidth: 2,
    borderColor: '#00E3AD',
  },
  dayText: {
    color: '#212429',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
    // backgroundColor: 'pink',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dayText_sunday: {
    color: '#FF7168',
  },
  dayText_notYet: {
    color: '#F0F0F0',
  },
  dayText_today: {
    // flexDirection: 'column', 
    color: 'white',
    backgroundColor: '#00E3AD',
    borderRadius: 10,
    width: 20,
    height: 20,
    lineHeight: 20,
    overflow: 'hidden',
  },

  title: {
    flexDirection: 'row',
    justifyContent: 'space-between', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    alignItems: 'baseline', // text 요소들을 양 끝으로 떨어뜨리기 위해 추가
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  todayEmotionList: {
    flexDirection: 'row',
    marginBottom: 20,
    // backgroundColor: 'purple',
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  emotion: {
    fontSize: 18,
    color: '#212429',
    marginBottom: 5,
    marginRight: 10,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },




  generateButton: {
    color: '#495057',
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  generateButtonText: {
    color: '#495057',
    fontSize: 18,
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