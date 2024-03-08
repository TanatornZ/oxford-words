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
const FILTER = ["verb", "adjective", "noun", "adverb", "other"];
const LIST = ["Oxford 3000", "Oxford 5000 excluding Oxford 3000"];

export default function Home() {
  const [filter, setFilter] = useState("verb");
  const [list, setList] = useState("Oxford 3000");

  const words = useLiveQuery(() => {
    const ox3000 = list === LIST[0];

    return db.words
      .filter((word) => {
        let isFilter = false;
        if (filter === "other") {
          isFilter = !["verb", "adjective", "noun", "adverb"]?.includes(
            word.type
          );
        } else {
          isFilter = word.type === filter;
        }

        return word.ox3000 === ox3000 && !word.ok && isFilter;
      })
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
      <div className="flex flex-wrap mb-5">
        <div className="w-72 my-5 mr-3">
          <Select
            value={filter}
            onChange={(val) => setFilter(String(val))}
            size="lg"
            className="text-white/50 bg-gray-900"
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
            size="lg"
            className="text-white/50 bg-gray-900"
          >
            {LIST.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </div>
        <Button onClick={() => onClear()} className="text-white/50">
          Reset
        </Button>
      </div>

      <Typography className="text-white/50">
        Total Words: {words?.length}
      </Typography>

      <Card className="h-full w-full text-white/50  bg-gray-900">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="p-4 border-b border-gray-700">
                  <Typography className="text-xl text-center font-bold">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {words?.map((row, index) => {
              return (
                <tr key={index} className="text-xl h-[40px] hover:bg-gray-800">
                  <td>
                    <Typography className="text-xl text-center">
                      {index + 1}
                    </Typography>
                  </td>
                  <td>
                    <Typography className="text-xl text-center">
                      {row.word}
                    </Typography>
                  </td>
                  <td
                    onClick={() => onClick(row)}
                    className="hover:opacity-50  cursor-pointer"
                  >
                    <Typography className="text-xl text-center text-yellow-400/50">
                      OK
                    </Typography>
                  </td>
                  <td>
                    <Typography className="text-xl text-center">
                      {row.level}
                    </Typography>
                  </td>
                  <td>
                    <Typography className="text-xl text-center">
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
