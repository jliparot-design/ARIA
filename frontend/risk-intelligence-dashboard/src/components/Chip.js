import React from "react";
import { useSelector } from "react-redux";

const Chip = ({ text, selected = false, oneline = false }) => {
  const selectedRisk = useSelector((state) => state.risk.selected);

  return (
    <p
      className={`${selectedRisk ? "text-sm" : ""} ${
        selected
          ? "bg-white text-primary-blue-dark"
          : "bg-primary-blue-dark text-white"
      }  w-fit inline-block mt-1.5 mr-1.5 font-primary  py-1 px-2 rounded-lg`}
    >
      {oneline && text.length > 20 ? text.substring(0, 20)+'...' : text}
    </p>
  );
};

export default Chip;
