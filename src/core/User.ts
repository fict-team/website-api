import { IUser, UserPermissions } from './base';
import Database from './db';
import _ from 'lodash';

export default class User implements IUser {
  public id: number;
  public permissions: UserPermissions;

  public elderGroup?: string;
  public name?: string;
  public username?: string;
  public description?: string;

  /*
    List of IUser values.
    Only values specified here will be saved to the database when User.save method is called.
  */
  private static dataFields = ['id', 'permissions', 'elderGroup', 'name', 'username', 'description'];

  constructor(user: IUser) {
    Object.assign(this, user);
  }

  public async save() {
    const collection = await User.getCollection();
    return await collection.update({ id: this.id }, { $set: this.data() }, { upsert: true });
  }

  public data() {
    return _.pick(this, User.dataFields);
  }

  private static getCollection() { return Database.getCollection<IUser>('fict_users'); }

  public static async get(id: number) { 
    const collection = await User.getCollection();
    const user = await collection.findOne({ id });

    return user ? new User(user) : null;
  }

  public static async getAll() {
    const collection = await User.getCollection();
    const users = await collection.find({}).toArray();

    return users.map(u => new User(u));
  }

  public static default(id: number, permissions: number = UserPermissions.NONE) {
    return new User({ id, permissions });
  }
};