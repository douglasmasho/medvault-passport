import React from "react";
import { useDarkMode } from "../../contexts/darkModeContext";

const ISIViewer = ({ data }) => {
  const { isDarkMode } = useDarkMode();

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-50";

  // ISI options mapping for each question
  const isiOptions = {
    difficultyFallingAsleep: ["None", "Mild", "Moderate", "Severe", "Very Severe"],
    difficultyStayingAsleep: ["None", "Mild", "Moderate", "Severe", "Very Severe"],
    problemsWakingUpEarly: ["None", "Mild", "Moderate", "Severe", "Very Severe"],
    sleepSatisfaction: ["Very Satisfied", "Satisfied", "Moderately Satisfied", "Dissatisfied", "Very Dissatisfied"],
    sleepProblemNoticeable: ["Not at all Noticeable", "A Little Noticeable", "Somewhat Noticeable", "Much Noticeable", "Very much Noticeable"],
    worriedAboutSleep: ["Not at all Worried", "A Little Worried", "Somewhat Worried", "Much Worried", "Very much Worried"],
    sleepInterferesWithDaily: ["Not at all Interfering", "A Little Interfering", "Somewhat Interfering", "Much Interfering", "Very much Interfering"]
  };

  // Calculate ISI score and severity level
  const calculateISIScore = () => {
    const totalScore =
      (data.difficultyFallingAsleep || 0) +
      (data.difficultyStayingAsleep || 0) +
      (data.problemsWakingUpEarly || 0) +
      (data.sleepSatisfaction || 0) +
      (data.sleepProblemNoticeable || 0) +
      (data.worriedAboutSleep || 0) +
      (data.sleepInterferesWithDaily || 0);

    let severityLevel = "Absence of Insomnia";
    if (totalScore >= 22) severityLevel = "Severe Insomnia";
    else if (totalScore >= 15) severityLevel = "Moderate Insomnia";
    else if (totalScore >= 8) severityLevel = "Sub-threshold Insomnia";

    return { totalScore, severityLevel };
  };

  const { totalScore, severityLevel } = calculateISIScore();

  return (
    <div className={`${bgColor} rounded-lg p-6 ${borderColor} border`}>
      {/* Overview Section */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
            <div className={`text-sm ${textSecondaryColor}`}>Total Score</div>
            <div className={`text-2xl font-bold text-green-600`}>
              {totalScore}
            </div>
            <div className={`text-sm ${textSecondaryColor}`}>/ 28</div>
          </div>
          
          <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
            <div className={`text-sm ${textSecondaryColor}`}>Severity Level</div>
            <div className={`text-lg font-semibold text-orange-600`}>
              {severityLevel}
            </div>
          </div>
        </div>

        {/* Question Scores */}
        <div className="mt-6">
          <h4 className={`text-lg font-semibold mb-3 ${textColor}`}>Question Scores</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {[
               { name: "Difficulty falling asleep", field: "difficultyFallingAsleep" },
               { name: "Difficulty staying asleep", field: "difficultyStayingAsleep" },
               { name: "Problems waking up early", field: "problemsWakingUpEarly" },
               { name: "Satisfaction with sleep", field: "sleepSatisfaction" },
               { name: "Noticeable to others", field: "sleepProblemNoticeable" },
               { name: "Worried about sleep", field: "worriedAboutSleep" },
               { name: "Interference with daily functioning", field: "sleepInterferesWithDaily" }
                           ].map((question, index) => {
                const score = data[question.field] || 0;
                const selectedOption = isiOptions[question.field] ? isiOptions[question.field][score] : "Not answered";
                              return (
                  <div key={question.field} className={`${cardBgColor} p-3 rounded ${borderColor} border`}>
                    <div className={`text-sm ${textSecondaryColor} mb-1`}>Q{index + 1}</div>
                    <div className={`font-medium ${textColor} mb-1`}>{question.name}</div>
                    <div className={`font-semibold ${textColor} mb-1`}>{score}/4</div>
                    <div className={`${textSecondaryColor} italic`}>{selectedOption}</div>
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* Clinical Interpretation */}
      <div className={`${cardBgColor} p-6 rounded-lg ${borderColor} border`}>
        <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Clinical Interpretation</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Insomnia Assessment</h4>
            <p className={`${textSecondaryColor} mb-2`}>
              The Insomnia Severity Index (ISI) is a validated 7-item self-report questionnaire 
              that assesses the nature, severity, and impact of insomnia. The patient's total score 
              of <span className={`font-semibold ${textColor}`}>{totalScore}/28</span> indicates 
              <span className={`font-semibold text-orange-600`}> {severityLevel.toLowerCase()}</span>.
            </p>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Score Interpretation</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• <span className={`font-medium ${textColor}`}>0-7:</span> Absence of insomnia</li>
              <li>• <span className={`font-medium ${textColor}`}>8-14:</span> Sub-threshold insomnia</li>
              <li>• <span className={`font-medium ${textColor}`}>15-21:</span> Moderate insomnia</li>
              <li>• <span className={`font-medium ${textColor}`}>22-28:</span> Severe insomnia</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Clinical Considerations</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• The ISI assesses insomnia severity over the past 2 weeks</li>
              <li>• Each question is scored on a 0-4 scale (0 = no problem, 4 = very severe problem)</li>
              <li>• The assessment covers sleep onset, maintenance, early awakening, satisfaction, and impact</li>
              <li>• Higher scores indicate greater insomnia severity and impact on daily functioning</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Recommendations</h4>
            <p className={`${textSecondaryColor}`}>
              Based on the current insomnia severity level, consider appropriate sleep hygiene 
              education, cognitive behavioral therapy for insomnia (CBT-I), or pharmacological 
              interventions as clinically indicated. Regular reassessment using the ISI can help 
              track treatment response and guide therapeutic decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISIViewer;
