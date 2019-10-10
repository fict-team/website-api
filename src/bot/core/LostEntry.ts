export interface ILostEntry {
  id: number;
  latitude: number;
  longitude: number;
  phone?: string;
  messageId: number;
  modMessageId: number;
  peopleOnCase: Array<{ id: number, name: string }>;
};

export default class LostEntry implements ILostEntry {
  private static entries: { [id: number]: ILostEntry } = {};

  public id: number;
  public latitude: number;
  public longitude: number;
  public phone?: string;
  public messageId: number;
  public modMessageId: number;
  public peopleOnCase: Array<{ id: number, name: string }>;

  constructor(entry: ILostEntry) { Object.assign(this, entry); }

  public delete() { delete LostEntry.entries[this.id]; }

  public toggleCase(id: number, name: string) {
    for (let i = 0; i < this.peopleOnCase.length; i++) {
      const p = this.peopleOnCase[i];
      if (p.id === id) {
        this.peopleOnCase.splice(i, 1);
        return false;
      }
    }

    this.peopleOnCase.push({ id, name });
    return true;
  }

  public static create(entry: Partial<ILostEntry>) {
    let e: ILostEntry = LostEntry.entries[entry.id];

    if (e) {
      e.latitude = entry.latitude;
      e.longitude = entry.longitude;
      e.messageId = entry.messageId;
      e.modMessageId = entry.modMessageId;
    } else {
      e = Object.assign({ peopleOnCase: [] }, entry) as ILostEntry;
    }

    LostEntry.entries[e.id] = e;

    return e;
  }

  public static get(id: number) { return LostEntry.entries[id] ? new LostEntry(LostEntry.entries[id]) : null; }
}