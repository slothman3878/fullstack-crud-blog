import { gql } from "@apollo/client";

export const MeQuery = gql`
  query me {
    me {
      id
    }
  }
`