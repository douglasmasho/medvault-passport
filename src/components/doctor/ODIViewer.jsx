import React from "react";
import { useDarkMode } from "../../contexts/darkModeContext";

const ODIViewer = ({ data }) => {
  const { isDarkMode } = useDarkMode();

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-50";

  // ODI options mapping for each section
  const odiOptions = {
    painIntensity: [
      "I have no pain at the moment",
      "The pain is very mild at the moment",
      "The pain is moderate at the moment",
      "The pain is fairly severe at the moment",
      "The pain is very severe at the moment",
      "The pain is the worst imaginable at the moment"
    ],
    personalCare: [
      "I can look after myself normally without causing extra pain",
      "I can look after myself normally but it causes extra pain",
      "It is painful to look after myself and I am slow and careful",
      "I need some help but manage most of my personal care",
      "I need help every day in most aspects of self care",
      "I do not get dressed, wash with difficulty and stay in bed"
    ],
    lifting: [
      "I can lift heavy weights without extra pain",
      "I can lift heavy weights but it gives extra pain",
      "Pain prevents me from lifting heavy weights off the floor but I can manage if they are conveniently positioned e.g. on a table",
      "Pain prevents me from lifting heavy weights but I can manage light to medium weights if they are conveniently positioned",
      "I can lift only very light weights",
      "I cannot lift or carry anything at all"
    ],
    walking: [
      "Pain does not prevent me walking any distance",
      "Pain prevents me walking more than one kilometre",
      "Pain prevents me walking more than 250 metres",
      "Pain prevents me walking more than 100 metres",
      "I can only walk using a stick or crutches",
      "I am in bed most of the time and have to crawl to the toilet"
    ],
    sitting: [
      "I can sit in any chair as long as I like",
      "I can sit in my favourite chair as long as I like",
      "Pain prevents me from sitting more than 1 hour",
      "Pain prevents me from sitting for more than half an hour",
      "Pain prevents me from sitting for more than 10 minutes",
      "Pain prevents me from sitting at all"
    ],
    standing: [
      "I can stand as long as I want without extra pain",
      "I can stand as long as I want but it gives me extra pain",
      "Pain prevents me from standing for more than 1 hour",
      "Pain prevents me from standing for more than half an hour",
      "Pain prevents me from standing for more than 10 minutes",
      "Pain prevents me from standing at all"
    ],
    sleeping: [
      "My sleep is never disturbed by pain",
      "My sleep is occasionally disturbed by pain",
      "Because of pain, I have less than 6 hours of sleep",
      "Because of pain, I have less than 4 hours of sleep",
      "Because of pain, I have less than 2 hours of sleep",
      "Pain prevents me from sleeping at all"
    ],
    sexLife: [
      "My sex life is normal and causes no extra pain",
      "My sex life is normal but causes some extra pain",
      "My sex life is nearly normal but is very painful",
      "My sex life is severely restricted by pain",
      "My sex life is nearly absent because of pain",
      "Pain prevents any sex life at all"
    ],
    socialLife: [
      "My social life is normal and causes me no extra pain",
      "My social life is normal but increases the degree of pain",
      "Pain has no significant effect on my social life apart from limiting my more energetic interest e.g. sports",
      "Pain has restricted my social life and I do not go out as often",
      "Pain has restricted social life to my home",
      "I have no social life because of pain"
    ],
    travelling: [
      "I can travel anywhere without pain",
      "I can travel anywhere but it gives extra pain",
      "Pain is bad but I manage journeys when necessary",
      "Pain restricts my travel a lot",
      "Pain restricts me to my home only",
      "I cannot travel at all because of pain"
    ]
  };

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
            ].map((section, index) => {
              const score = data[section.field] || 0;
              const selectedOption = odiOptions[section.field] ? odiOptions[section.field][score] : "Not answered";
              return (
                <div key={section.field} className={`${cardBgColor} p-3 rounded ${borderColor} border`}>
                  <div className={`text-sm ${textSecondaryColor} mb-1`}>Section {index + 1}</div>
                  <div className={`font-medium ${textColor} mb-1`}>{section.name}</div>
                  <div className={`font-semibold ${textColor} mb-1`}>{score}/5</div>
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
