import Realm = require("realm");
import uuid from "react-native-uuid";
import AsyncStorage from '@react-native-async-storage/async-storage';

/** [document schema - User -> to AsyncStorage (@UserInfo)]
 * ## AsyncStorage는 보안적으로 안전한 데이터가 아니라고 하는데 ... user 정보를 어떻게 저장하면 좋을까
 * ==============================
 * isRegistered: boolean;
 * userName: string;
 * birth: string;
 * job: string;
 * notificationAllow: boolean;
 * registerDate: string;
 * progressedDate: string;
 */
/** 구 버전 - user - document schema
 
export interface IUser { 
  id: string;
  name: string | null;
  birth: Date | null;
  job: string | null;
  notificationAllow: boolean | null;
  noficationsTime: string[] | null;
  startDate: Date | null;
  continueDate: Number | null;
  // make name to nullable

}

class User extends Realm.Object {
  public static schema: Realm.ObjectSchema = {
    name: "User",
    primaryKey: "id",
    properties: {
      id: "string",
      name: { type: "string", optional: true },
      birth: { type: "date", optional: true },
      job: { type: "string", optional: true },
      notificationAllow: { type: "bool", optional: true },
      noficationsTime: { type: "string[]", optional: true },
      startDate: { type: "date", optional: true },
      continueDate: { type: "int", optional: true },
    },
  };
}
 */

export const stampNamesNeutral = ['고민','공부','운동','식사','영화','투두','To do','게임','곰팡이','노래',
'대환장','덤덤','떨리는','배달','병원','블랙 리스트','생각','썰렁','와다다다다','웃픔','위시 리스트','책','한유진','비전',
'빈둥','햄버거','자아성찰!','놀람','a','두근','.','A','그냥그래','그저그럼','기상','나른','다짐','단어','무념무상','반성','신기해',
'싱숭생숭','읽고','읽기','하늘','B','s','격하게 아무것도 하기 싫다','깨달음','놀라움','더워','멍','목욕','무','미안','복잡','생일','샤워',
'쇼핑','신기함','쓰고','애매','약','업무','열공','지루함','택배','호기심','흐음','#Mood','.....','Check','GAM3 Girl','GAM3 bo1',
'OOTD','Rrrrrr','TV 시청','To Do','Tr','b','d','ee','hmmm','ㄴ','ㅅㄷ','ㅇ','ㅋ','ㅋㅋㅋㅋㅋ','ㅎㅎ','ㅏㅠㅕㅛㅠㅐ','ㅓ','ㅔㅠㄷ켑','간식',
'감당안됨','건강','결심','경이로운','고백','골프','과학','과학실험','관조','구름','국어','궁금한','그냥','그냥 그럼','그럭저럭','그림그리기','그저 그런',
'그저 그럼','그저그래','기다림','기도','기절','길안내','김나림','꺄르륵','꽐라','끄적임','날씨','내.적.갈.등.','내가 제일 좋아하는 건 여름 그 맛',
'나에게만 준비된 선물 같아','난 자유롭게 fly fly 나 숨을 셔','넌 나의 Christmas Merry Christmas','네모난 학교에 들어서면 또 네모난 교실',
'노래감상','노래방','노트북 사용','노트필기','놀란','놀램','누가봐도 완벽한 노래는 아니지만','눈','눈이 반짝','눈이 오잖아 우리 처음 만난 그 밤에도 한참 동안 눈이 왔잖아',
'너 IN 뷰파인더 초점은 Auto 자연스러운 움직임 따라 널 따라가','다이어리','다이어트','도전목표','돈','독서','동정','등산','디지털 컬러링앱','따분한',
'뜨거운 광선 쏟아져 앗 따끔해','라디오듣기','립','립밤','립스틱','막걸리','맥주','머리감기','머리빗기','머엉','멍..','멍때리기','멜랑꼴리','명상',
'모르는 기분','목발','무감정','무난','무무','무표정','뭐임..','밀도감','바쁨','밥','배불러','밴드','번개','번개처럼 날아라 카우아이 파도 속 나를 던져 버리게',
'벙개', '별 감정 없음','복잡미묘','불','불꽃놀이','붉은색 푸른색 그 사이 3초 그 짧은 시간','붕~ 뜸','비','비누사용','비몽사몽','비밀',
'빙빙 돌아가는 회전목마처럼 영원히 계속될 것처럼','사라짐','사진 찍음','사회','색칠','선글라스','속도감','수학','시간 맞춰 버스를 탈 때','시험에 떨어져도 절대 죽지 않아',
'신경 쓰이는','신기','심심','심심한','심심함','십이시간을 넘게 자도 일어나보면 졸려','쏘쏘','쏘쏘했음','쓰기','쓰레기버리기','아몰랑','아무 일도 없는데 자꾸 마법에 걸려',
'아무것도하기시러용','아무쪼록 행운을 빌어 줘 내 앞길에 행복을 빌어 줘','아슬아슬','악기연주','안경','안녕히계세요 여러분','애매함','앱테크','양치',
'어쩔줄모름','엑스레이','여행','연극','연수의 말말말','영수증','영어','영화 시청','오','오!마이갓','오~쒯','오늘 밤 난 Happy 포근한 이 꿈',
'오늘도 버틴다','오마이갓','오묘함','와....','요란함','월요병','유레카','음악',"이 기분을 따라 Bop bop just feel the music Bop bop that's right",
'이 바보야 진짜 아니야 아직도 나를 그렇게 몰라', '이게뭔데', '이상해', '이젠 추억으로 남기고 서로 가야할 길 찾아서 떠나야 해요', '인쇄', '일상',
'자고싶음','잔잔','잘자','잠','잠에 드는 순간 여행이 시작되는 거야','장난스러움','전이','졸려','졸업','좋지고 나쁘지도 않은 무난무난','주사','주산 연습',
'중립...?','지루한','진정','쩝','쪽','차가운 세상에 섬 같았던 우산','창작의 기운','책읽기','청소','청진기','축구!','추운','추움','추위','춘','취미',
'취준잠옴','취침','츄~!!','치과 갔다 옴','친구들과의 만남','카드','커피','커피 한 잔 할래요','컴퓨터 사용','크리스마스','킹받네','타로 손님이 적다',
'타자연습','태양을 향해 등지고 있던 내 그림자는 다시 빛이 돼','태풍','태풍 같던 비바람이 이제야 끝났는데','토','티끌 모아 티끌 탕진잼 다 지불해','편지',
'평상','퐈이어~~','풉','피','피식','할로윈','할말하않','해탈','햇빛+비','햇빛이 째려볼 땐 바다로 가','헤롱헤롱','화장','화장실','황당','황당, 어이X',
'황당함','회오리바람','회피','훗','휴대폰사용','흐림','흠','흠...','흥미로운','히히','아이디어',]

export const stampNamesPositive = ['행복','설렘','기쁨','신남','뿌듯','감동','위로','설램','기뻐','미소','믿음',
'바램','자금심 고취','뭉클','즐거움','사랑','열정','배부름','기대','웃김','평온','감사','맛있어','재밌음','좋아','공부의욕 뿜뿜!','기분좋음','맛있음',
'뿌듯해','설레임','애정','열정가득!!','좋음','축하','행복해요','화이팅','Good!','I love my body 윤기나는 내 머리','❤','가슴뭉클한','감격',
'감동한','감사한','개운','개운한','개운해','갬동이야','건강해진 기분','고마운','고마움','굿나잇','기대되는','기대함','기분이 째져','기쁜','기운이 나는',
'긴장이 풀리는','끌리는','냠냠','누군가가 집 벨을 눌러 바로 택배','다정한','덕질 가능한 미소','든든한','만족','맛있는거','반가운','반가움','버블',
'보람','빵터짐','뿌듯함','뿌듯한','사랑해','살짝 기쁨','상쾌','상쾌한','설레','설렌당','성취뿌듯함','소소한 기쁨','시험 점수 좋음','신나 !!!','신나는',
'신난','썩 괜찮음','아주 좋아요','여유','열심','열정 의욕','열정만땅','오늘도 난 카트 가득 담아 집에가','용기나는','웃겨','자신감MAX','자신감UP','잘 잤다',
'재미남','재미있는','재미있다','정겨운','조금 기분 좋음','즐거운','짜릿한','짱맛','짱조은날~','찐행복','최고','축구!','태어나줘서 고마워','퇴근','특별한 날',
'편안','햄복','햅삐','행복한','행복함','헹!기분 약간 좋아짐','화이띵','화장실','황홀한','흥분','흥분돼는','희망을느끼는','힘내보자!!','힘내자','🍀행운',]


/** [document schema - Notification]
 */
export interface INotification { // for typescript - type checking
  id: string;
  day: boolean[]; // [true, true, true, true, true, true, true]
  time: string; // "09:00"
}
class Notification extends Realm.Object { // for realm - schema
  public static schema: Realm.ObjectSchema = {
    name: "Notification",
    primaryKey: "id",
    properties: {
      id: "string",
      day: { type: "bool[]", optional: false },
      time: { type: "string", optional: false },
    },
  };
}
/** create & delete 사용법
 * -> read를 제외한 위의 3개 종류 함수들은 반드시 realm.write() 내부에서 사용해야 함!
 * realm.write 는 transaction 단위가 되기 때문에, 아래 구현해 둔 함수에는 전부 write() 를 제거했습니다!
 * 
 * Main.tsx 에서 realm.write() 내부에서 사용하도록 구현해 둔 것을 참고해주세요!
 */
export function createNotification(values: any) {
  return realm.create('Notification', {
    ...values,
    id: uuid.v4(), // 새로운 객체 생성 시 UUID 할당
  });
}
/** update 는 예외 ...! 얘는 안에 write() 가 구현되어있습니다!
 * write() 를 사용하지 않고, 바로 아래 함수들을 사용하시면 돼요
 */
export function updateNotification(notification: INotification, updates: Partial<INotification>) {
  /** 사용법
   * const notificationToUpdate = allNotifications[0];
   * updateNotification(notificationToUpdate, { time: "10:30" });
   */
  realm.write(() => {
    for (const key in updates) {
      // @ts-ignore
      notification[key] = updates[key];
    }
  });
}
export function updateNotificationById(id: string, updates: Partial<INotification>) {
  /** 사용법
   * const idToUpdate = "your_notification_id_here";
   * updateNotificationById(idToUpdate, { time: "11:30" });
   */
  const notification = realm.objectForPrimaryKey<INotification>("Notification", id);
  if (notification) {
    realm.write(() => {
      for (const key in updates) {
        // @ts-ignore
        notification[key] = updates[key];
      }
    });
  } else {
    console.warn("Notification not found with the provided id:", id);
  }
}
export function getAllNotifications(): INotification[] {
  const notifications = realm.objects<INotification>("Notification");
  return notifications.map((notification) => notification);
}
export function getNotificationsByField(fieldName: keyof INotification, value: any): INotification {
  /** 사용법
   * const notificationsWithSpecificTime = getNotificationsByField("time", "09:00");
   * console.log(notificationsWithSpecificTime);
   */
  const notification = realm.objects<INotification>("Notification").filtered(`${fieldName} = $0`, value);
  return notification.map((notification) => notification)[0];
}
/** get & delete 사용법
 * realm.write(() => {
 *  deleteNotification(getnotificationsByField("time", "09:00"));
 *  ...
 * });
 */
export function deleteNotification(notification: INotification) {
  realm.delete(notification);
}



/** [document schema - CustomStamp]
 */
export interface ICustomStamp {
  id: string;
  stampName: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
  pushedCnt: number;
  type: string;
}
class CustomStamp extends Realm.Object {
  public static schema: Realm.ObjectSchema = {
    name: "CustomStamp",
    primaryKey: "id",
    properties: {
      id: "string",
      stampName: { type: "string", optional: false },
      emoji: { type: "string", optional: false },
      createdAt: { type: "date", optional: false },
      updatedAt: { type: "date", optional: false },
      pushedCnt: { type: "int", optional: false },
      type: { type: "string", optional: false },
    },
  };
}
export function createCustomStamp(values: any) {
  var createDate = new Date();
  return realm.create('CustomStamp', {
    ...values,
    id: uuid.v4(), // 새로운 객체 생성 시 UUID 할당
    createdAt: createDate,
    updatedAt: createDate,
    pushedCnt: 0,
    type: stampNamesPositive.includes(values.stampName) ? 'pos' : (stampNamesNeutral.includes(values.stampName) ? 'neu' : 'neg'),
  });
}
export function updateCustomStampPushedCountById(id: string, number: number) {
  // 스탬프 생성일 경우 number = 1
  // 스탬프 삭제일 경우 number = -1
  const customStamp = realm.objectForPrimaryKey<ICustomStamp>("CustomStamp", id);
  if (customStamp) {
    realm.write(() => {
      customStamp.pushedCnt += number; // 'pushedCnt' 속성 1 증감
      customStamp.updatedAt = new Date(); // 업데이트 시간 갱신
    });
  } else {
    console.warn("PushedStamp not found with the provided id:", id);
  }
  // 예시 사용법입니다!
  // console.log(repository.getAllCustomStamps()[0].id);
  // repository.updateCustomStampPushedCountById('33456232-ac6e-43f5-8a55-9c05c23020e3', -3);
  // console.log(repository.getAllCustomStamps()[0].pushedCnt);
}

export function updateCustomStamp(customStamp: ICustomStamp, updates: Partial<ICustomStamp>) {
  realm.write(() => {
    for (const key in updates) {
      // @ts-ignore
      customStamp[key] = updates[key];
    }
  });
}
export function updateCustomStampById(id: string, updates: Partial<ICustomStamp>) {
  const customStamp = realm.objectForPrimaryKey<ICustomStamp>("CustomStamp", id);
  if (customStamp) {
    realm.write(() => {
      for (const key in updates) {
        // @ts-ignore
        customStamp[key] = updates[key];
      }
    });
  } else {
    console.warn("CustomStamp not found with the provided id:", id);
  }
}
export function getAllCustomStamps(): ICustomStamp[] {
  const customStamps = realm.objects<ICustomStamp>("CustomStamp");
  return customStamps.map((customStamp) => customStamp);
}
export function getCustomStampsByField(fieldName: keyof ICustomStamp, value: any): ICustomStamp {
  const customStamp = realm.objects<ICustomStamp>("CustomStamp").filtered(`${fieldName} = $0`, value);
  return customStamp.map((customStamp) => customStamp)[0];
}
export function deleteCustomStamp(customStamp: ICustomStamp) {
  realm.write(() => {
    realm.delete(customStamp);
  });
}



/** [document schema - PushedStamp]
 */
export interface IPushedStamp {
  id: string;
  dateTime: Date;
  stampName: string;
  emoji: string;
  memo: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
class PushedStamp extends Realm.Object {
  public static schema: Realm.ObjectSchema = {
    name: "PushedStamp",
    primaryKey: "id",
    properties: {
      id: "string",
      dateTime: { type: "date", indexed: true, optional: false },
      stampName: { type: "string", optional: false },
      emoji: { type: "string", optional: false },
      memo: { type: "string", optional: true },
      imageUrl: { type: "string", optional: true },
      createdAt: { type: "date", optional: false },
      updatedAt: { type: "date", optional: false },
    },
  };
}
export function createPushedStamp(values: any) {
  var createDate = new Date();
  return realm.create('PushedStamp', {
    ...values,
    id: uuid.v4(), // 새로운 객체 생성 시 UUID 할당
    createdAt: createDate,
    updatedAt: createDate,
  });
}
export function updatePushedStamp(pushedStamp: IPushedStamp, updates: Partial<IPushedStamp>) {
  realm.write(() => {
    for (const key in updates) {
      // @ts-ignore
      pushedStamp[key] = updates[key];
    }
  });
}
export function updatePushedStampById(id: string, updates: Partial<IPushedStamp>) {
  const pushedStamp = realm.objectForPrimaryKey<IPushedStamp>("PushedStamp", id);
  if (pushedStamp) {
    realm.write(() => {
      for (const key in updates) {
        // @ts-ignore
        pushedStamp[key] = updates[key];
      }
    });
  } else {
    console.warn("PushedStamp not found with the provided id:", id);
  }
}
export function getAllPushedStamps(): IPushedStamp[] {
  const pushedStamps = realm.objects<IPushedStamp>("PushedStamp");
  return pushedStamps.map((pushedStamp) => pushedStamp);
}
export function getPushedStampsByField(fieldName: keyof IPushedStamp, value: any): IPushedStamp {
  const pushedStamp = realm.objects<IPushedStamp>("PushedStamp").filtered(`${fieldName} = $0`, value);
  return pushedStamp.map((pushedStamp) => pushedStamp)[0];
}
export function getPushedStampsAllByField(fieldName: keyof IPushedStamp, value: any): IPushedStamp[] {
  const pushedStamp = realm.objects<IPushedStamp>("PushedStamp").filtered(`${fieldName} = $0`, value);
  return pushedStamp.map((pushedStamp) => pushedStamp);
}
export function getPushedStampsByFieldBetween(
  fieldName: keyof IPushedStamp, value1: any, value2: any): IPushedStamp[] {
  const pushedStamps = realm.objects<IPushedStamp>("PushedStamp").filtered(`${fieldName} >= $0 AND ${fieldName} < $1`, value1, value2);
  return pushedStamps.map((pushedStamp) => pushedStamp);
}
export function deletePushedStamp(pushedStamp: IPushedStamp) {
  realm.delete(pushedStamp);
}



/**
 * document schema - DailyReport
 */
export interface IDailyReport {
  id: string;
  date: string; // '2021-01-01'
  title: string;
  bodytext: string;
  keyword: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  moodReportWeekNum: number;
}
class DailyReport extends Realm.Object {
  public static schema: Realm.ObjectSchema = {
    name: "DailyReport",
    primaryKey: "id",
    properties: {
      id: "string",
      date: { type: "string", indexed: true, optional: false },
      title: { type: "string", optional: false },
      bodytext: { type: "string", optional: false },
      keyword: { type: "string[]", optional: true },
      createdAt: { type: "date", optional: false },
      updatedAt: { type: "date", optional: false },
      moodReportWeekNum: {type:"int", optional: false}
    },
  };
}
export function createDailyReport(values: any) {
  var createDate = new Date();
  return realm.create('DailyReport', {
    ...values,
    id: uuid.v4(), // 새로운 객체 생성 시 UUID 할당
    createdAt: new Date(),
    updatedAt: createDate,
  });
}
export function updateDailyReport(dailyReport: IDailyReport, updates: Partial<IDailyReport>) {
  realm.write(() => {
    for (const key in updates) {
      // @ts-ignore
      dailyReport[key] = updates[key];
    }
  });
}
export function updateDailyReportById(id: string, updates: Partial<IDailyReport>) {
  const dailyReport = realm.objectForPrimaryKey<IDailyReport>("DailyReport", id);
  if (dailyReport) {
    realm.write(() => {
      for (const key in updates) {
        // @ts-ignore
        dailyReport[key] = updates[key];
      }
    });
  } else {
    console.warn("DailyReport not found with the provided id:", id);
  }
}
export function getAllDailyReports(): IDailyReport[] {
  const dailyReports = realm.objects<IDailyReport>("DailyReport");
  return dailyReports.map((dailyReport) => dailyReport);
}
export function getDailyReportsByField(fieldName: keyof IDailyReport, value: any): IDailyReport | null {
  const dailyReport = realm.objects<IDailyReport>("DailyReport").filtered(`${fieldName} = $0`, value);
  return dailyReport.length > 0 ? dailyReport[0] : null;
}
export function getDailyReportsByFieldBetween(
  fieldName: keyof IDailyReport, value1: any, value2: any): IDailyReport[] {
    const dailyReport = realm.objects<IDailyReport>("DailyReport").filtered(`${fieldName} >= $0 AND ${fieldName} < $1`, value1, value2);
  return dailyReport.map((dailyReport) => dailyReport);
}
export function deleteDailyReport(dailyReport: IDailyReport) {
  realm.delete(dailyReport);
}

/**
 * document schema - DailyReport
 */
export interface IWeeklyReport {
  id: string;
  weekNum: number;
  weekDate: string; //2023.11.10~2023.11.16
  stampDateTime: Date;
  stampEmoji: string;
  stampMemo: string;
  stampName: string;
  questionType: string;
  answer: string[];
}
class WeeklyReport extends Realm.Object {
  public static schema: Realm.ObjectSchema = {
    name: "WeeklyReport",
    primaryKey: "id",
    properties: {
      id: "string",
      weekNum: { type: "int", optional: false },
      weekDate: { type: "string", optional: false },
      stampDateTime: { type: "date", optional: false },
      stampEmoji: { type: "string", optional: false },
      stampMemo: { type: "string", optional: false },
      stampName: { type: "string", optional: false },
      questionType: { type: "string", optional: false },
      answer: { type: "string[]", optional: false },
    },
  };
}

export function createWeeklyReport(values: any) {
  return realm.create('WeeklyReport', {
    ...values,
    id: uuid.v4(),
    stampDateTime: new Date(),
    stampEmoji: '',
    stampMemo: '',
    stampName: '',
    questionType: '',
    answer: [],
  });
}

export function updateWeeklyReport(weeklyReport: IWeeklyReport, updates: Partial<IWeeklyReport>) {
  realm.write(() => {
    for (const key in updates) {
      // @ts-ignore
      weeklyReport[key] = updates[key];
    }
  });
}

export function getAllWeeklyReports(): IWeeklyReport[] {
  const weeklyReports = realm.objects<IWeeklyReport>("WeeklyReport");
  return weeklyReports.map((weeklyReport) => weeklyReport);
}

export function getWeeklyReportsByField(fieldName: keyof IWeeklyReport, value: any): IWeeklyReport {
  const weeklyReport = realm.objects<IWeeklyReport>("WeeklyReport").filtered(`${fieldName} = $0`, value);
  return weeklyReport.map((weeklyreport) => weeklyreport)[0];
}

// 마이그레이션을 수행하는 함수
function performMigration(oldRealm: Realm, newRealm: Realm) {
  const oldCustomStamps = oldRealm.objects('CustomStamp');
  const oldPushedStamps = oldRealm.objects('PushedStamp');
  const newCustomStamps = newRealm.objects('CustomStamp');
  const oldDailyReports = oldRealm.objects('DailyReport');
  const newDailyReports = newRealm.objects('DailyReport');
  // 이전 버전의 CustomStamp 데이터를 새로운 버전으로 복사
  if(oldRealm.schemaVersion<6){
    for (const oldStamp in oldCustomStamps) {
      newCustomStamps[oldStamp].type = stampNamesPositive.includes(oldCustomStamps[oldStamp].stampName) ? 'pos' : (stampNamesNeutral.includes(oldCustomStamps[oldStamp].stampName) ? 'neu' : 'neg');
    }
  }
  for (const oldDailyReport in oldDailyReports) {
    newDailyReports[oldDailyReport].moodReportWeekNum = -1
  }
}
// let realm = new Realm({ schema: [Notification, oldCustomStampSchema, PushedStamp, DailyReport],
//   schemaVersion: 4,
// });
// 새로운 버전의 Realm 인스턴스 생성
let realm = new Realm({ schema: [Notification, CustomStamp, PushedStamp, DailyReport, WeeklyReport],
  schemaVersion: 8,
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 8) {
      performMigration(oldRealm, newRealm);
    }
  },
});
export const updatePushedStampCount = async() => {
  try {
    const isMigrationTo5 = await AsyncStorage.getItem('@UserInfo:isMigrationTo6');
    if (isMigrationTo5 === null) {
      console.log('Running the function...');
      // 여기에 초기 실행할 함수 내용을 추가하세요.
      const oldCustomStamps = realm.objects('CustomStamp');
      const oldPushedStamps = realm.objects('PushedStamp');
      // 이전 버전의 CustomStamp 데이터를 새로운 버전으로 복사
      for (const oldStamp of oldCustomStamps) {
        const fieldName = 'stampName';
        const oldCount = oldPushedStamps.filtered(`${fieldName} = $0`, oldStamp.stampName).length;
        console.log(oldCount);
        realm.write(() => {
          oldStamp.pushedCnt += oldCount; // 'pushedCnt' 속성 1 증감
          oldStamp.updatedAt = new Date(); // 업데이트 시간 갱신
        });
      }
      // 실행이 완료되면 AsyncStorage에 값을 추가합니다.
      await AsyncStorage.setItem('@UserInfo:isMigrationTo6', 'true');
      console.log('Function executed and value added to AsyncStorage.');
    } else {
      console.log('Function has already been executed.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export default realm;