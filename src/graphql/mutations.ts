/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
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
export const createUserStamp = /* GraphQL */ `
  mutation CreateUserStamp($input: CreateUserStampInput!) {
    createUserStamp(input: $input) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const updateUserStamp = /* GraphQL */ `
  mutation UpdateUserStamp($input: UpdateUserStampInput!) {
    updateUserStamp(input: $input) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const deleteUserStamp = /* GraphQL */ `
  mutation DeleteUserStamp($input: DeleteUserStampInput!) {
    deleteUserStamp(input: $input) {
      id
      userKey
      stampName
      emoji
      order
      __typename
    }
  }
`;
export const createStamp = /* GraphQL */ `
  mutation CreateStamp($input: CreateStampInput!) {
    createStamp(input: $input) {
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
export const updateStamp = /* GraphQL */ `
  mutation UpdateStamp($input: UpdateStampInput!) {
    updateStamp(input: $input) {
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
export const deleteStamp = /* GraphQL */ `
  mutation DeleteStamp($input: DeleteStampInput!) {
    deleteStamp(input: $input) {
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
export const createDailyReport = /* GraphQL */ `
  mutation CreateDailyReport($input: CreateDailyReportInput!) {
    createDailyReport(input: $input) {
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
export const updateDailyReport = /* GraphQL */ `
  mutation UpdateDailyReport($input: UpdateDailyReportInput!) {
    updateDailyReport(input: $input) {
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
export const deleteDailyReport = /* GraphQL */ `
  mutation DeleteDailyReport($input: DeleteDailyReportInput!) {
    deleteDailyReport(input: $input) {
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
