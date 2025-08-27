import React from "react";
import { useDarkMode } from "../../contexts/darkModeContext";

const DRAMViewer = ({ data }) => {
  const { isDarkMode } = useDarkMode();

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const cardBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-50";

  // DRAM options mapping
  const dramOptions = [
    "Rarely or none of the time (less than 1 day per week)",
    "Some or little of the time (1-2 days per week)",
    "A moderate amount of time (3-4 days per week)",
    "Most of the time (5-7 days per week)"
  ];

  // Calculate DRAM scores and risk level
  const calculateDRAMScores = () => {
    // All 23 questions are scored
    const scoreFields = [
      'feelDownheartedAndSad', 'morningIsWhenIFeelBest', 'haveCryingSpells', 'haveTroubleGettingToSleep',
      'feelThatNobodyCares', 'eatAsMuchAsIUsedTo', 'stillEnjoySex', 'noticeIAmLosingWeight',
      'haveTroubleWithConstipation', 'heartBeatsFasterThanUsual', 'getTiredForNoReason', 'mindIsAsClearAsItUsedToBe',
      'tendToWakeUpTooEarly', 'findItEasyToDoThings', 'amRestlessAndCantKeepStill', 'feelHopefulAboutTheFuture',
      'amMoreIrritableThanUsual', 'findItEasyToMakeDecision', 'feelQuiteGuilty', 'feelThatIAmUsefulAndNeeded',
      'myLifeIsPrettyFull', 'feelThatOthersWouldBeBetterOff', 'amStillAbleToEnjoyThings'
    ];

    const totalScore = scoreFields.reduce((sum, field) => sum + (data[field] || 0), 0);

    // Determine risk level based on DRAM scoring
    let riskLevel = "Normal";
    if (totalScore > 30) riskLevel = "Distressed Depressive";
    else if (totalScore > 20) riskLevel = "At Risk";
    else if (totalScore > 16) riskLevel = "Distressed Somatic";
    else riskLevel = "Normal";

    return { totalScore, riskLevel };
  };

  const { totalScore, riskLevel } = calculateDRAMScores();

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
            <div className={`text-sm ${textSecondaryColor}`}>/ 69</div>
          </div>
          
          <div className={`${cardBgColor} p-4 rounded-lg ${borderColor} border`}>
            <div className={`text-sm ${textSecondaryColor}`}>Risk Level</div>
            <div className={`text-lg font-semibold text-orange-600`}>
              {riskLevel}
            </div>
          </div>
        </div>

        {/* Question Scores */}
        <div className="mt-6">
          <h4 className={`text-lg font-semibold mb-3 ${textColor}`}>Question Scores</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {[
               { name: "I feel downhearted and sad", field: "feelDownheartedAndSad" },
               { name: "Morning is when I feel best", field: "morningIsWhenIFeelBest" },
               { name: "I have crying spells or feel like it", field: "haveCryingSpells" },
               { name: "I have trouble getting to sleep at night", field: "haveTroubleGettingToSleep" },
               { name: "I feel that nobody cares", field: "feelThatNobodyCares" },
               { name: "I eat as much as I used to", field: "eatAsMuchAsIUsedTo" },
               { name: "I still enjoy sex", field: "stillEnjoySex" },
               { name: "I notice I am losing weight", field: "noticeIAmLosingWeight" },
               { name: "I have trouble with constipation", field: "haveTroubleWithConstipation" },
               { name: "My heart beats faster than usual", field: "heartBeatsFasterThanUsual" },
               { name: "I get tired for no reason", field: "getTiredForNoReason" },
               { name: "My mind is as clear as it used to be", field: "mindIsAsClearAsItUsedToBe" },
               { name: "I tend to wake up too early", field: "tendToWakeUpTooEarly" },
               { name: "I find it easy to do the things I use to", field: "findItEasyToDoThings" },
               { name: "I am restless and can't keep still", field: "amRestlessAndCantKeepStill" },
               { name: "I feel hopeful about the future", field: "feelHopefulAboutTheFuture" },
               { name: "I am more irritable than usual", field: "amMoreIrritableThanUsual" },
               { name: "I find it easy to make a decision", field: "findItEasyToMakeDecision" },
               { name: "I feel quite guilty", field: "feelQuiteGuilty" },
               { name: "I feel that I am useful and needed", field: "feelThatIAmUsefulAndNeeded" },
               { name: "My life is pretty full", field: "myLifeIsPrettyFull" },
               { name: "I feel that others would be better off if I were dead", field: "feelThatOthersWouldBeBetterOff" },
               { name: "I am still able to enjoy the things I used to", field: "amStillAbleToEnjoyThings" }
                           ].map((question, index) => {
                const score = data[question.field] || 0;
                const selectedOption = dramOptions[score] || "Not answered";
                              return (
                  <div key={question.field} className={`${cardBgColor} p-3 rounded ${borderColor} border`}>
                    <div className={`text-sm ${textSecondaryColor} mb-1`}>Q{index + 1}</div>
                    <div className={`font-medium ${textColor} mb-1`}>{question.name}</div>
                    <div className={`font-semibold ${textColor} mb-1`}>{score}/3</div>
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
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Psychological Assessment</h4>
            <p className={`${textSecondaryColor} mb-2`}>
              The Distress and Risk Assessment Method (DRAM) is a psychological screening tool 
              for patients with pain problems. The patient's total score of 
              <span className={`font-semibold ${textColor}`}> {totalScore}/69</span> indicates 
              <span className={`font-semibold text-orange-600`}> {riskLevel.toLowerCase()}</span> risk level.
            </p>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Risk Level Interpretation</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• <span className={`font-medium ${textColor}`}>Normal:</span> Modified Zung &lt;17</li>
              <li>• <span className={`font-medium ${textColor}`}>At Risk:</span> Modified Zung 17-33 and MSPQ &lt;12</li>
              <li>• <span className={`font-medium ${textColor}`}>Distressed Depressive:</span> Modified Zung &gt;33</li>
              <li>• <span className={`font-medium ${textColor}`}>Distressed Somatic:</span> Modified Zung 17-33 and MSPQ &gt;12</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Clinical Considerations</h4>
            <ul className={`${textSecondaryColor} space-y-1`}>
              <li>• The DRAM is designed as a first-stage screening procedure for psychological assessment</li>
              <li>• Each question is scored on a 0-3 scale based on frequency of symptoms</li>
              <li>• Higher scores indicate greater psychological distress and risk</li>
              <li>• The assessment helps identify patients who may need comprehensive psychological evaluation</li>
            </ul>
          </div>

          <div>
            <h4 className={`text-lg font-medium mb-2 ${textColor}`}>Recommendations</h4>
            <p className={`${textSecondaryColor}`}>
              Based on the current risk level, consider appropriate psychological assessment, 
              referral to mental health professionals, or comprehensive psychophysiological 
              evaluation as clinically indicated. The DRAM serves as a screening tool to alert 
              clinicians to the need for more detailed psychological evaluation in patients with 
              chronic pain conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DRAMViewer;
