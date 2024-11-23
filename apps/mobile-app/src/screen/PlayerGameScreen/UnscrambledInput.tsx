import { useState, useMemo } from "react";
import { ButtonGlow } from "./ButtonGlow";
import { cn } from "../../utils/cn";

const round = (value: number, increment: number, offset = 0) => {
  return Math.ceil((value - offset) / increment) * increment + offset;
};

export const UnscrambledInput = ({
  scrambled,
  onChange,
}: {
  scrambled?: string;
  onChange: (value: string) => void;
}) => {
  const [selected, setSelected] = useState<number[]>([]);

  const [characters, setCharacters] = useState<(string | undefined)[]>(
    scrambled?.split("") || []
  );

  const emptyArray = useMemo(() => {
    let length = scrambled?.length || 0;

    return new Array(round(length, 6)).fill(0);
  }, [scrambled]);

  const answerArray = useMemo(() => {
    return new Array(scrambled?.length || 0).fill(0);
  }, [scrambled]);

  if (!scrambled) {
    return;
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center gap-3">
      <div className="flex flex-row flex-wrap w-[90%] min-h-14 justify-center items-center gap-2 bg-[#f3f3f3] rounded-md p-2 shadow-inner shadow-black">
        {answerArray.map((_, index) => (
          <div
            className="BeVietnamProSemiBold text-black border-b-4 border-gray-400 w-3 h-8 flex justify-center items-center p-1 text-2xl"
            key={index}
          >
            {selected[index] === undefined
              ? " "
              : scrambled.charAt(selected[index])}
          </div>
        ))}
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center gap-3">
        <div
          className={cn(
            "w-full grid gap-1 gap-y-3",
            emptyArray.length > 18 ? "grid-cols-8" : "grid-cols-6"
          )}
        >
          {emptyArray.map((_, index) => (
            <ButtonGlow
              squareButton
              rounded="rounded-md"
              glowTop="top-1"
              bgColor={characters[index] ? "bg-white" : "bg-gray-300"}
              glowColor="bg-[#B56386]"
              children={
                <span className="text-black text-2xl BeVietnamProSemiBold">
                  {characters[index] === undefined ? "" : characters[index]}
                </span>
              }
              key={index}
              onClick={() => {
                if (characters[index] === undefined) return;
                const newSelected = [...selected, index];
                setSelected(newSelected);
                onChange(newSelected.map((c) => scrambled.charAt(c)).join(""));

                const newCharacters = [...characters];
                newCharacters[index] = undefined;
                setCharacters(newCharacters);
              }}
            />
          ))}
        </div>

        <div className="w-full flex gap-2 justify-end items-center">
          <ButtonGlow
            bgColor="bg-[#19D3C5]"
            glowColor="bg-[#00655D]"
            size="w-16 h-10"
            rounded="rounded-[10px]"
            glowTop="top-2"
            onClick={() => {
              if (selected.length === 0) return;
              const lastSelected = selected[selected.length - 1];
              const newSelected = selected.splice(0, selected.length - 1);
              setSelected(newSelected);
              onChange(newSelected.map((c) => scrambled.charAt(c)).join(""));

              const newCharacters = [...characters];
              newCharacters[lastSelected] = scrambled.charAt(lastSelected);
              setCharacters(newCharacters);
            }}
            children={<img src="/assets/back.png" className="w-6 h-6" />}
          />

          <ButtonGlow
            bgColor="bg-[#ff2e2e]"
            glowColor="bg-[#AB2034]"
            glowTop="top-2"
            onClick={() => {
              setSelected([]);
              setCharacters(scrambled.split(""));
              onChange("");
            }}
            size="w-16 h-10"
            rounded="rounded-[10px]"
            children={<img src="/assets/reset.png" className="w-6 h-6" />}
          />
        </div>
      </div>
    </div>
  );
};
