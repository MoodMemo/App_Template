/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStamps = /* GraphQL */ `
  subscription OnCreateStamps(
    $id: String
    $kakaoId: String
    $dateTime: AWSDateTime
    $stamp: String
    $memoLet: String
  ) {
    onCreateStamps(
      id: $id
      kakaoId: $kakaoId
      dateTime: $dateTime
      stamp: $stamp
      memoLet: $memoLet
    ) {
      id
      kakaoId
      dateTime
      stamp
      memoLet
      imageUrl
      __typename
    }
  }
`;
export const onUpdateStamps = /* GraphQL */ `
  subscription OnUpdateStamps(
    $id: String
    $kakaoId: String
    $dateTime: AWSDateTime
    $stamp: String
    $memoLet: String
  ) {
    onUpdateStamps(
      id: $id
      kakaoId: $kakaoId
      dateTime: $dateTime
      stamp: $stamp
      memoLet: $memoLet
    ) {
      id
      kakaoId
      dateTime
      stamp
      memoLet
      imageUrl
      __typename
    }
  }
`;
export const onDeleteStamps = /* GraphQL */ `
  subscription OnDeleteStamps(
    $id: String
    $kakaoId: String
    $dateTime: AWSDateTime
    $stamp: String
    $memoLet: String
  ) {
    onDeleteStamps(
      id: $id
      kakaoId: $kakaoId
      dateTime: $dateTime
      stamp: $stamp
      memoLet: $memoLet
    ) {
      id
      kakaoId
      dateTime
      stamp
      memoLet
      imageUrl
      __typename
    }
  }
`;
