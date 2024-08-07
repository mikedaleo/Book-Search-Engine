import { gql } from '@apollo/client';

export const GET_ME = gql`
    query user($_id: String) {
        user(_id: $_id) {
            username
            email
            bookCount
            savedBooks
        }
    }
`;
