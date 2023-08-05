/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserStampsByUserKey = /* GraphQL */ `
  query GetUserStampsByUserKey($userKey: String!) {
    getUserStampsByUserKey(userKey: $userKey) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!, $userKey: String!) {
    getUser(id: $id, userKey: $userKey) {
      id
      userKey
      name
      birth
      job
      notificationsAllowed
      notificationTimes
      subscriptionDate
      startDate
      continueDates
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: TableUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userKey
        name
        birth
        job
        notificationsAllowed
        notificationTimes
        subscriptionDate
        startDate
        continueDates
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserStamp = /* GraphQL */ `
  query GetUserStamp($id: ID!, $userKey: String!) {
    getUserStamp(id: $id, userKey: $userKey) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const listUserStamps = /* GraphQL */ `
  query ListUserStamps(
    $filter: TableUserStampFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserStamps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userKey
        stampName
        emoji
        order
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStamp = /* GraphQL */ `
  query GetStamp($id: ID!, $dateTime: AWSDateTime!) {
    getStamp(id: $id, dateTime: $dateTime) {
      id
      userKey
      dateTime
      stampName
      emoji
      order
      memo
      imageUrl
      __typename
    }
  }
`;
export const listStamps = /* GraphQL */ `
  query ListStamps(
    $filter: TableStampFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStamps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userKey
        dateTime
        stampName
        emoji
        order
        memo
        imageUrl
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const countStamps = /* GraphQL */ `
  query CountStamps($filter: TableStampFilterInput) {
    countStamps(filter: $filter)
  }
`;
export const getDailyReport = /* GraphQL */ `
  query GetDailyReport($id: ID!, $date: String!) {
    getDailyReport(id: $id, date: $date) {
      id
      userKey
      date
      title
      bodytext
      keyword1st
      keyword2nd
      keyword3rd
      __typename
    }
  }
`;
export const listDailyReports = /* GraphQL */ `
  query ListDailyReports(
    $filter: TableDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDailyReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userKey
        date
        title
        bodytext
        keyword1st
        keyword2nd
        keyword3rd
        __typename
      }
      nextToken
      __typename
    }
  }
`;
