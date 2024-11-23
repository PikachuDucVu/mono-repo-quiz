import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { useEffect, useState } from "react";
dayjs.extend(duration);

export const Countdown = ({
  targetTime,
  onFinish,
  className,
  format = "HH : mm : ss",
}: {
  targetTime: number;
  onFinish?: () => void;
  className?: string;
  format?: string;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(targetTime - Date.now());

  useEffect(() => {
    let running = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeoutId: any;
    const loop = () => {
      if (!running) return;
      if (targetTime - Date.now() <= 0) {
        onFinish?.();
        running = false;
        return;
      }
      setTimeLeft(targetTime - Date.now());
      timeoutId = setTimeout(loop, 1000);
    };
    loop();
    return () => {
      running = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onFinish, targetTime]);

  return (
    <div className={className || "text-2xl font-extralight"}>
      {dayjs.duration(timeLeft + 1000, "milliseconds").format(format)}
    </div>
  );
};
