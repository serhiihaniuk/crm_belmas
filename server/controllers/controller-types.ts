import {Document} from "mongoose";

export type MongoResponse<T> = Document<any, any, T> & T & { _id: string };
