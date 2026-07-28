"use client";
import { useDispatch } from "react-redux";

// Slider thumb (selector) styling present in globals.css
const Slider = ({ value, valueUpdateAction }) => {
  const dispatch = useDispatch();
  const handleChange = (event) => {
    dispatch(valueUpdateAction(Number(event.target.value)));
  };

  return (
    <div className="px-4">
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={handleChange}
        className={`w-full h-2 bg-gradient-to-r from-primary-blue via-primary-blue to-gray-400 rounded-full appearance-none`}
        style={{
          background: `linear-gradient(to right, #006CD0 0%, #006CD0 ${
            (value - 1) * 25
          }%, #d1d5db ${(value - 1) * 25}%, #d1d5db 100%)`,
        }}
      />
      <div className="flex justify-between mt-2">
        <span>1</span>
        <span
          className={
            value > 1 && value < 5 ? `absolute z-50 text-center` : "hidden"
          }
          style={{ marginLeft: `calc(${(value - 1) * 20 - 1}% + 5px` }}
        >
          {value}
        </span>
        <span>5</span>
      </div>
    </div>
  );
};

export default Slider;
