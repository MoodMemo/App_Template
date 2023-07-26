/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateStampsInput = {
  id: string,
  kakaoId: string,
  dateTime: string,
  stamp: string,
  memoLet?: string | null,
  imageUrl?: string | null,
};

export type Stamps = {
  __typename: "Stamps",
  id: string,
  kakaoId: string,
  dateTime: string,
  stamp: string,
  memoLet?: string | null,
  imageUrl?: string | null,
};

export type UpdateStampsInput = {
  id: string,
  kakaoId?: string | null,
  dateTime: string,
  stamp?: string | null,
  memoLet?: string | null,
  imageUrl?: string | null,
};

export type DeleteStampsInput = {
  id: string,
  dateTime: string,
};

export type TableStampsFilterInput = {
  id?: TableStringFilterInput | null,
  kakaoId?: TableStringFilterInput | null,
  dateTime?: TableStringFilterInput | null,
  stamp?: TableStringFilterInput | null,
  memoLet?: TableStringFilterInput | null,
  imageUrl?: TableStringFilterInput | null,
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

export type StampsConnection = {
  __typename: "StampsConnection",
  items?:  Array<Stamps | null > | null,
  nextToken?: string | null,
};

export type CreateStampsMutationVariables = {
  input: CreateStampsInput,
};

export type CreateStampsMutation = {
  createStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type UpdateStampsMutationVariables = {
  input: UpdateStampsInput,
};

export type UpdateStampsMutation = {
  updateStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type DeleteStampsMutationVariables = {
  input: DeleteStampsInput,
};

export type DeleteStampsMutation = {
  deleteStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type GetStampsByKakaoIdQuery = {
  getStampsByKakaoId?:  Array< {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null > | null,
};

export type GetStampsQueryVariables = {
  id: string,
  dateTime: string,
};

export type GetStampsQuery = {
  getStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type ListStampsQueryVariables = {
  filter?: TableStampsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStampsQuery = {
  listStamps?:  {
    __typename: "StampsConnection",
    items?:  Array< {
      __typename: "Stamps",
      id: string,
      kakaoId: string,
      dateTime: string,
      stamp: string,
      memoLet?: string | null,
      imageUrl?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateStampsSubscriptionVariables = {
  id?: string | null,
  kakaoId?: string | null,
  dateTime?: string | null,
  stamp?: string | null,
  memoLet?: string | null,
};

export type OnCreateStampsSubscription = {
  onCreateStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type OnUpdateStampsSubscriptionVariables = {
  id?: string | null,
  kakaoId?: string | null,
  dateTime?: string | null,
  stamp?: string | null,
  memoLet?: string | null,
};

export type OnUpdateStampsSubscription = {
  onUpdateStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};

export type OnDeleteStampsSubscriptionVariables = {
  id?: string | null,
  kakaoId?: string | null,
  dateTime?: string | null,
  stamp?: string | null,
  memoLet?: string | null,
};

export type OnDeleteStampsSubscription = {
  onDeleteStamps?:  {
    __typename: "Stamps",
    id: string,
    kakaoId: string,
    dateTime: string,
    stamp: string,
    memoLet?: string | null,
    imageUrl?: string | null,
  } | null,
};
