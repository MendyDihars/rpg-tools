import { useEffect, useMemo, useRef, useState } from 'react'
import mapImage from '../assets/Carte_Thedas.jpg'
import Ornament from '../components/Ornament'
import Crest from '../components/Crest'

const initialMeasurement = { start: null, end: null, active: false }
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const distanceBetween = (a, b) => {
  if (!a || !b) return 0
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.hypot(dx, dy)
}

export default function InteractiveMap() {
  const containerRef = useRef(null)
  const [mode, setMode] = useState('base')
  const [interactionMode, setInteractionMode] = useState('distance')
  const [basePoints, setBasePoints] = useState([])
  const [baseDistance, setBaseDistance] = useState(null)
  const [baseValue, setBaseValue] = useState(40)
  const [unitLabel, setUnitLabel] = useState('km')
  const [measurement, setMeasurement] = useState(initialMeasurement)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [viewport, setViewport] = useState({
    scale: 1,
    offset: { x: 0, y: 0 },
  })
  const [panState, setPanState] = useState({
    active: false,
    pointerId: null,
    last: null,
  })

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setContainerSize({ width, height })
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const resetBase = () => {
    setMode('base')
    setBasePoints([])
    setBaseDistance(null)
    setMeasurement(initialMeasurement)
  }

  const resetMeasurement = () => {
    setMeasurement(initialMeasurement)
  }

  const getScreenPoint = event => {
    if (!containerRef.current) return null
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const toMapCoords = point => {
    if (!point) return null
    return {
      x: (point.x - viewport.offset.x) / viewport.scale,
      y: (point.y - viewport.offset.y) / viewport.scale,
    }
  }

  const handlePointerDown = event => {
    const screenPoint = getScreenPoint(event)
    if (!screenPoint) return

    if (interactionMode === 'map') {
      event.preventDefault()
      setPanState({
        active: true,
        pointerId: event.pointerId,
        last: screenPoint,
      })
      containerRef.current?.setPointerCapture(event.pointerId)
      return
    }

    const point = toMapCoords(screenPoint)
    if (!point) return

    if (mode === 'base') {
      if (basePoints.length === 0) {
        setBasePoints([point])
        setBaseDistance(null)
      } else {
        const completedBase = [basePoints[0], point]
        setBasePoints(completedBase)
        setBaseDistance(distanceBetween(completedBase[0], completedBase[1]))
        setMode('measure')
      }
      return
    }

    if (!baseDistance || interactionMode !== 'distance') return
    setMeasurement({ start: point, end: point, active: true })
  }

  const handlePointerMove = event => {
    const screenPoint = getScreenPoint(event)
    if (!screenPoint) return

    if (
      interactionMode === 'map' &&
      panState.active &&
      event.pointerId === panState.pointerId
    ) {
      setViewport(prev => ({
        ...prev,
        offset: {
          x: prev.offset.x + (screenPoint.x - panState.last.x),
          y: prev.offset.y + (screenPoint.y - panState.last.y),
        },
      }))
      setPanState(prev => ({ ...prev, last: screenPoint }))
      return
    }

    if (!measurement.active || interactionMode !== 'distance') return
    const point = toMapCoords(screenPoint)
    if (!point) return
    setMeasurement(prev => ({ ...prev, end: point }))
  }

  const stopMeasurement = () => {
    setMeasurement(prev =>
      prev.active ? { ...prev, active: false } : prev,
    )
  }

  const stopPan = event => {
    if (
      interactionMode === 'map' &&
      panState.active &&
      (!event || event.pointerId === panState.pointerId)
    ) {
      containerRef.current?.releasePointerCapture(panState.pointerId)
      setPanState({ active: false, pointerId: null, last: null })
    }
  }

  const handlePointerUp = event => {
    stopMeasurement()
    stopPan(event)
  }

  const handlePointerLeave = () => {
    stopMeasurement()
    stopPan()
  }

  const handleWheel = event => {
    if (!containerRef.current || interactionMode !== 'map') return
    if (!event.shiftKey) return

    event.preventDefault()
    const zoomDirection = event.deltaY < 0 ? 1 : -1
    const zoomFactor = 1 + zoomDirection * 0.1

    const rect = containerRef.current.getBoundingClientRect()
    const pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setViewport(prev => {
      const newScale = clamp(prev.scale * zoomFactor, 0.5, 4)
      const mapPoint = {
        x: (pointer.x - prev.offset.x) / prev.scale,
        y: (pointer.y - prev.offset.y) / prev.scale,
      }

      return {
        scale: newScale,
        offset: {
          x: pointer.x - mapPoint.x * newScale,
          y: pointer.y - mapPoint.y * newScale,
        },
      }
    })
  }

  const measurementDistance =
    measurement.start && measurement.end
      ? distanceBetween(measurement.start, measurement.end)
      : 0

  const multiples = baseDistance ? measurementDistance / baseDistance : 0
  const fullMultiples = Math.floor(multiples)
  const remainderDistance = measurementDistance - fullMultiples * (baseDistance || 0)
  const measurementUnits =
    baseDistance && baseValue
      ? (measurementDistance / baseDistance) * baseValue
      : 0
  const remainderUnits =
    baseDistance && baseValue
      ? (remainderDistance / baseDistance) * baseValue
      : 0

  const segmentMarkers = useMemo(() => {
    if (!baseDistance || !measurement.start || !measurement.end) return []
    const total = measurementDistance
    if (total === 0) return []
    const dirX = (measurement.end.x - measurement.start.x) / total
    const dirY = (measurement.end.y - measurement.start.y) / total
    const markers = []
    for (let i = 1; i * baseDistance < total; i += 1) {
      markers.push({
        x: measurement.start.x + dirX * baseDistance * i,
        y: measurement.start.y + dirY * baseDistance * i,
      })
    }
    return markers
  }, [baseDistance, measurement.start, measurement.end, measurementDistance])

  const statusMessage =
    mode === 'base'
      ? basePoints.length === 0
        ? 'Cliquez une première fois sur la carte pour poser la base.'
        : 'Cliquez une seconde fois pour compléter la base.'
      : interactionMode === 'map'
        ? 'Mode manipulation : faites glisser pour déplacer la carte, Shift + molette pour zoomer.'
        : 'Mode mesure : cliquez-glissez pour mesurer avec la base sélectionnée.'

  // THEME HELPERS
  const cardBase =
    "rounded-2xl border border-amber-300/20 bg-[radial-gradient(1200px_400px_at_50%_-20%,rgba(212,175,55,0.06),transparent),linear-gradient(to_bottom_right,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]";
  const inputBase =
    "h-9 sm:h-11 w-40 sm:w-60 rounded-xl border border-amber-400/30 bg-zinc-900/60 text-amber-50 px-3 sm:px-4 placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-300/70 backdrop-blur-sm";
  const labelTone = "text-amber-100/80";

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-amber-50 relative overflow-hidden">
      {/* golden backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_20%_-10%,rgba(212,175,55,0.08),transparent),radial-gradient(600px_400px_at_80%_-10%,rgba(255,215,128,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pb-8 relative">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-amber-400/40 bg-zinc-900/70 grid place-items-center shadow-[0_0_0_2px_rgba(212,175,55,0.15)]">
            <Crest />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]">
              Atlas de Thédas
            </h1>
            <p className="text-amber-100/70 text-sm">Carte interactive avec règle de distance ✨</p>
          </div>
        </div>
        <Ornament className="mt-5" />
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28 relative">
        <section className="flex flex-col gap-4 md:gap-8">

          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              type="button"
              onClick={resetBase}
              className="rounded-full border border-amber-300/30 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium text-amber-50 transition hover:border-amber-300/50 hover:text-amber-100 bg-zinc-900/60 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            >
              Définir une nouvelle base
            </button>
            <button
              type="button"
              onClick={resetMeasurement}
              className="rounded-full border border-amber-300/30 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium text-amber-50 transition hover:border-amber-300/50 hover:text-amber-100 bg-zinc-900/60 hover:shadow-[0_0_0_2px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400/60 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!measurement.start || !measurement.end}
            >
              Effacer la dernière mesure
            </button>
            <span className="hidden flex-1 items-center text-xs md:text-sm text-amber-100/70 md:flex">
              {statusMessage}
            </span>
          </div>

          <div className={`${cardBase} grid gap-2 p-3 md:gap-4 md:p-4 md:grid-cols-4`}>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/60">
                Base actuelle
              </p>
              <p className="text-lg font-semibold text-amber-50">
                {baseDistance ? `${baseDistance.toFixed(1)} px` : 'Non définie'}
              </p>
              <p className="text-sm text-amber-100/75">
                {baseDistance && baseValue
                  ? `= ${baseValue} ${unitLabel || 'unités'}`
                  : 'Définissez une base pour la calibrer'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/60">
                Distance mesurée
              </p>
              <p className="text-lg font-semibold text-amber-50">
                {measurementDistance ? `${measurementDistance.toFixed(1)} px` : '—'}
              </p>
              <p className="text-sm text-amber-100/80">
                {measurementUnits ? `${measurementUnits.toFixed(1)} ${unitLabel}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/60">
                Multiples complets
              </p>
              <p className="text-lg font-semibold text-amber-50">
                {baseDistance ? fullMultiples : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/60">
                Reste
              </p>
              <p className="text-lg font-semibold text-amber-50">
                {baseDistance && measurementDistance
                  ? `${remainderDistance.toFixed(1)} px`
                  : '—'}
              </p>
              <p className="text-sm text-amber-100/80">
                {remainderUnits
                  ? `${remainderUnits.toFixed(1)} ${unitLabel}`
                  : '—'}
              </p>
            </div>
          </div>

          <div className={`${cardBase} flex flex-wrap gap-3 p-3 md:gap-4 md:p-4`}>
            <label className="flex min-w-[200px] flex-col gap-2 text-sm">
              <span className={`text-xs uppercase tracking-[0.2em] ${labelTone}`}>
                Valeur de la base
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                className={inputBase}
                value={baseValue}
                onChange={event =>
                  setBaseValue(Number(event.target.value) || 0)
                }
              />
            </label>
            <label className="flex min-w-[200px] flex-col gap-2 text-sm">
              <span className={`text-xs uppercase tracking-[0.2em] ${labelTone}`}>
                Unité
              </span>
              <input
                type="text"
                className={inputBase}
                value={unitLabel}
                onChange={event => setUnitLabel(event.target.value)}
                placeholder="km, miles, jours..."
              />
            </label>
            <p className="max-w-xl text-sm text-amber-100/70">
              La valeur et l&apos;unité permettent de transformer automatiquement vos
              mesures en unités de jeu (km, lieues, jours de voyage, etc.).
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-amber-300/30 bg-zinc-900/80 p-1 shadow-lg backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setInteractionMode('distance')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all md:px-6 md:py-2.5 md:text-base ${
                    interactionMode === 'distance'
                      ? 'bg-amber-600/80 text-amber-50 shadow-md border border-amber-300/40'
                      : 'text-amber-100/80 hover:bg-zinc-800/80 hover:text-amber-50'
                  }`}
                >
                  <span className="hidden sm:inline">Gestion des distances</span>
                  <span className="sm:hidden">Distances</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInteractionMode('map')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all md:px-6 md:py-2.5 md:text-base ${
                    interactionMode === 'map'
                      ? 'bg-amber-600/80 text-amber-50 shadow-md border border-amber-300/40'
                      : 'text-amber-100/80 hover:bg-zinc-800/80 hover:text-amber-50'
                  }`}
                >
                  <span className="hidden sm:inline">Manipulation de la carte</span>
                  <span className="sm:hidden">Carte</span>
                </button>
              </div>
              <span className="flex items-center text-xs text-amber-100/70 md:hidden">
                {statusMessage}
              </span>
            </div>

            <div
              ref={containerRef}
              className={`relative w-full overflow-hidden rounded-3xl border border-amber-300/20 shadow-2xl ${
                interactionMode === 'map'
                  ? panState.active
                    ? 'cursor-grabbing'
                    : 'cursor-grab'
                  : 'cursor-crosshair'
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onWheel={handleWheel}
              style={{ touchAction: 'none' }}
            >
        <div
          className="relative h-full w-full origin-top-left"
          style={{
            transform: `translate(${viewport.offset.x}px, ${viewport.offset.y}px) scale(${viewport.scale})`,
            transformOrigin: 'top left',
          }}
        >
          <img
            src={mapImage}
            alt="Carte détaillée de Thédas"
            className="block h-auto w-full select-none"
            draggable={false}
          />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${containerSize.width || 1} ${containerSize.height || 1}`}
            preserveAspectRatio="none"
          >
            {basePoints.length === 2 && (
              <>
                <line
                  x1={basePoints[0].x}
                  y1={basePoints[0].y}
                  x2={basePoints[1].x}
                  y2={basePoints[1].y}
                  stroke="#c084fc"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {basePoints.map((point, index) => (
                  <circle
                    key={`base-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="7"
                    fill="#a855f7"
                    stroke="#f8fafc"
                    strokeWidth="2"
                  />
                ))}
              </>
            )}

            {basePoints.length === 1 && (
              <circle
                cx={basePoints[0].x}
                cy={basePoints[0].y}
                r="7"
                fill="#22d3ee"
                stroke="#f8fafc"
                strokeWidth="2"
              />
            )}

            {measurement.start && measurement.end && (
              <>
                <line
                  x1={measurement.start.x}
                  y1={measurement.start.y}
                  x2={measurement.end.x}
                  y2={measurement.end.y}
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                />

                <circle
                  cx={measurement.start.x}
                  cy={measurement.start.y}
                  r="6"
                  fill="#0ea5e9"
                  stroke="#f8fafc"
                  strokeWidth="2"
                />
                <circle
                  cx={measurement.end.x}
                  cy={measurement.end.y}
                  r="6"
                  fill="#0ea5e9"
                  stroke="#f8fafc"
                  strokeWidth="2"
                />

                {segmentMarkers.map((marker, index) => (
                  <g key={`segment-${index}`}>
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r="4"
                      fill="#f97316"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={marker.x + 6}
                      y={marker.y - 6}
                      fill="#f97316"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {index + 1}
                    </text>
                  </g>
                ))}
              </>
            )}
          </svg>
        </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 text-center text-[12px] text-amber-100/50">
        <Ornament className="mb-3" />
        <p>Atlas de Thédas — la carte et l&apos;or pour guider vos voyages.</p>
      </footer>
    </div>
  )
}