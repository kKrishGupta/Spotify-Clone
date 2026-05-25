import * as React from "react";

import { cn }
from "@/lib/utils";

export function Slider({

  value = [0],

  min = 0,

  max = 100,

  step = 1,

  onValueChange,

  className,
}) {

  const percentage =
    ((value[0] - min) /
      (max - min)) *
    100;

  const handleChange =
    (event) => {

      const next =
        Number(
          event.target.value
        );

      onValueChange?.([
        next,
      ]);
    };

  return (

    <div
      className={cn(
        "relative flex w-full items-center",
        className
      )}
    >

      {/* TRACK */}
      <div
        className="
          absolute h-1.5 w-full
          rounded-full bg-white/10
        "
      />

      {/* PROGRESS */}
      <div
        className="
          absolute h-1.5 rounded-full
          bg-premium-line
        "
        style={{
          width:
            `${percentage}%`,
        }}
      />

      {/* INPUT */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={
          handleChange
        }
        className="
          relative z-10 h-1.5 w-full
          cursor-pointer appearance-none
          bg-transparent

          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-lg

          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:bg-white
        "
      />
    </div>
  );
}