import { gql } from "@apollo/client";

export const PostQuery = gql`
  query post($postInput: PostQueryInput!){
    post(input: $postInput) {
      id
      slug
      title
      body
      type {
        id
      }
      writer {
        id
      }
      createdAt
      updatedAt
    }
  }
`