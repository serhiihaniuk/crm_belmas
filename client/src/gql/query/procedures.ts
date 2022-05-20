import { gql } from '@apollo/client';

export const GET_PROCEDURES = gql`
    query GET_PROCEDURES($type: String) {
        getProcedures(typeOf: $type) {
            typeOf
            procedure
            duration
            procedureCode
        }
    }
`;