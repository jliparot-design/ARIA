"use client";
import { useEffect, useState } from "react";
const RiskMatrix = ({ likelihoodScore, sevScore, scaleUp = false }) => {
  const [likelihoodColor, setLikelihoodColor] = useState("green");
  const [sevColor, setSevColor] = useState("green");

  useEffect(() => {
    // Set colors based on scores
    if (likelihoodScore >= 1 && likelihoodScore <= 2) {
      setLikelihoodColor("bg-matrix-green");
    } else if (likelihoodScore === 3) {
      setLikelihoodColor("bg-matrix-yellow");
    } else {
      setLikelihoodColor("bg-matrix-red");
    }

    if (sevScore >= 1 && sevScore <= 2) {
      setSevColor("bg-matrix-green");
    } else if (sevScore === 3) {
      setSevColor("bg-matrix-yellow");
    } else {
      setSevColor("bg-matrix-red");
    }
  }, [likelihoodScore, sevScore]);

  const cellShader = (index) => {
    let column = index % 5;
    let row = Math.floor(index / 5);
    // Shades all cells in correct row
    if (row === 5 - likelihoodScore && column < sevScore - 1) {
      return `${likelihoodColor} opacity-40`;
    }

    // Shades all cells in correct column
    if (column === sevScore - 1 && row > 5 - likelihoodScore) {
      return `${sevColor} opacity-40`;
    }

    // Shades the correct cell with opacity at 1
    if (row === 5 - likelihoodScore && column === sevScore - 1) {
      return likelihoodScore > sevScore ? `${likelihoodColor}` : `${sevColor}`;
    }
    return "bg-gray-400";
  };
  return (
    <div className={scaleUp ? "scale-150 " : ""}>
      <p className="font-primary font-medium text-sm w-min -translate-x-14 translate-y-16 pr-6 pb-4 text-center -rotate-90">
        Likelihood
      </p>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={
              "rounded-sm h-5 w-8 flex items-center justify-center " +
              cellShader(index)
            }
          ></div>
        ))}
      </div>
      <p className="font-primary font-medium text-sm text-center mt-1">
        Severity
      </p>
    </div>
  );
};

export default RiskMatrix;
