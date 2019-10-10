export enum UserPermissions {
  NONE = 0x0,
  MANAGE_USERS = 0x1,
  ELDER = 0x2,
  MANAGE_NEWS = 0x4,
  MANAGE_DOCS = 0x8,
  MANAGE_POLLS = 0x16,
};

export default interface IUser {
  _id?: string;

  id: number;
  permissions: number;

  /*
    These values are manually entered for student council's team members.
    They are not connected with Telegram.
  */
  elderGroup?: string;
  name?: string;
  username?: string;
  description?: string;
};