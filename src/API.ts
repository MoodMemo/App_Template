/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id: string,
  userKey: string,
  name: string,
  birth: string,
  job: string,
  notificationsAllowed: boolean,
  notificationTimes?: Array< string | null > | null,
  subscriptionDate: string,
};

export type User = {
  __typename: "User",
  id: string,
  userKey: string,
  name: string,
  birth?: string | null,
  job?: string | null,
  notificationsAllowed: boolean,
  notificationTimes?: Array< string | null > | null,
  subscriptionDate: string,
  startDate?: string | null,
  continueDates?: number | null,
};

export type UpdateUserInput = {
  id: string,
  userKey: string,
  name?: string | null,
  birth?: string | null,
  job?: string | null,
  notificationsAllowed?: boolean | null,
  notificationTimes?: Array< string | null > | null,
  startDate?: string | null,
  continueDates?: number | null,
};

export type DeleteUserInput = {
  id: string,
  userKey: string,
};

export type CreateUserStampInput = {
  id: string,
  userKey: string,
  stampName: string,
  emoji: string,
  order?: number | null,
};

export type UserStamp = {
  __typename: "UserStamp",
  id: string,
  userKey: string,
  stampName: string,
  emoji: string,
  order?: number | null,
};

export type UpdateUserStampInput = {
  id: string,
  userKey: string,
  stampName?: string | null,
  emoji?: string | null,
  order?: number | null,
};

export type DeleteUserStampInput = {
  id: string,
  userKey: string,
};

export type CreateStampInput = {
  id: string,
  userKey: string,
  dateTime: string,
  stampName: string,
  emoji: string,
  order?: number | null,
  memo?: string | null,
  imageUrl?: string | null,
};

export type Stamp = {
  __typename: "Stamp",
  id: string,
  userKey: string,
  dateTime: string,
  stampName: string,
  emoji: string,
  order?: number | null,
  memo?: string | null,
  imageUrl?: string | null,
};

export type UpdateStampInput = {
  id: string,
  userKey?: string | null,
  dateTime?: string | null,
  stampName?: string | null,
  emoji?: string | null,
  order?: number | null,
  memo?: string | null,
  imageUrl?: string | null,
};

export type DeleteStampInput = {
  id: string,
  userKey: string,
};

export type CreateDailyReportInput = {
  id: string,
  userKey: string,
  date: string,
  title: string,
  bodytext: string,
  keyword1st?: string | null,
  keyword2nd?: string | null,
  keyword3rd?: string | null,
};

export type DailyReport = {
  __typename: "DailyReport",
  id: string,
  userKey: string,
  date: string,
  title: string,
  bodytext: string,
  keyword1st?: string | null,
  keyword2nd?: string | null,
  keyword3rd?: string | null,
};

export type UpdateDailyReportInput = {
  id: string,
  userKey: string,
  date: string,
  title?: string | null,
  bodytext?: string | null,
  keyword1st?: string | null,
  keyword2nd?: string | null,
  keyword3rd?: string | null,
};

export type DeleteDailyReportInput = {
  id: string,
  date: string,
};

export type TableUserFilterInput = {
  id?: TableIDFilterInput | null,
  userKey?: TableStringFilterInput | null,
  name?: TableStringFilterInput | null,
  birth?: TableStringFilterInput | null,
  job?: TableStringFilterInput | null,
  notificationsAllowed?: TableBooleanFilterInput | null,
  notificationTimes?: TableStringFilterInput | null,
  startDate?: TableStringFilterInput | null,
  continueDates?: TableIntFilterInput | null,
  subscriptionDate?: TableStringFilterInput | null,
};

export type TableIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type TableIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type UserConnection = {
  __typename: "UserConnection",
  items?:  Array<User | null > | null,
  nextToken?: string | null,
};

export type TableUserStampFilterInput = {
  id?: TableIDFilterInput | null,
  userKey?: TableStringFilterInput | null,
  stampName?: TableStringFilterInput | null,
  emoji?: TableStringFilterInput | null,
  order?: TableIntFilterInput | null,
};

export type UserStampConnection = {
  __typename: "UserStampConnection",
  items?:  Array<UserStamp | null > | null,
  nextToken?: string | null,
};

export type TableStampFilterInput = {
  id?: TableIDFilterInput | null,
  userKey?: TableStringFilterInput | null,
  dateTime?: TableStringFilterInput | null,
  stampName?: TableStringFilterInput | null,
  emoji?: TableStringFilterInput | null,
  order?: TableIntFilterInput | null,
  memo?: TableStringFilterInput | null,
  imageUrl?: TableStringFilterInput | null,
};

export type StampConnection = {
  __typename: "StampConnection",
  items?:  Array<Stamp | null > | null,
  nextToken?: string | null,
};

export type TableDailyReportFilterInput = {
  id?: TableIDFilterInput | null,
  userKey?: TableStringFilterInput | null,
  date?: TableStringFilterInput | null,
  title?: TableStringFilterInput | null,
  bodytext?: TableStringFilterInput | null,
  keyword1st?: TableStringFilterInput | null,
  keyword2nd?: TableStringFilterInput | null,
  keyword3rd?: TableStringFilterInput | null,
};

export type DailyReportConnection = {
  __typename: "DailyReportConnection",
  items?:  Array<DailyReport | null > | null,
  nextToken?: string | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type CreateUserStampMutationVariables = {
  input: CreateUserStampInput,
};

export type CreateUserStampMutation = {
  createUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type UpdateUserStampMutationVariables = {
  input: UpdateUserStampInput,
};

export type UpdateUserStampMutation = {
  updateUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type DeleteUserStampMutationVariables = {
  input: DeleteUserStampInput,
};

export type DeleteUserStampMutation = {
  deleteUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type CreateStampMutationVariables = {
  input: CreateStampInput,
};

export type CreateStampMutation = {
  createStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type UpdateStampMutationVariables = {
  input: UpdateStampInput,
};

export type UpdateStampMutation = {
  updateStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type DeleteStampMutationVariables = {
  input: DeleteStampInput,
};

export type DeleteStampMutation = {
  deleteStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type CreateDailyReportMutationVariables = {
  input: CreateDailyReportInput,
};

export type CreateDailyReportMutation = {
  createDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};

export type UpdateDailyReportMutationVariables = {
  input: UpdateDailyReportInput,
};

export type UpdateDailyReportMutation = {
  updateDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};

export type DeleteDailyReportMutationVariables = {
  input: DeleteDailyReportInput,
};

export type DeleteDailyReportMutation = {
  deleteDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};

export type GetUserStampsByUserKeyQueryVariables = {
  userKey: string,
};

export type GetUserStampsByUserKeyQuery = {
  getUserStampsByUserKey?:  Array< {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null > | null,
};

export type GetUserQueryVariables = {
  id: string,
  userKey: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: TableUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "UserConnection",
    items?:  Array< {
      __typename: "User",
      id: string,
      userKey: string,
      name: string,
      birth?: string | null,
      job?: string | null,
      notificationsAllowed: boolean,
      notificationTimes?: Array< string | null > | null,
      subscriptionDate: string,
      startDate?: string | null,
      continueDates?: number | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetUserStampQueryVariables = {
  id: string,
  userKey: string,
};

export type GetUserStampQuery = {
  getUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type ListUserStampsQueryVariables = {
  filter?: TableUserStampFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserStampsQuery = {
  listUserStamps?:  {
    __typename: "UserStampConnection",
    items?:  Array< {
      __typename: "UserStamp",
      id: string,
      userKey: string,
      stampName: string,
      emoji: string,
      order?: number | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetStampQueryVariables = {
  id: string,
  dateTime: string,
};

export type GetStampQuery = {
  getStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type ListStampsQueryVariables = {
  filter?: TableStampFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStampsQuery = {
  listStamps?:  {
    __typename: "StampConnection",
    items?:  Array< {
      __typename: "Stamp",
      id: string,
      userKey: string,
      dateTime: string,
      stampName: string,
      emoji: string,
      order?: number | null,
      memo?: string | null,
      imageUrl?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type CountStampsQueryVariables = {
  filter?: TableStampFilterInput | null,
};

export type CountStampsQuery = {
  countStamps?: number | null,
};

export type GetDailyReportQueryVariables = {
  id: string,
  date: string,
};

export type GetDailyReportQuery = {
  getDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};

export type ListDailyReportsQueryVariables = {
  filter?: TableDailyReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDailyReportsQuery = {
  listDailyReports?:  {
    __typename: "DailyReportConnection",
    items?:  Array< {
      __typename: "DailyReport",
      id: string,
      userKey: string,
      date: string,
      title: string,
      bodytext: string,
      keyword1st?: string | null,
      keyword2nd?: string | null,
      keyword3rd?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  name?: string | null,
  birth?: string | null,
  job?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  name?: string | null,
  birth?: string | null,
  job?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  name?: string | null,
  birth?: string | null,
  job?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    userKey: string,
    name: string,
    birth?: string | null,
    job?: string | null,
    notificationsAllowed: boolean,
    notificationTimes?: Array< string | null > | null,
    subscriptionDate: string,
    startDate?: string | null,
    continueDates?: number | null,
  } | null,
};

export type OnCreateUserStampSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  stampName?: string | null,
  emoji?: string | null,
  order?: number | null,
};

export type OnCreateUserStampSubscription = {
  onCreateUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type OnUpdateUserStampSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  stampName?: string | null,
  emoji?: string | null,
  order?: number | null,
};

export type OnUpdateUserStampSubscription = {
  onUpdateUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type OnDeleteUserStampSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  stampName?: string | null,
  emoji?: string | null,
  order?: number | null,
};

export type OnDeleteUserStampSubscription = {
  onDeleteUserStamp?:  {
    __typename: "UserStamp",
    id: string,
    userKey: string,
    stampName: string,
    emoji: string,
    order?: number | null,
  } | null,
};

export type OnCreateStampSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  dateTime?: string | null,
  stampName?: string | null,
  emoji?: string | null,
};

export type OnCreateStampSubscription = {
  onCreateStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type OnUpdateStampSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  dateTime?: string | null,
  stampName?: string | null,
  emoji?: string | null,
};

export type OnUpdateStampSubscription = {
  onUpdateStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type OnDeleteStampSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  dateTime?: string | null,
  stampName?: string | null,
  emoji?: string | null,
};

export type OnDeleteStampSubscription = {
  onDeleteStamp?:  {
    __typename: "Stamp",
    id: string,
    userKey: string,
    dateTime: string,
    stampName: string,
    emoji: string,
    order?: number | null,
    memo?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type OnCreateDailyReportSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  date?: string | null,
  title?: string | null,
  bodytext?: string | null,
};

export type OnCreateDailyReportSubscription = {
  onCreateDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};

export type OnUpdateDailyReportSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  date?: string | null,
  title?: string | null,
  bodytext?: string | null,
};

export type OnUpdateDailyReportSubscription = {
  onUpdateDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};

export type OnDeleteDailyReportSubscriptionVariables = {
  id?: string | null,
  userKey?: string | null,
  date?: string | null,
  title?: string | null,
  bodytext?: string | null,
};

export type OnDeleteDailyReportSubscription = {
  onDeleteDailyReport?:  {
    __typename: "DailyReport",
    id: string,
    userKey: string,
    date: string,
    title: string,
    bodytext: string,
    keyword1st?: string | null,
    keyword2nd?: string | null,
    keyword3rd?: string | null,
  } | null,
};
