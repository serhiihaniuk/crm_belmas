import { SelectItem } from 'carbon-components-react';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROCEDURES } from '../../../gql/query/procedures';
import {IProcedureRaw} from "procedure-types";
import {IGetProcedures} from "../../../types/procedure-types";

function mapProceduresToPicker(procedures: IProcedureRaw[] | undefined, occupation: string): any {
    if (!procedures) return null;
    const items = procedures.map((p) => {
        if (p.typeOf !== occupation) return null;
        return <SelectItem key={p.procedureCode} value={p.procedureCode} text={p.procedure} />;
    });

    return items;
}

export const useProcedures = (occupation: string) => {
    const [items, setItems] = useState(null);
    const { data, loading } = useQuery<IGetProcedures>(GET_PROCEDURES);

    useEffect(() => {
        if (data) {
            setItems(mapProceduresToPicker(data.getProcedures, occupation));
        }
    }, [occupation, data]);

    if (loading) return null;
    if (!data) return null;

    return items;
};