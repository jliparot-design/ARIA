"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainReport from "@/components/MainReport";
import RiskEntry from "@/components/RiskEntry";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRiskData, fetchTopics } from "@/lib/riskSlice";

export default function Home() {
  const { items, loading, selected } = useSelector((state) => state.risk);
  const selectedTopics = useSelector((state) => state.filters.topics);
  const minSeverity = useSelector((state) => state.filters.minSeverity);
  const minLikelihood = useSelector((state) => state.filters.minLikelihood);

  const [resultCount, setResultCount] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRiskData());
    dispatch(fetchTopics()); 
  }, [dispatch]);

  useEffect(() => {
    if (items) {
      const filteredItems = items.filter((risk) => {
        return (
          risk.likelihood >= minLikelihood &&
          risk.severity >= minSeverity &&
          selectedTopics.includes(risk.topic)
        );
      });
      filteredItems.sort((a, b) => b.risk_score - a.risk_score);
      setResultCount(filteredItems.length);
      setFilteredItems(filteredItems);
    }
  }, [selectedTopics, minSeverity, minLikelihood, items]);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="flex float-right justify-end h-[90.3vh] w-3/4 items-center overflow-y-hidden">
        <div
          className={`${
            selected ? "w-1/2 px-4" : "w-full pl-8"
          } h-[90.3vh] overflow-y-scroll pt-6 flex flex-col`}
        >
          {selectedTopics.length > 0 ? (
            <div>
              <p className="text-2xl font-primary font-semibold">
                Selected topics:
              </p>
              <p className="text-xl font-primary mb-4">
                {selectedTopics.join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-2xl font-primary italic">
              No topics selected. Please select a topic from the sidebar to
              begin.
            </p>
          )}
          <span className="font-secondary text-lg">
            {loading && "Loading..."}
            {!loading &&
              items &&
              selectedTopics.length > 0 &&
              resultCount + " results found"}
          </span>
          {!loading &&
            items &&
            filteredItems.map((risk, index) => {
              return <RiskEntry key={index} rank={index + 1} risk={risk} />;
            })}
        </div>
        {selected && <MainReport />}
      </main>
    </div>
  );
}