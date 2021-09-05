import { gql } from "@apollo/client";

export const HelloQuery = gql`
  query hello {
    hello
  }
`