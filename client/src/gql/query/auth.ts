import { gql } from '@apollo/client';

export const LOGIN = gql`
    query LOGIN($login: String!, $password: String!) {
        login(login: $login, password: $password) {
            accessToken
            employee {
                role
                _id
                name
                position
                qualification
                role
                login
            }
        }
    }
`;

export const CHECK_AUTH = gql`
    query CHECK_AUTH {
        checkAuth {
            accessToken
            employee {
                role
                _id
                name
                position
                qualification
                role
                login
            }
        }
    }
`;
