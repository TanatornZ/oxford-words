"use client";

import { Card, Typography } from "@material-tailwind/react";
import rows from "./words.json";

const TABLE_HEAD = ["word", "class", "level"];

const TABLE_ROWS = rows.filter((row) => row.class === "verb");

export default function Home() {
  return (
    <div className="container m-auto mt-10">
      <Typography>Total Words: {TABLE_ROWS.length}</Typography>
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
            {TABLE_ROWS.map(({ word, class: type, level }) => {
              return (
                <tr
                  key={String(word)}
                  className="even:bg-blue-gray-50/50 text-xl"
                >
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
