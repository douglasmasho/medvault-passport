import React from "react";
import { useDarkMode } from "../../contexts/darkModeContext";

const MSPQViewer = ({ data }) => {
  const { isDarkMode } = useDarkMode();

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-50";

  // MSPQ options mapping
  const mspqOptions = [
    "Not at all",
    "A little, slightly",
    "A great deal, quite a bit",
    "Extremely"
  ];

  // Calculate MSPQ score and severity level
  const calculateMSPQScore = () => {
    // All 22 questions are scored
    const scoreFields = [
      'heartRateIncrease', 'feelingHotAllOver', 'sweatingAllOver', 'sweatingInParticularPart',
      'pulseInNeck', 'poundingInHead', 'dizziness', 'blurringOfVision', 'feelingFaint',
      'everythingAppearingUnreal', 'nausea', 'butterfliesInStomach', 'painOrAcheInStomach',
      'stomachChurning', 'desireToPassWater', 'mouthBecomingDry', 'difficultySwallowing',
      'musclesInNeckAching', 'legsFeelingWeak', 'musclesTwitchingOrJumping',
      'tenseFeelingAcrossForehead', 'tenseFeelingInJawMuscles'
    ];

    const totalScore = scoreFields.reduce((sum, field) => sum + (data[field] || 0), 0);

    let severityLevel = "Normal";
    if (totalScore > 66) severityLevel = "Very High";
    else if (totalScore > 44) severityLevel = "High";
    else if (totalScore > 22) severityLevel = "Moderate";
    else if (totalScore > 0) severityLevel = "Low";

    return { totalScore, severityLevel };
  };

  const { totalScore, severityLevel } = calculateMSPQScore();

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
            <div className={`text-sm ${textSecondaryColor}`}>/ 88</div>
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
              { name: "Heart rate increase", field: "heartRateIncrease" },
              { name: "Feeling hot all over", field: "feelingHotAllOver" },
              { name: "Sweating all over", field: "sweatingAllOver" },
              { name: "Sweating in particular part", field: "sweatingInParticularPart" },
              { name: "Pulse in neck", field: "pulseInNeck" },
              { name: "Pounding in head", field: "poundingInHead" },
              { name: "Dizziness", field: "dizziness" },
              { name: "Blurring of vision", field: "blurringOfVision" },
              { name: "Feeling faint", field: "feelingFaint" },
              { name: "Everything appearing unreal", field: "everythingAppearingUnreal" },
              { name: "Nausea", field: "nausea" },
              { name: "Butterflies in stomach", field: "butterfliesInStomach" },
              { name: "Pain or ache in stomach", field: "painOrAcheInStomach" },
              { name: "Stomach churning", field: "stomachChurning" },
              { name: "Desire to pass water", field: "desireToPassWater" },
              { name: "Mouth becoming dry", field: "mouthBecomingDry" },
              { name: "Difficulty swallowing", field: "difficultySwallowing" },
              { name: "Muscles in neck aching", field: "musclesInNeckAching" },
              { name: "Legs feeling weak", field: "legsFeelingWeak" },
              { name: "Muscles twitching or jumping", field: "musclesTwitchingOrJumping" },
              { name: "Tense feeling across forehead", field: "tenseFeelingAcrossForehead" },
              { name: "Tense feeling in jaw muscles", field: "tenseFeelingInJawMuscles" }
                                                   ].map((question, index) => {
                const score = data[question.field] || 0;
                const selectedOption = mspqOptions[score] || "Not answered";
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
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Somatic Perceptions Assessment</h4>
            <p className={`${textSecondaryColor} mb-2`}>
              The Modified Somatic Perceptions Questionnaire (MSPQ) is a validated 22-item 
              self-report measure that assesses somatic symptoms and perceptions. The patient's 
              total score of <span className={`font-semibold ${textColor}`}>{totalScore}/88</span> indicates 
              <span className={`font-semibold text-orange-600`}> {severityLevel.toLowerCase()}</span> somatic perceptions.
            </p>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Score Interpretation</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• <span className={`font-medium ${textColor}`}>0-22:</span> Low somatic perceptions</li>
              <li>• <span className={`font-medium ${textColor}`}>23-44:</span> Moderate somatic perceptions</li>
              <li>• <span className={`font-medium ${textColor}`}>45-66:</span> High somatic perceptions</li>
              <li>• <span className={`font-medium ${textColor}`}>67-88:</span> Very high somatic perceptions</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Clinical Considerations</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• The MSPQ assesses somatic symptoms experienced during the past week</li>
              <li>• Each question is scored on a 0-4 scale (0 = not at all, 4 = extremely)</li>
              <li>• Higher scores indicate greater somatic awareness and symptom reporting</li>
              <li>• The assessment covers cardiovascular, gastrointestinal, and musculoskeletal symptoms</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Recommendations</h4>
            <p className={`${textSecondaryColor}`}>
              Based on the current somatic perceptions level, consider appropriate psychological 
              assessment, pain management strategies, or referral to mental health professionals 
              as clinically indicated. The MSPQ can be used as part of a comprehensive 
              psychological evaluation for patients with chronic pain conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MSPQViewer;
