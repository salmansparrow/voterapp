import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://truesalman7:boUHEocNpwUDHu8R@myvoterapp.abpfc.mongodb.net/voterapp?retryWrites=true&w=majority&appName=myvoterapp";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
