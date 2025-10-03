import { MongoClient, ServerApiVersion, Collection } from "mongodb";

const URI = process.env.MONGODB_URI || "";

if (!URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function Connect() {
    try {
        const connection = await client.connect();
        return connection.db("IA");
    } catch (err) {
        console.error(err);
        await client.close();
        return null;
    }
}

async function GetCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    const db = await Connect();
    return db!.collection<T>(collectionName);
}

export { GetCollection };