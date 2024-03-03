// db.ts
import Dexie, { Table } from "dexie";
import wordsJson from "../../scrapper/words.json";

export interface Word {
  id?: number;
  word: string;
  type: string;
  level: string;
  ox3000: boolean;
  ox5000: boolean;
  ok?: boolean;
}

export class MySubClassedDexie extends Dexie {
  words!: Table<Word>;

  constructor() {
    super("oxDatabase");
    this.version(1).stores({
      words: "++id, word, type, level, ox3000, ox5000, ok", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();

db.on("ready", async () => {
  const data = await db.words.get({ word: "a" });
  if (!data) {
    await db.words.bulkAdd(wordsJson).catch(console.log);
  }
});
