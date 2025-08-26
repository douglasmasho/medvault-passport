import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MapPin, FileText, AlertTriangle } from "lucide-react";
import DoctorPainViewer from "../pain-mapper/Doctor";
import { useDarkMode } from "../../contexts/darkModeContext";

const VASViewer = ({ data, patientId }) => {
  const [painData, setPainData] = useState([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    console.log("VASViewer received data:", data);
    
    // Extract pain mapping data from VAS questionnaire
    if (data.painMapperData && Array.isArray(data.painMapperData)) {
      console.log("Found pain mapping data:", data.painMapperData);
      setPainData(data.painMapperData);
    } else {
      console.log("No pain mapping data found in:", data);
    }
  }, [data]);

  // Calculate VAS score and severity - use current pain from vasAnswers
  const vasScore = data.vasAnswers?.currentPain || data.summary?.currentPain || 0;
  const getSeverityLevel = (score) => {
    if (score === 0) return { level: "No pain", color: "text-green-600", bgColor: "bg-green-100" };
    if (score >= 1 && score <= 3) return { level: "Mild pain", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (score >= 4 && score <= 6) return { level: "Moderate pain", color: "text-orange-600", bgColor: "bg-orange-100" };
    if (score >= 7 && score <= 10) return { level: "Severe pain", color: "text-red-600", bgColor: "bg-red-100" };
    return { level: "Unknown", color: "text-gray-600", bgColor: "bg-gray-100" };
  };

  const severity = getSeverityLevel(vasScore);

  // Set dynamic colors based on the mode
  const cardBgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${cardBgColor} rounded-lg shadow-sm border ${borderColor} p-6`}
      >
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
          <h2 className={`text-xl font-semibold ${textColor}`}>VAS Assessment Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Current Pain */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${textColor} mb-2`}>{data.vasAnswers?.currentPain || 0}</div>
            <div className={`text-sm ${textSecondaryColor}`}>Current Pain</div>
            <div className="text-xs text-gray-400">(0-10 scale)</div>
          </div>

          {/* Worst Pain */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${textColor} mb-2`}>{data.vasAnswers?.worstPain || 0}</div>
            <div className={`text-sm ${textSecondaryColor}`}>Worst Pain</div>
            <div className="text-xs text-gray-400">(0-10 scale)</div>
          </div>

          {/* Average Pain */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${textColor} mb-2`}>{data.vasAnswers?.averagePain || 0}</div>
            <div className={`text-sm ${textSecondaryColor}`}>Average Pain</div>
            <div className="text-xs text-gray-400">(0-10 scale)</div>
          </div>

          {/* Pain Markers */}
          <div className="text-center">
            <div className={`text-3xl font-bold ${textColor} mb-2`}>{data.summary?.totalPainMarkers || 0}</div>
            <div className={`text-sm ${textSecondaryColor}`}>Pain Areas</div>
            <div className="text-xs text-gray-400">Marked on body</div>
          </div>
        </div>

        {/* Pain Severity Level */}
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${severity.bgColor} ${severity.color}`}>
            {severity.level}
          </div>
          <div className={`text-sm ${textSecondaryColor} mt-2`}>Overall Pain Severity</div>
        </div>

        {/* Pain Summary */}
        {data.summary && (
          <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <div className={`text-sm font-medium ${textColor} mb-2`}>Pain Summary</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className={textSecondaryColor}>Pain Range: </span>
                <span className={textColor}>{data.summary.painRange}</span>
              </div>
              <div>
                <span className={textSecondaryColor}>Least Pain: </span>
                <span className={textColor}>{data.summary.leastPain}</span>
              </div>

            </div>
          </div>
        )}
      </motion.div>

      {/* Pain Mapping Section */}
      {painData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${cardBgColor} rounded-lg shadow-sm border ${borderColor} overflow-hidden`}
        >
          <div className={`flex items-center p-6 border-b ${borderColor}`}>
            <MapPin className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className={`text-xl font-semibold ${textColor}`}>Pain Mapping</h2>
          </div>
          
          <div className="">
            <DoctorPainViewer 
              painData={painData}
              patientId={patientId}
              assessmentDate={data.timestamp}
            />
          </div>
        </motion.div>
      )}

      {/* Clinical Interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`${cardBgColor} rounded-lg shadow-sm border ${borderColor} p-6`}
      >
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className={`text-xl font-semibold ${textColor}`}>Clinical Interpretation</h2>
        </div>

        <div className="prose max-w-none">
          <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} border-l-4 border-blue-400 p-4 mb-6`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  Visual Analog Scale (VAS) Interpretation
                </h3>
                <div className={`mt-2 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <p>
                    The visual analog scale (VAS) is a tool widely used to measure pain. A patient is asked to
                    indicate his/her perceived pain intensity (most commonly) along a 100 mm horizontal
                    line, and this rating is then measured from the left edge (=VAS score).
                  </p>
                  <p className="mt-2 font-medium">
                    Where 0 = no pain, 1-3 = mild, 4-6 = moderate and 7-10 = severe pain
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-2`}>Current Assessment</h3>
              <p className={textColor}>
                Patient reports current pain level of <strong>{data.vasAnswers?.currentPain || 0}/10</strong>, 
                worst pain of <strong>{data.vasAnswers?.worstPain || 0}/10</strong>, and average pain of 
                <strong> {data.vasAnswers?.averagePain || 0}/10</strong>. The current pain level falls into the 
                <span className={`font-medium ${severity.color}`}> {severity.level.toLowerCase()}</span> category.
              </p>
            </div>

            {data.vasAnswers?.currentPain > 0 && (
              <div>
                <h3 className={`text-lg font-medium ${textColor} mb-2`}>Clinical Considerations</h3>
                <ul className={`list-disc list-inside space-y-1 ${textColor}`}>
                  {data.vasAnswers.currentPain >= 7 && (
                    <li>Severe pain requires immediate attention and may indicate acute pathology</li>
                  )}
                  {data.vasAnswers.currentPain >= 4 && data.vasAnswers.currentPain <= 6 && (
                    <li>Moderate pain suggests ongoing pathology that requires treatment planning</li>
                  )}
                  {data.vasAnswers.currentPain >= 1 && data.vasAnswers.currentPain <= 3 && (
                    <li>Mild pain may be managed with conservative measures</li>
                  )}
                  {painData.length > 0 && (
                    <li>Multiple pain locations identified - consider comprehensive assessment</li>
                  )}
                  <li>Consider functional impact and quality of life implications</li>
                  <li>Monitor for changes in pain patterns over time</li>
                </ul>
              </div>
            )}

            <div>
              <h3 className={`text-lg font-medium ${textColor} mb-2`}>Recommendations</h3>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <ul className={`list-disc list-inside space-y-1 ${textColor}`}>
                  {data.vasAnswers?.currentPain >= 7 && (
                    <>
                      <li>Immediate pain management intervention recommended</li>
                      <li>Consider imaging studies to identify underlying pathology</li>
                      <li>Evaluate for red flags requiring urgent referral</li>
                    </>
                  )}
                  {data.vasAnswers?.currentPain >= 4 && data.vasAnswers?.currentPain <= 6 && (
                    <>
                      <li>Develop comprehensive treatment plan</li>
                      <li>Consider physical therapy or specialist consultation</li>
                      <li>Implement pain management strategies</li>
                    </>
                  )}
                  {data.vasAnswers?.currentPain >= 1 && data.vasAnswers?.currentPain <= 3 && (
                    <>
                      <li>Conservative management with monitoring</li>
                      <li>Consider lifestyle modifications</li>
                      <li>Follow-up assessment in 2-4 weeks</li>
                    </>
                  )}
                  <li>Document pain patterns and response to interventions</li>
                  <li>Consider multidisciplinary approach for complex cases</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Notes */}
      {data.additionalNotes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${cardBgColor} rounded-lg shadow-sm border ${borderColor} p-6`}
        >
          <h3 className={`text-lg font-medium ${textColor} mb-3`}>Patient Notes</h3>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
            <p className={textColor}>{data.additionalNotes}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VASViewer;
