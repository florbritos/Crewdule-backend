import { MongoClient } from "mongodb";

export const client = new MongoClient('mongodb+srv://crewdule:35978540Fb@cluster0.ptdeusi.mongodb.net/test')
export const DBCREWDULE = client.db('DB_CREWDULE')
