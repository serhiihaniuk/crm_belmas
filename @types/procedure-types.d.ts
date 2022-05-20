export type OccupationType = 'brows' | 'nail' | 'none'
export type IProcedures = "Маникюр"  | "Педикюр" | "Моделирование бровей" | "Долговременная укладка бровей" | "Ламинирование ресниц"
export type IProcedureCodes = "mani" | "pedi" | "bmodeling" | "bstyling" | "elamination"

export interface IProcedureRaw {
    typeOf: OccupationType
    procedure: IProcedures
    procedureCode: IProcedureCodes
    duration: number
}