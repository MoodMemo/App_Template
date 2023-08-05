import moment, { Moment } from 'moment';

import * as repository from '../src/localDB/document';

import realm from '../src/localDB/document';


function getDatesBetween(startDate: Moment, endDate: Moment): Moment[] {
  const dates = [];
  const currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate, 'day')) {
    dates.push(currentDate.clone());
    currentDate.add(1, 'day');
  }
  return dates;
}

export default getDatesBetween;



export function getStamp(date: Moment): repository.IPushedStamp[] {
  // console.log("####etStamp3*3***");
  const stampList = [];
  // convert date: Moment to date: Date
  const dateToCompareBegin = date.toDate();
  // console.log("dateToCompareBegin: ", dateToCompareBegin);
  const dateToCompareEnd = date.add(1, 'day').toDate();
  // console.log("dateToCompareEnd: ", dateToCompareEnd);
  // repository.getPushedStampsByFieldBetween(dateToCompareBegin, dateToCompareEnd).forEach((pushedStamp) => {
  repository.getPushedStampsByFieldBetween("dateTime", dateToCompareBegin, dateToCompareEnd).forEach((pushedStamp) => {
    stampList.push(pushedStamp);
    // console.log("pushedStamp.emoji: ", pushedStamp.emoji);
  });
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