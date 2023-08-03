/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $id: ID
    $userKey: String
    $name: String
    $birth: AWSDateTime
    $job: String
  ) {
    onCreateUser(
      id: $id
      userKey: $userKey
      name: $name
      birth: $birth
      job: $job
    ) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $id: ID
    $userKey: String
    $name: String
    $birth: AWSDateTime
    $job: String
  ) {
    onUpdateUser(
      id: $id
      userKey: $userKey
      name: $name
      birth: $birth
      job: $job
    ) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $id: ID
    $userKey: String
    $name: String
    $birth: AWSDateTime
    $job: String
  ) {
    onDeleteUser(
      id: $id
      userKey: $userKey
      name: $name
      birth: $birth
      job: $job
    ) {
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
export const onCreateUserStamp = /* GraphQL */ `
  subscription OnCreateUserStamp(
    $id: ID
    $userKey: String
    $stampName: String
    $emoji: String
    $order: Int
  ) {
    onCreateUserStamp(
      id: $id
      userKey: $userKey
      stampName: $stampName
      emoji: $emoji
      order: $order
    ) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const onUpdateUserStamp = /* GraphQL */ `
  subscription OnUpdateUserStamp(
    $id: ID
    $userKey: String
    $stampName: String
    $emoji: String
    $order: Int
  ) {
    onUpdateUserStamp(
      id: $id
      userKey: $userKey
      stampName: $stampName
      emoji: $emoji
      order: $order
    ) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const onDeleteUserStamp = /* GraphQL */ `
  subscription OnDeleteUserStamp(
    $id: ID
    $userKey: String
    $stampName: String
    $emoji: String
    $order: Int
  ) {
    onDeleteUserStamp(
      id: $id
      userKey: $userKey
      stampName: $stampName
      emoji: $emoji
      order: $order
    ) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const onCreateStamp = /* GraphQL */ `
  subscription OnCreateStamp(
    $id: ID
    $userKey: String
    $dateTime: AWSDateTime
    $stampName: String
    $emoji: String
  ) {
    onCreateStamp(
      id: $id
      userKey: $userKey
      dateTime: $dateTime
      stampName: $stampName
      emoji: $emoji
    ) {
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
export const onUpdateStamp = /* GraphQL */ `
  subscription OnUpdateStamp(
    $id: ID
    $userKey: String
    $dateTime: AWSDateTime
    $stampName: String
    $emoji: String
  ) {
    onUpdateStamp(
      id: $id
      userKey: $userKey
      dateTime: $dateTime
      stampName: $stampName
      emoji: $emoji
    ) {
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
export const onDeleteStamp = /* GraphQL */ `
  subscription OnDeleteStamp(
    $id: ID
    $userKey: String
    $dateTime: AWSDateTime
    $stampName: String
    $emoji: String
  ) {
    onDeleteStamp(
      id: $id
      userKey: $userKey
      dateTime: $dateTime
      stampName: $stampName
      emoji: $emoji
    ) {
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
export const onCreateDailyReport = /* GraphQL */ `
  subscription OnCreateDailyReport(
    $id: ID
    $userKey: String
    $date: String
    $title: String
    $bodytext: String
  ) {
    onCreateDailyReport(
      id: $id
      userKey: $userKey
      date: $date
      title: $title
      bodytext: $bodytext
    ) {
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
export const onUpdateDailyReport = /* GraphQL */ `
  subscription OnUpdateDailyReport(
    $id: ID
    $userKey: String
    $date: String
    $title: String
    $bodytext: String
  ) {
    onUpdateDailyReport(
      id: $id
      userKey: $userKey
      date: $date
      title: $title
      bodytext: $bodytext
    ) {
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
export const onDeleteDailyReport = /* GraphQL */ `
  subscription OnDeleteDailyReport(
    $id: ID
    $userKey: String
    $date: String
    $title: String
    $bodytext: String
  ) {
    onDeleteDailyReport(
      id: $id
      userKey: $userKey
      date: $date
      title: $title
      bodytext: $bodytext
    ) {
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
