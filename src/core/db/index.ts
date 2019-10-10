import { MongoClient, Db, Collection } from 'mongodb';

export default class Database {
  private static db: Db;
  private static callbacks = [];

  public static async get(): Promise<Db> {
    if (!Database.db) {
      const cb: any = {};
      const promise: Promise<Db> = new Promise((resolve, reject) => { 
        cb.resolve = resolve;  
        cb.reject = reject;
      });
      Database.callbacks.push(cb);
      return await promise;
    }

    return Database.db;
  }

  public static async getCollection<T>(name: string): Promise<Collection<T>> {
    const db = await Database.get();
    return db.collection(name);
  }

  public static async connect(mongoUri: string) {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true });
    await client.connect();

    const db = client.db();
    Database.db = db;

    for (let i = 0; i < Database.callbacks.length; i++) {
      const cb = Database.callbacks[i];
      cb.resolve(db);
    }

    Database.callbacks = [];

    return db;
  }
};