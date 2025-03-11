import React, { useState } from "react";
import PipelineList from "./Pipeline/PipelineList";
import LeadStagesList from "./LeadStages/LeadStagesList";
import DealStagesList from "./DealStages/DealStagesList";
import SourcesList from "./Sources/SourcesList";
import LabelsList from "./Labels/LabelsList";
import ContractTypeList from "./ContractType/ContractTypeList";

const SystemSetupList = () => {
  const [selectedSection, setSelectedSection] = useState("pipeline");
  const renderContent = () => {
    switch (selectedSection) {
      case "pipeline":
        return <PipelineList />;
      case "leadstages":
        return <LeadStagesList />;
      case "dealstages":
        return <DealStagesList />;
      case "sources":
        return <SourcesList />;
      case "labels":
        return <LabelsList />;
      case "contracttype":
        return <ContractTypeList />;
      default:
        return <PipelineList />;
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row ml-[-24px] mb-[-24px] rounded-b-lg mt-[-51px] rounded-t-lg mr-[-24px] bg-gray-100">
        <div className="sm:w-full md:w-[95%] md:mr-[30px] lg:w-[240px] md:ml-[23px] h-full mt-16 px-[30px] md:p-0 lg:p-0">
          <ul className="">
            <li
              onClick={() => setSelectedSection("pipeline")}
              className={`cursor-pointer p-3 flex justify-between rounded-t-lg ${selectedSection === "pipeline"
                ? "bg-blue-500 text-white"
                : "bg-white"
                }`}
            >
              Pipeline
            </li>
            <li
              onClick={() => setSelectedSection("leadstages")}
              className={`cursor-pointer p-3 flex justify-between ${selectedSection === "leadstages"
                ? "bg-blue-500 text-white"
                : "bg-white"
                }`}
            >
              Lead Stages
            </li>
            <li
              onClick={() => setSelectedSection("dealstages")}
              className={`cursor-pointer p-3 flex justify-between ${selectedSection === "dealstages"
                ? "bg-blue-500 text-white"
                : "bg-white"
                }`}
            >
              Deal Stages
            </li>
            <li
              onClick={() => setSelectedSection("sources")}
              className={`cursor-pointer p-3 flex justify-between ${selectedSection === "sources"
                ? "bg-blue-500 text-white"
                : "bg-white"
                }`}
            >
              Sources
            </li>
            <li
              onClick={() => setSelectedSection("labels")}
              className={`cursor-pointer p-3 flex justify-between ${selectedSection === "labels"
                ? "bg-blue-500 text-white"
                : "bg-white"
                }`}
            >
              Labels
            </li>
            <li
              onClick={() => setSelectedSection("contracttype")}
              className={`cursor-pointer p-3 flex justify-between ${selectedSection === "contracttype"
                ? "bg-blue-500 text-white"
                : "bg-white"
                }`}
            >
              Contract Type
            </li>
          </ul>
        </div>
        <div className="flex-1 lg:ml-[-23px] p-4 mt-[30px]">
          <div className="m-2 rounded-lg">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default SystemSetupList;
