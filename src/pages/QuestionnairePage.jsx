import React from 'react';
import Header from "../components/common/Header";
import { User } from "lucide-react";
import Questionnaire from "../components/Questionnaire";
import { useDarkMode } from "../contexts/darkModeContext"; 


const QuestionnairePage = () => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Header
        title="Health Questionnaire"
        icon={<User style={{ marginRight: "10px" }} />}
      />
      <div className="flex justify-center items-center min-h-screen">
        <Questionnaire />
      </div>
    </div>
  );
};

export default QuestionnairePage;
