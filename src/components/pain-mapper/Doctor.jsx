"use client"

import { useEffect, useRef, useState } from "react"
import BodyImage from "./body-diagram.jpeg"
import { useDarkMode } from "../../contexts/darkModeContext"

export default function DoctorPainViewer({ painData = [], patientId = "Unknown", assessmentDate = null }) {
  const [hoveredPain, setHoveredPain] = useState(null)
  const svgRef = useRef(null)
  const { isDarkMode } = useDarkMode()

  // Theme-aware colors
  const bgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50"
  const cardBgColor = isDarkMode ? "bg-gray-700" : "bg-white"
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900"
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-600"
  const borderColor = isDarkMode ? "border-gray-600" : "border-gray-200"

  // For clarity: show how to use the output from patient pinning
  useEffect(() => {
    console.log("Doctor reviewing painData:", {
      patientId,
      assessmentDate,
      total: painData.length,
      painData,
    })

    // Examples (uncomment to use):
    // const severe = painData.filter(p => p.intensity >= 0.7)
    // console.log('Severe (>=7/10):', severe)
  }, [painData, patientId, assessmentDate])

  /*
   HOW TO DISPLAY/PROCESS THE DATA (output from the pinning):
   - painData is an array of objects with:
     {
       id: string,
       intensity: number,             // 0.1 - 1.0 (multiply by 10 for 1-10 scale)
       timestamp: string,             // ISO date
       coordinates: { x: number, y: number }, // pixel coords on the diagram (880x660)
       description?: string,
       view: "front" | "back"
     }

   - Example: list items with intensity and description:
     painData.map((p, i) => (
       <div key={p.id}>
         <div>Pain #{i+1}: {Math.round(p.intensity * 10)}/10</div>
         <div>View: {p.view}</div>
         <div>Coordinates: ({p.coordinates.x}, {p.coordinates.y})</div>
         <div>Description: {p.description || "—"}</div>
       </div>
     ))

   - Example: summary metrics:
     const total = painData.length
     const avg   = total ? Math.round((painData.reduce((s,p)=>s+p.intensity,0)/total)*10) : 0
     const max   = total ? Math.round(Math.max(...painData.map(p=>p.intensity))*10) : 0
  */

  const renderPins = () =>
    painData.map((p) => {
      const r = 8 + p.intensity * 12
      const hovered = hoveredPain === p.id
      return (
        <g key={p.id}>
          <circle
            cx={p.coordinates.x}
            cy={p.coordinates.y}
            r={r}
            fill={`hsl(${(1 - p.intensity) * 120}, 70%, 50%)`}
            opacity="0.85"
            stroke={hovered ? "#fff" : "#333"}
            strokeWidth={hovered ? "3" : "2"}
            onMouseEnter={() => setHoveredPain(p.id)}
            onMouseLeave={() => setHoveredPain(null)}
          />
          <text
            x={p.coordinates.x}
            y={p.coordinates.y + 4}
            textAnchor="middle"
            fontSize="12"
            fill="#fff"
            fontWeight="bold"
            pointerEvents="none"
          >
            {Math.round(p.intensity * 10)}
          </text>
          {hovered && (
            <g>
              <rect
                x={p.coordinates.x - 120}
                y={p.coordinates.y - r - (p.description ? 80 : 60)}
                width="240"
                height={p.description ? 80 : 60}
                rx="6"
                fill={isDarkMode ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.85)"}
                pointerEvents="none"
              />
              <text
                x={p.coordinates.x}
                y={p.coordinates.y - r - (p.description ? 64 : 44)}
                textAnchor="middle"
                fontSize="12"
                fill="#fff"
                pointerEvents="none"
              >
                {Math.round(p.intensity * 10)}/10 · {p.view}
              </text>
              <text
                x={p.coordinates.x}
                y={p.coordinates.y - r - (p.description ? 48 : 28)}
                textAnchor="middle"
                fontSize="10"
                fill="#ddd"
                pointerEvents="none"
              >
                {new Date(p.timestamp).toLocaleString()}
              </text>
              {p.description && (
                <text
                  x={p.coordinates.x}
                  y={p.coordinates.y - r - 32}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  pointerEvents="none"
                >
                  {p.description}
                </text>
              )}
            </g>
          )}
        </g>
      )
    })

  const totalAreas = painData.length
  const avgIntensity = totalAreas ? Math.round((painData.reduce((s, p) => s + p.intensity, 0) / totalAreas) * 10) : 0
  const maxPain = totalAreas ? Math.round(Math.max(...painData.map((p) => p.intensity)) * 10) : 0
  const frontCount = painData.filter((p) => p.view === "front").length
  const backCount = painData.filter((p) => p.view === "back").length
  const severeCount = painData.filter((p) => p.intensity >= 0.7).length

  return (
    <div className={`w-full h-full flex ${bgColor}`}>
      <div className="flex-1 p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative">
            <svg
              ref={svgRef}
              width="880"
              height="660"
              viewBox="0 0 880 660"
              className={`max-w-full h-auto ${cardBgColor} rounded-lg shadow border ${borderColor}`}
            >
              <image href={BodyImage} width="880" height="660" />
              <line x1="440" y1="0" x2="440" y2="660" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              {renderPins()}

              <text x="220" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
                Front View
              </text>
              <text x="660" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
                Back View
              </text>

              {painData.length === 0 && (
                <g>
                  <rect x="290" y="300" width="300" height="60" fill="rgba(156, 163, 175, 0.15)" rx="8" />
                  <text x="440" y="320" textAnchor="middle" fontSize="14" fill="#6b7280" fontWeight="bold">
                    No pain data available
                  </text>
                  <text x="440" y="340" textAnchor="middle" fontSize="12" fill="#6b7280">
                    Patient has not marked any pain areas
                  </text>
                </g>
              )}
            </svg>

            {/* Legend */}
            <div className={`absolute bottom-4 left-4 ${cardBgColor} p-3 rounded shadow border ${borderColor} text-xs ${textColor}`}>
              <div className="font-semibold mb-2">Pain Intensity Scale</div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-green-500" /> <span>1-3: Mild</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-yellow-500" /> <span>4-6: Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" /> <span>7-10: Severe</span>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={`w-96 p-6 ${cardBgColor} border-l ${borderColor} overflow-y-auto`}>
        <div className="space-y-6">
          <div>
            <div className={`text-lg font-semibold mb-2 ${textColor}`}>Clinical Assessment</div>
            <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-50'} border ${isDarkMode ? 'border-green-700' : 'border-green-100'} rounded p-3 text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
              Pain markers reflect patient-reported locations. Hover markers for details. Colors/sizes indicate
              intensity.
            </div>
          </div>

          <div>
            <div className={`text-lg font-semibold mb-2 ${textColor}`}>Pain Summary</div>
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalAreas}</div>
                <div className={`text-xs ${textSecondaryColor}`}>Total Areas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{severeCount}</div>
                <div className={`text-xs ${textSecondaryColor}`}>Severe (7+)</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{frontCount}</div>
                <div className={`text-xs ${textSecondaryColor}`}>Front</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{backCount}</div>
                <div className={`text-xs ${textSecondaryColor}`}>Back</div>
              </div>
            </div>
            {totalAreas > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-orange-600">{avgIntensity}/10</div>
                  <div className="text-xs text-gray-500">Average</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{maxPain}/10</div>
                  <div className="text-xs text-gray-500">Maximum</div>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <div className={`text-lg font-semibold mb-2 ${textColor}`}>Patient Pain Reports ({painData.length})</div>
            <div className="space-y-3">
              {painData
                .slice()
                .sort((a, b) => b.intensity - a.intensity)
                .map((p, idx) => (
                  <div key={p.id} className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded border ${borderColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className={`font-medium text-sm ${textColor}`}>Pain Area #{idx + 1}</div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded border capitalize ${textSecondaryColor} ${borderColor}`}>{p.view}</span>
                        <span
                          className="text-white text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: `hsl(${(1 - p.intensity) * 120}, 70%, 50%)` }}
                        >
                          {Math.round(p.intensity * 10)}/10
                        </span>
                      </div>
                    </div>
                    {p.description && (
                      <div className={`mt-2 p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded border-l-4 border-blue-200`}>
                        <p className={`text-xs font-medium ${textSecondaryColor}`}>Patient Description</p>
                        <p className={`text-sm mt-1 ${textColor}`}>{p.description}</p>
                      </div>
                    )}
                    <div className={`text-[11px] ${textSecondaryColor} mt-2 flex justify-between`}>
                      <span>{new Date(p.timestamp).toLocaleString()}</span>
                      <span>
                        ({Math.round(p.coordinates.x)}, {Math.round(p.coordinates.y)})
                      </span>
                    </div>
                  </div>
                ))}
              {painData.length === 0 ? (
                <p className={`text-sm ${textSecondaryColor} text-center py-8`}>No pain data available for review.</p>
              ) : null}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
