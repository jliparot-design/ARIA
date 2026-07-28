"use client";
import React from "react";
import RiskMatrix from "./RiskMatrix";
import Chip from "./Chip";
import WorldMap from "react-svg-worldmap";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedRisk } from "@/lib/riskSlice";

const MainReport = () => {
  const dispatch = useDispatch();
  const selectedRisk = useSelector((state) => state.risk.selected);

  // The reason rank is stored separated is because it is dynamically calculated based on risk score of entries displayed
  // after filtering

  const selectedRiskRank = useSelector((state) => state.risk.selectedRank); 
  let regionData = [];
  if (selectedRisk.regions) {
    // region data formatted to fit WorldMap component
    regionData = selectedRisk.regions.map((region) => {
      return { country: region, value: "" };
    });
  }

  return (
    <div className="w-1/2 border h-[90.3vh] overflow-y-scroll px-8 bg-white shadow-sm pt-12">
      <button
        onClick={() => dispatch(clearSelectedRisk())}
        className="z-50 float-right -mt-4"
      >
        ╳
      </button>
      <h1 className="text-4xl font-primary font-medium my-2">
        {selectedRisk.title}
      </h1>

      {selectedRisk.industries && (
        <div className="flex flex-wrap my-2">
          {selectedRisk.industries.map((tag, index) => (
            <Chip key={index} text={tag} />
          ))}
        </div>
      )}
      <div className="flex justify-around my-8 space-x-6">
        <div className="text-center">
          <p className="text-5xl font-primary">#{selectedRiskRank}</p>
          <p className="text-xl font-primary">Risk Ranking</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-primary">
            {selectedRisk.likelihood}
            <span className="text-3xl">/5</span>
          </p>
          <p className="text-xl font-primary">Impact Likelihood</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-primary">
            {selectedRisk.severity}
            <span className="text-3xl">/5</span>
          </p>
          <p className="text-xl font-primary">Impact Severity</p>
        </div>
      </div>
      <h2 className="text-2xl font-primary font-semibold">Summary</h2>
      <p className="my-2 font-secondary text-lg leading-[2.0]">{selectedRisk.summary}</p>
      {selectedRisk.regions && (
        <div>
          <h3 className="text-2xl font-primary font-semibold">
            Affected Regions
          </h3>
          <WorldMap
            borderColor="#000000"
            strokeOpacity="0.9"
            color="#006CD0"
            value-suffix="people"
            size="lg"
            data={regionData}
          />
        </div>
      )}
      <h3 className="text-2xl font-primary font-semibold">Risk Heatmap</h3>
      <div className="w-fit mx-auto mt-4 mb-20">
        <RiskMatrix
          likelihoodScore={selectedRisk.likelihood}
          sevScore={selectedRisk.severity}
          scaleUp={true}
        />
      </div>
      <h2 className="text-2xl font-semibold font-primary mt-8">
        Articles Referenced
      </h2>
      <p className="font-secondary italic">
        (Links open in a new tab, click the X button to close this report)
      </p>
      <ol className="list-decimal text-base list-inside mt-2 mb-4 font-secondary">
        <li>
          <a
            href={String(selectedRisk.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {String(selectedRisk.url)}
          </a>
        </li>
      </ol>
    </div>
  );
};

export default MainReport;