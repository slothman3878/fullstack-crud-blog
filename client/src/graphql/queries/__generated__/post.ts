/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PostQueryInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: post
// ====================================================

export interface post_post_type {
  __typename: "Type";
  id: string;
}

export interface post_post_writer {
  __typename: "User";
  id: string;
}

export interface post_post {
  __typename: "Post";
  id: string;
  slug: string;
  title: string;
  body: string;
  type: post_post_type;
  writer: post_post_writer;
  createdAt: any;
  updatedAt: any;
}

export interface post {
  post: post_post | null;
}

export interface postVariables {
  postInput: PostQueryInput;
}
