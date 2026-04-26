import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "channelmirror";

let clientPromise: Promise<MongoClient> | null = null;

export function hasMongoUri(): boolean {
  return Boolean(uri?.trim());
}

export async function getMongoDb(): Promise<Db | null> {
  if (!uri?.trim()) {
    return null;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  return client.db(dbName);
}
