"use client";

import { Card, Typography, Select, Option } from "@material-tailwind/react";
import rows from "./words.json";
import { useEffect, useMemo, useState } from "react";
import { clone, findIndex } from "lodash";

export default function Home() {
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [filter, setFilter] = useState("verb");

  const TABLE_HEAD = ["no", "word", "class", "level"];
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

  useEffect(() => {
    const data = localStorage.getItem("data");
    let newData;
    if (!data) {
      localStorage.setItem("data", JSON.stringify(rows));
      newData = rows;
    } else {
      newData = JSON.parse(String(data));
    }

    setTableRows(newData);
  }, []);

  const onClick = (word: string, type: string) => {
    const index = findIndex(tableRows, { word, class: type });

    const newData = clone(tableRows);
    newData[index].ready = !newData[index]?.ready;

    setTableRows(newData);
  };

  const TABLE_ROWS = useMemo(() => {
    const data = tableRows.filter(
      (row: any) => row.class === filter && !row?.ready
    );

    return data;
  }, [tableRows, filter]);

  return (
    <div className="container m-auto mt-10">
      <Typography>Total Words: {TABLE_ROWS.length}</Typography>

      <div className="w-72 my-5">
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
            {TABLE_ROWS?.map(({ word, class: type, level }, index) => {
              return (
                <tr
                  key={word}
                  className="even:bg-blue-gray-50/50 text-xl h-[40px] hover:bg-orange-200/50"
                  onClick={() => onClick(word, type)}
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
                      {word}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      color="blue-gray"
                      className="text-xl text-center"
                    >
                      {type}
                    </Typography>
                  </td>
                  <td>
                    <Typography
                      color="blue-gray"
                      className="text-xl text-center"
                    >
                      {level}
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
