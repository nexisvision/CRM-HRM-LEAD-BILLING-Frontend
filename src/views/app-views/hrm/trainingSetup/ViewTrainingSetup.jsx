import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { useSelector } from "react-redux";
import { GetallTrainng } from "./TrainingReducer/TrainingSlice";
import { useDispatch } from "react-redux";

const ViewTrainingSetup = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const allempdata = useSelector((state) => state.Training);
  const Expensedata = allempdata?.Training?.data || [];

  const milestone = Expensedata.find((item) => item.id === idd);

  const parsedLinks = milestone?.links ? JSON.parse(milestone.links) : {};
  const linksArray = Object.values(parsedLinks);

  const [isPlaying, setIsPlaying] = useState(
    Array(linksArray.length).fill(false)
  );

  const handlePlay = (index) => {
    const newPlayingState = [...isPlaying];
    newPlayingState[index] = true;
    setIsPlaying(newPlayingState);
  };

  const getEmbedUrl = (url) => {
    try {
      let videoId = "";

      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      }
      else if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }
      else if (url.includes("youtube.com/embed")) {
        return url;
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return url;
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      return url;
    }
  };

  useEffect(() => {
    dispatch(GetallTrainng());
  }, [dispatch]);

  return (
    <div className="bg-slate-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-24px] rounded-xl">
      <div className="container mx-auto p-6 mt-[-52px]">
        <h1 className="text-3xl font-bold text-center text-gray-500 mb-8">
          {milestone?.category}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {linksArray.map((video, index) => (
            <Card key={index} className="bg-slate-100">
              <div className="relative rounded-lg  overflow-hidden">
                {!isPlaying[index] && (
                  <button
                    onClick={() => handlePlay(index)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-all"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                )}
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-[315px]"
                    src={getEmbedUrl(video.url)}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <h3 className="mt-4 text-xl text-center font-semibold text-gray-800">
                {video.title}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewTrainingSetup;
