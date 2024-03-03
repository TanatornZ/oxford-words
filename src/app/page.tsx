"use client";

import {
  Card,
  Typography,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Word, db } from "./db";
import wordsJson from "../../scrapper/words.json";

const TABLE_HEAD = ["no", "word", "", "level", "type"];
const FILTER = [
  "verb",
  "adjective",
  "noun",
  "adverb",
  "indefinite article",
  "preposition",
  "conjunction",
  "exclamation",
  "determiner",
  "pronoun",
  "auxiliary verb",
  "number",
  "modal verb",
  "ordinal number",
  "linking verb",
  "definite article",
  "infinitive marker",
];
const LIST = ["Oxford 3000", "Oxford 5000 excluding Oxford 3000"];

export default function Home() {
  const [filter, setFilter] = useState("verb");
  const [list, setList] = useState("Oxford 3000");

  const words = useLiveQuery(() => {
    const ox3000 = list === LIST[0];

    return db.words
      .filter(
        (word) => word.type === filter && word.ox3000 === ox3000 && !word.ok
      )
      .toArray();
  }, [filter, list]);

  const onClick = (row: Word) => {
    db.words.update(Number(row.id), { ok: true });
  };

  const onClear = () => {
    db.words.clear();
    db.words.bulkAdd(wordsJson);
  };

  return (
    <div className="container m-auto mt-10">
      <Typography>Total Words: {words?.length}</Typography>

      <div className="flex flex-wrap mb-5">
        <div className="w-72 my-5 mr-3">
          <Select
            value={filter}
            onChange={(val) => setFilter(String(val))}
            className="bg-white label:text-white"
            size="lg"
          >
            {FILTER.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </div>
        <div className="w-72 my-5 mr-3">
          <Select
            value={list}
            onChange={(val) => setList(String(val))}
            className="bg-white label:text-white"
            size="lg"
          >
            {LIST.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </div>
        <Button onClick={() => onClear()}>Reset</Button>
      </div>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    color="blue-gray"
                    className="text-xl text-center font-bold"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {words?.map((row, index) => {
              return (
                <tr
                  key={index}
                  className="even:bg-blue-gray-50/50 text-xl h-[40px] hover:bg-orange-200/50"
                >
                  <td>
                    <Typography
                      color="blue-gray"
                      className="text-xl text-center"
                    >
                      {index + 1}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      color="blue-gray"
                      className="text-xl text-center"
                    >
                      {row.word}
                    </Typography>
                  </td>
                  <td
                    onClick={() => onClick(row)}
                    className="hover:opacity-50  cursor-pointer"
                  >
                    <Typography color="blue" className="text-xl text-center">
                      OK
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      color="blue-gray"
                      className="text-xl text-center"
                    >
                      {row.level}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      color="blue-gray"
                      className="text-xl text-center"
                    >
                      {row.type}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
