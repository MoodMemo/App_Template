import moment, { Moment } from 'moment';
import dayjs from 'dayjs';
const weekOfYear = require("dayjs/plugin/weekOfYear");
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);

import * as repository from '../src/localDB/document';

import realm from '../src/localDB/document';




function getDatesBetween(startDate: dayjs.Dayjs): dayjs.Dayjs[] {
  const dates = [];
    dates.push(startDate.clone());
    dates.push(startDate.add(1, 'day').clone());
    dates.push(startDate.add(2, 'day').clone());
    dates.push(startDate.add(3, 'day').clone());
    dates.push(startDate.add(4, 'day').clone());
    dates.push(startDate.add(5, 'day').clone());
    dates.push(startDate.add(6, 'day').clone());
    return dates;
  }

export default getDatesBetween;



export function getStamp(date: dayjs.Dayjs): repository.IPushedStamp[] {
  // console.log("####etStamp3*3***");
  const stampList = [];
  // convert date: Moment to date: Date
  const dateToCompareBegin = date.toDate();
  // console.log("dateToCompareBegin: ", dateToCompareBegin);
  const dateToCompareEnd = date.add(1, 'day').toDate();
  // console.log("dateToCompareEnd: ", dateToCompareEnd);
  repository.getPushedStampsByFieldBetween(
    "dateTime", 
    date.startOf('day').toDate(), 
    date.endOf('day').toDate()).forEach((pushedStamp) => {
      stampList.push(pushedStamp);
      // console.log("pushedStamp.emoji: ", pushedStamp.emoji);
  });
  stampList.sort((a,b) => a.dateTime.getTime() - b.dateTime.getTime());
  return stampList;
}

export function getEmoji(stampList: repository.IPushedStamp[]): string[] {
  // console.log("****getEmoji****");
  const emojis = [];
  stampList.forEach((stamp) => {
    emojis.push(stamp.emoji);
    // console.log("stamp.emoji: ", stamp.emoji);
  });
  return emojis;
}


const createDefaultPushedStamp = () => {
  repository.createPushedStamp({
    dateTime: new Date("2023-08-01 13:00:00"),
    stampName: "기쁨",
    emoji: "😆",
    memo: "기쁨 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-14 14:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });

  repository.createPushedStamp({
    dateTime: new Date("2023-07-29 09:00:00"),
    stampName: "기쁨",
    emoji: "😆",
    memo: "기쁨 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-12 10:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-10 15:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-08 23:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-08 22:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-07 09:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });
  repository.createPushedStamp({
    dateTime: new Date("2023-08-06 09:00:00"),
    stampName: "슬픔",
    emoji: "😭",
    memo: "슬픔 스탬프 눌렀다무",
    imageUrl: "이미지는 안넣었다무"
  });

  console.log("create default pushed stamp finished");
}
export const tmp_createDummyData = () => {
  realm.write(() => {
    createDefaultPushedStamp();
  }
  );
}