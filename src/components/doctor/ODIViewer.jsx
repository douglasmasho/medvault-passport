import React from "react";
import { useDarkMode } from "../../contexts/darkModeContext";

const ODIViewer = ({ data }) => {
  const { isDarkMode } = useDarkMode();

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-50";

  // Calculate ODI score and disability level
  const calculateODIScore = () => {
    const totalScore =
      (data.painIntensity || 0) +
      (data.personalCare || 0) +
      (data.lifting || 0) +
      (data.walking || 0) +
      (data.sitting || 0) +
      (data.standing || 0) +
      (data.sleeping || 0) +
      (data.sexLife || 0) +
      (data.socialLife || 0) +
      (data.travelling || 0);

    const percentage = (totalScore / 50) * 100;
    
    let disabilityLevel = "Minimal Disability";
    if (percentage >= 81) disabilityLevel = "Bed-bound";
    else if (percentage >= 61) disabilityLevel = "Crippled";
    else if (percentage >= 41) disabilityLevel = "Severe Disability";
    else if (percentage >= 21) disabilityLevel = "Moderate Disability";

    return { totalScore, percentage, disabilityLevel };
  };

  const { totalScore, percentage, disabilityLevel } = calculateODIScore();

  return (
    <div className={`${bgColor} rounded-lg p-6 ${borderColor} border`}>
      {/* Overview Section */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
            <div className={`text-sm ${textSecondaryColor}`}>Total Score</div>
            <div className={`text-2xl font-bold text-green-600`}>
              {totalScore}
            </div>
            <div className={`text-sm ${textSecondaryColor}`}>/ 50</div>
          </div>
          
          <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
            <div className={`text-sm ${textSecondaryColor}`}>Percentage</div>
            <div className={`text-2xl font-bold text-blue-600`}>
              {percentage.toFixed(1)}%
            </div>
            <div className={`text-sm ${textSecondaryColor}`}>/ 100%</div>
          </div>
          
          <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
            <div className={`text-sm ${textSecondaryColor}`}>Disability Level</div>
            <div className={`text-lg font-semibold text-orange-600`}>
              {disabilityLevel}
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="mt-6">
          <h4 className={`text-lg font-semibold mb-3 ${textColor}`}>Section Scores</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "Pain Intensity", field: "painIntensity" },
              { name: "Personal Care", field: "personalCare" },
              { name: "Lifting", field: "lifting" },
              { name: "Walking", field: "walking" },
              { name: "Sitting", field: "sitting" },
              { name: "Standing", field: "standing" },
              { name: "Sleeping", field: "sleeping" },
              { name: "Sex Life", field: "sexLife" },
              { name: "Social Life", field: "socialLife" },
              { name: "Travelling", field: "travelling" }
            ].map((section) => {
              const score = data[section.field] || 0;
              return (
                <div key={section.field} className={`${cardBgColor} p-3 rounded ${borderColor} border`}>
                  <span className={`font-medium ${textColor}`}>{section.name}: </span>
                  <span className={`font-semibold ${textColor}`}>{score}/5</span>
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
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Disability Assessment</h4>
            <p className={`${textSecondaryColor} mb-2`}>
              The Oswestry Disability Index (ODI) is a validated measure for quantifying disability related to low back pain. 
              The patient's score of <span className={`font-semibold ${textColor}`}>{totalScore}/50</span> 
              (equivalent to <span className={`font-semibold ${textColor}`}>{percentage.toFixed(1)}%</span>) 
              indicates <span className={`font-semibold text-orange-600`}>{disabilityLevel.toLowerCase()}</span>.
            </p>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Score Interpretation</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• <span className={`font-medium ${textColor}`}>0-20% (0-10 points):</span> Minimal disability</li>
              <li>• <span className={`font-medium ${textColor}`}>21-40% (11-20 points):</span> Moderate disability</li>
              <li>• <span className={`font-medium ${textColor}`}>41-60% (21-30 points):</span> Severe disability</li>
              <li>• <span className={`font-medium ${textColor}`}>61-80% (31-40 points):</span> Crippled</li>
              <li>• <span className={`font-medium ${textColor}`}>81-100% (41-50 points):</span> Bed-bound</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Clinical Considerations</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• The ODI is considered the gold standard for low back functional outcome measures</li>
              <li>• A change of 10-12 points represents meaningful clinical improvement</li>
              <li>• Each section score ranges from 0 (least disability) to 5 (greatest disability)</li>
              <li>• The assessment covers 10 functional domains relevant to daily activities</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Recommendations</h4>
            <p className={`${textSecondaryColor}`}>
              Based on the current disability level, consider appropriate interventions including 
              physical therapy, pain management strategies, and functional rehabilitation programs. 
              Regular reassessment using the ODI can help track treatment progress and guide 
              therapeutic decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ODIViewer;
