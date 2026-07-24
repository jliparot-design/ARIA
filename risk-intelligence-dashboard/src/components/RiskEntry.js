"use client";
import { useState } from "react";
import Chip from "./Chip";
import RiskMatrix from "./RiskMatrix";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedRisk, clearSelectedRisk } from "@/lib/riskSlice";
const RiskEntry = ({ rank, risk }) => {
  const [hovering, setHovering] = useState(false);
  const selectedRisk = useSelector((state) => state.risk.selected);

  const dispatch = useDispatch();

  return (
    <div
      className={`${
        selectedRisk ? "max-h-80 min-h-60 my-2 mr-1" : "max-h-40 my-8"
      } ${
        selectedRisk && selectedRisk.id === risk.id
          ? "bg-primary-blue text-white"
          : ""
      } flex relative flex-col items-end justify-center pr-8 cursor-pointer rounded-lg`}
    >
      {/* Used a niche UTF character for the close button to avoid svg, check if it renders on other machine web pages */}
      {selectedRisk && selectedRisk.id === risk.id && (
        <button
          onClick={() => dispatch(clearSelectedRisk())}
          className="absolute z-50 mb-40"
        >
          ╳
        </button>
      )}
      <div
        className="flex items-center justify-around w-full"
        onClick={() =>
          dispatch(setSelectedRisk({ selected: risk, rank: rank }))
        }
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        <p className="text-4xl font-primary text-center font-bold">{rank}</p>
        <div className={selectedRisk ? "w-4/5" : "w-2/3"}>
          <p
            className={`${
              hovering ? "underline" : ""
            } font-primary font-semibold text-3xl mb-1 line-clamp-2`}
          >
            {risk.title}
          </p>
          <p className="font-secondary text-base line-clamp-2">
            {risk.summary}
          </p>
          {risk.industries &&
            risk.industries.map((tag, index) => {
              if (selectedRisk && selectedRisk.id === risk.id) {
                return (
                  <Chip key={index} text={tag} selected={true} oneline={true} />
                );
              }
              return <Chip key={index} text={tag} oneline={true} />;
            })}
        </div>
        {!selectedRisk && (
          <div className="mb-5">
            <RiskMatrix
              likelihoodScore={risk.likelihood}
              sevScore={risk.severity}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskEntry;
