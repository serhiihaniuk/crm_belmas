import {IProcedureRaw} from "../../../../../@types/procedure-types";
import {SelectItem} from "carbon-components-react";
import React from "react";
import {useQuery} from "@apollo/client";
import {IGetProcedures} from "../../../types/procedure-types";
import {GET_PROCEDURES} from "../../../gql/query/procedures";
import loading from 'carbon-components/components/loading/loading';

 function mapProceduresToPicker(procedures: IProcedureRaw[] | undefined):  JSX.Element[] | null {
    if(!procedures) return null
    return procedures.map(p=><SelectItem key={p.procedureCode} value={p.procedureCode} text={p.procedure} />)
}



export const useProcedures = () => {
    const {data, loading} = useQuery<IGetProcedures>(GET_PROCEDURES)

    if(loading) return null
    if(!data) return null

    return mapProceduresToPicker(data.getProcedures)

}