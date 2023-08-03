import Realm = require("realm");
import uuid from "react-native-uuid";


/**
 * document schema - User -> to AsyncStorage (@UserInfo)
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


/**
 * document schema - Notification
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
export function createNotification(values: any) {
  return realm.create('Notification', {
    ...values,
    id: uuid.v4(), // 새로운 객체 생성 시 UUID 할당
  });
}


/**
 * document schema - CustomStamp
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


/**
 * document schema - PushedStamp
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



let realm = new Realm({ schema: [Notification, CustomStamp, PushedStamp, DailyReport],
  schemaVersion: 4, });

export default realm;