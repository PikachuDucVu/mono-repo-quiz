import { Player } from "hublock-shared";
import { cn } from "../../utils/cn";
import { AnimatePresence, motion } from "framer-motion";

export const PlayerList = ({ players }: { players: Player[] }) => {
  return (
    <AnimatePresence>
      <div className="flex flex-col gap-3 w-full h-full justify-center">
        {Array.from({ length: 6 }).map((_, index) => {
          const player = players[index];
          return player ? (
            <motion.div
              className="flex gap-3 items-center"
              key={player.id ? player.id : index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gray-400 p-1 pt-0 rounded-full pl-[1px] pr-0">
                <div className="bg-white rounded-full p-1 pr-1">
                  <img
                    src={player?.avatarUrl || `/avatars/${index}.jpg`}
                    className="w-14 h-14 rounded-full"
                  />
                </div>
              </div>
              <span
                className={cn(
                  "font-[GothamMedium] text-xl line-clamp-1",
                  "text-white"
                )}
              >
                {player.displayName}
              </span>
            </motion.div>
          ) : (
            <div className="flex gap-3 items-center" key={index}>
              <div className="bg-gray-400 p-1 pt-0 rounded-full pl-[1px] pr-0">
                <div className="bg-white rounded-full p-1 pr-1">
                  <img
                    src={"/avatars/user-placeholder.jpeg"}
                    className="w-14 h-14 rounded-full"
                  />
                </div>
              </div>
              <span
                className={cn(
                  "font-[GothamMedium] text-xl line-clamp-1",
                  !player ? "text-gray-500" : "text-white"
                )}
              >
                {"---"}
              </span>
            </div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};
