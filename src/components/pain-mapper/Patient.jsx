"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import BodyImage from "./body-diagram.jpeg"
export default function PatientPainMapper({ onDataChange, initialData = [] }) {
  const [painData, setPainData] = useState(initialData)

  // Update painData when initialData changes (e.g., when navigating back to this component)
  useEffect(() => {
    setPainData(initialData);
  }, [initialData]);
  const [hoveredPain, setHoveredPain] = useState(null)
  const svgRef = useRef(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [pendingPain, setPendingPain] = useState(null) // { id?, coordinates, view, isEdit }
  const [modalIntensity, setModalIntensity] = useState(5)
  const [modalDescription, setModalDescription] = useState("")

  const updatePainData = useCallback(
    (next) => {
      setPainData(next)
      if (typeof onDataChange === "function") onDataChange(next)
      console.log("Patient pain data updated:", next)
    },
    [onDataChange],
  )

  const handleSVGClick = useCallback(
    (e) => {
      const svg = svgRef.current
      if (!svg) return

      const rect = svg.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 880
      const y = ((e.clientY - rect.top) / rect.height) * 660

      const view = x < 440 ? "front" : "back"

      // If clicking near an existing pin (<= 20px), edit it
      const clicked = painData.find((p) => {
        const dx = x - p.coordinates.x
        const dy = y - p.coordinates.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        return dist <= 20 && p.view === view
      })

      if (clicked) {
        setModalIntensity(Math.round(clicked.intensity * 10))
        setModalDescription(clicked.description || "")
        setPendingPain({ id: clicked.id, coordinates: clicked.coordinates, view: clicked.view, isEdit: true })
      } else {
        setModalIntensity(5)
        setModalDescription("")
        setPendingPain({ coordinates: { x, y }, view, isEdit: false })
      }

      setShowModal(true)
    },
    [painData],
  )

  const handleConfirm = () => {
    if (!pendingPain) return

    if (pendingPain.isEdit && pendingPain.id) {
      const updated = painData.map((p) =>
        p.id === pendingPain.id
          ? {
              ...p,
              intensity: modalIntensity / 10,
              description: modalDescription.trim() || undefined,
              timestamp: new Date().toISOString(),
            }
          : p,
      )
      updatePainData(updated)
    } else {
      const newPain = {
        id: `pain_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        intensity: modalIntensity / 10,
        timestamp: new Date().toISOString(),
        coordinates: pendingPain.coordinates,
        view: pendingPain.view,
        description: modalDescription.trim() || undefined,
      }
      updatePainData([...painData, newPain])
    }

    closeModal()
  }

  const handleRemove = () => {
    if (!pendingPain?.id) return
    const updated = painData.filter((p) => p.id !== pendingPain.id)
    updatePainData(updated)
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setPendingPain(null)
    setModalIntensity(5)
    setModalDescription("")
  }

  const clearAll = () => updatePainData([])

  const renderPins = () =>
    painData.map((p) => {
      // Make smallest size what was previously at score 5, scale between 5 and 10
      // Previous: r = 8 + p.intensity * 12
      // At intensity 0.5 (score 5): r = 8 + 0.5 * 12 = 14
      // At intensity 1.0 (score 10): r = 8 + 1.0 * 12 = 20
      // New scale: map intensity 0-1.0 to radius 16-22 (slightly bigger)
      const minRadius = 16 // 16px (slightly bigger minimum)
      const maxRadius = 22 // 22px (slightly bigger maximum)
      const r = minRadius + p.intensity * (maxRadius - minRadius)
      const hovered = hoveredPain === p.id
      const bgColor = `hsl(${(1 - p.intensity) * 120}, 70%, 50%)`
      
      // Determine text color based on background brightness
      const getTextColor = (intensity) => {
        // For light colors (green/yellow), use dark text
        if (intensity <= 0.5) return "#000000" // Dark text for light backgrounds
        // For dark colors (red), use light text
        return "#ffffff" // Light text for dark backgrounds
      }
      
      return (
        <g key={p.id}>
          <circle
            cx={p.coordinates.x}
            cy={p.coordinates.y}
            r={r}
            fill={bgColor}
            opacity="0.85"
            stroke={hovered ? "#fff" : "#333"}
            strokeWidth={hovered ? "3" : "2"}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredPain(p.id)}
            onMouseLeave={() => setHoveredPain(null)}
          />
          <text
            x={p.coordinates.x}
            y={p.coordinates.y + 4}
            textAnchor="middle"
            fontSize="16"
            fill={getTextColor(p.intensity)}
            fontWeight="500"
            pointerEvents="none"
          >
            {Math.round(p.intensity * 10)}
          </text>
        </g>
      )
    })

  const totalAreas = painData.length
  const avgIntensity = totalAreas ? Math.round((painData.reduce((s, p) => s + p.intensity, 0) / totalAreas) * 10) : 0
  const maxPain = totalAreas ? Math.round(Math.max(...painData.map((p) => p.intensity)) * 10) : 0

  return (
    <div className=" h-screen flex bg-gray-50">
      <div className="flex-1 p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative">
            <svg
              ref={svgRef}
              width="880"
              height="660"
              viewBox="0 0 880 660"
              onClick={handleSVGClick}
              className="max-w-full h-auto bg-white rounded-lg shadow border border-gray-200"
              style={{ cursor: "crosshair" }}
            >
              <image href={BodyImage} width="880" height="660" />
              <line x1="440" y1="0" x2="440" y2="660" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              {renderPins()}

                             <text x="220" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1a1a1a">
                 Front View
               </text>
               <text x="660" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1a1a1a">
                 Back View
               </text>

              {painData.length === 0 && (
                <g>
                  <rect x="290" y="300" width="300" height="60" fill="rgba(59, 130, 246, 0.1)" rx="8" />
                                     <text x="440" y="320" textAnchor="middle" fontSize="14" fill="#1e40af" fontWeight="bold">
                     Click anywhere on the body
                   </text>
                   <text x="440" y="340" textAnchor="middle" fontSize="12" fill="#1e40af">
                     to mark areas of pain
                   </text>
                </g>
              )}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow border text-xs text-gray-800">
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
      <div className="w-96 p-6 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <div className="text-lg font-semibold mb-2 text-gray-800">Mark Your Pain</div>
            <p className="text-sm text-gray-800">
              Click anywhere on the diagram to add a pain marker. Click an existing marker to edit it.
            </p>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2 text-gray-800">Pain Summary</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalAreas}</div>
                <div className="text-xs text-gray-500">Areas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{avgIntensity}/10</div>
                <div className="text-xs text-gray-500">Avg Pain</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{maxPain}/10</div>
                <div className="text-xs text-gray-500">Max Pain</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2 text-gray-800">Pain Markers ({painData.length})</div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {painData
                .slice()
                .sort((a, b) => b.intensity - a.intensity)
                .map((p, idx) => (
                  <div key={p.id} className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-gray-800">Pain #{idx + 1}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded border capitalize text-gray-800">{p.view}</span>
                        <span
                          className="text-sm px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: `hsl(${(1 - p.intensity) * 120}, 70%, 50%)`,
                            color: p.intensity <= 0.5 ? "#000000" : "#ffffff"
                          }}
                        >
                          {Math.round(p.intensity * 10)}/10
                        </span>
                      </div>
                    </div>
                                         {p.description ? <p className="text-xs text-gray-900">{p.description}</p> : null}
                    <div className="text-[11px] text-gray-400 mt-1">{new Date(p.timestamp).toLocaleString()}</div>
                  </div>
                ))}
                             {painData.length === 0 && (
                 <p className="text-sm text-gray-700 text-center py-8">No markers yet. Click the body to add one.</p>
               )}
            </div>
          </div>

          <button
            onClick={clearAll}
            className="w-full bg-white border px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-800"
            type="button"
          >
            Clear All Pain Markers
          </button>
        </div>
      </div>

      {/* Simple modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow">
            <div className="border-b px-4 py-3 font-semibold text-gray-800">
              {pendingPain?.isEdit ? "Edit Pain Marker" : "New Pain Marker"}
              {pendingPain ? (
                <span className="ml-2 text-xs px-2 py-0.5 rounded border capitalize">{pendingPain.view} view</span>
              ) : null}
            </div>
            <div className="p-4 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">
                  Pain Intensity: {modalIntensity}
                  <span className="ml-1 text-xs text-gray-500">/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={modalIntensity}
                  onChange={(e) => setModalIntensity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-800 mt-1">
                  <span>1 - Mild</span>
                  <span>5 - Moderate</span>
                  <span>10 - Severe</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Describe your pain (optional):</label>
                <textarea
                  rows={3}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="e.g., sharp stabbing pain, dull ache, burning sensation…"
                  className="w-full border rounded px-3 py-2 text-sm black-text"
                />
              </div>

              {pendingPain ? (
                <div className="text-xs text-gray-500 bg-gray-50 border rounded px-2 py-2">
                  Location: {pendingPain.view} view at ({Math.round(pendingPain.coordinates.x)},{" "}
                  {Math.round(pendingPain.coordinates.y)})
                </div>
              ) : null}
            </div>
            <div className="border-t px-4 py-3 flex items-center justify-end gap-2">
              {pendingPain?.isEdit ? (
                <button
                  onClick={handleRemove}
                  type="button"
                  className="px-3 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              ) : null}
              <button
                onClick={closeModal}
                type="button"
                className="px-3 py-2 rounded bg-white border text-sm hover:bg-gray-50 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                type="button"
                className="px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-blue-700"
              >
                {pendingPain?.isEdit ? "Update" : "Add"} Pain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
