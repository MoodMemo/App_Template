import Realm = require("realm");
import uuid from "react-native-uuid";


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
    },
  };
}
export function createCustomStamp(values: any) {
  return realm.create('CustomStamp', {
    ...values,
    id: uuid.v4(), // 새로운 객체 생성 시 UUID 할당
    createdAt: new Date(),
  });
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
  realm.delete(customStamp);
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
export function getDailyReportsByField(fieldName: keyof IDailyReport, value: any): IDailyReport {
  const dailyReport = realm.objects<IDailyReport>("DailyReport").filtered(`${fieldName} = $0`, value);
  return dailyReport.map((dailyReport) => dailyReport)[0];
}
export function deleteDailyReport(dailyReport: IDailyReport) {
  realm.delete(dailyReport);
}



let realm = new Realm({ schema: [Notification, CustomStamp, PushedStamp, DailyReport],
  schemaVersion: 4, });

export default realm;