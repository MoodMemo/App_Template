/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStampsByKakaoId = /* GraphQL */ `
  query GetStampsByKakaoId {
    getStampsByKakaoId {
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
export const getStamps = /* GraphQL */ `
  query GetStamps($id: String!, $dateTime: AWSDateTime!) {
    getStamps(id: $id, dateTime: $dateTime) {
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
export const listStamps = /* GraphQL */ `
  query ListStamps(
    $filter: TableStampsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStamps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        kakaoId
        dateTime
        stamp
        memoLet
        imageUrl
        __typename
      }
      nextToken
      __typename
    }
  }
`;
