"use client";

import {
  Card,
  Typography,
  Select,
  Option,
  Button,
  CardBody,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Word, db } from "./db";
import wordsJson from "../../scrapper/words.json";
import { sample } from "lodash";
import Iframe from "react-iframe";
import ReactAudioPlayer from "react-audio-player";

const FILTER = ["verb", "adjective", "noun", "adverb", "other"];
const LIST = ["Oxford 3000", "Oxford 5000 excluding Oxford 3000"];

export default function Home() {
  const [filter, setFilter] = useState("verb");
  const [list, setList] = useState("Oxford 3000");
  const [word, setWord] = useState<Word>();

  const [openPopover, setOpenPopover] = useState(false);

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };

  const words = useLiveQuery(async () => {
    const ox3000 = list === LIST[0];

    const data = await db.words
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

    setWord(sample(data));

    return data;
  }, [filter, list]);

  const onClick = (row?: Word) => {
    if (!row) return;
    db.words.update(Number(row.id), { ok: true });
  };

  const onClear = () => {
    db.words.clear();
    db.words.bulkAdd(wordsJson);
  };

  const onSkip = () => {
    setWord(sample(words));
  };

  return (
    <div className="p-2 m-auto max-w-screen-md ">
      <div className="flex flex-wrap mb-5">
        <div className="w-72 my-5 mr-3">
          <Select
            value={filter}
            onChange={(val) => setFilter(String(val))}
            size="lg"
            className="text-white/50 bg-gray-900 border-0"
            labelProps={{ style: { display: "none" } }}
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
            className="text-white/50 bg-gray-900 border-0"
            labelProps={{ style: { display: "none" } }}
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

      <Typography className="text-white/50 mb-5">
        Total Words: {words?.length}
      </Typography>

      <Button
        onClick={() => onClick(word)}
        color="blue"
        className="mr-5 text-white/50 "
      >
        OK
      </Button>
      <Button
        onClick={() => onSkip()}
        color="deep-orange"
        className="mr-5 text-white/50 "
      >
        Skip
      </Button>

      <Card className="mt-6 text-white/50 " color="gray">
        <CardBody>
          <Popover open={openPopover} handler={setOpenPopover}>
            <PopoverHandler {...triggers}>
              <Typography
                variant="h2"
                className="mb-2 cursor-help max-w-fit hover:text-white"
              >
                {word?.word || "-"}
              </Typography>
            </PopoverHandler>
            <PopoverContent
              {...triggers}
              className="z-50 w-full  max-w-screen-md bg-white/90"
            >
              <ReactAudioPlayer
                src={word?.pronounce}
                autoPlay
                controls
                className="mb-5"
              />
              <Iframe
                url={`https://dict.longdo.com/mobile.php?search=${word?.word}`}
                className="w-full aspect-video"
              />
            </PopoverContent>
          </Popover>

          <Typography>level: {word?.level}</Typography>
          <Typography>type: {word?.type}</Typography>
        </CardBody>
      </Card>
    </div>
  );
}
