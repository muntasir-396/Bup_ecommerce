'use client'

import React from 'react'
import {
  Compass,
  Maximize2,
  Lock,
  ChevronRight
} from 'lucide-react'
import { Stall } from '@/lib/types'

interface BupArchitecturalMapProps {
  stalls: Stall[]
  activeStallId: string
  onSelectStall: (stallId: string) => void
  isNightMode: boolean
  onExpandMap?: () => void
  isExpanded?: boolean
  hoveredStall?: Stall | null
  setHoveredStall?: (stall: Stall | null) => void
}

export function BupArchitecturalMap({
  stalls,
  activeStallId,
  onSelectStall,
  isNightMode,
  onExpandMap,
  isExpanded = false,
  hoveredStall,
  setHoveredStall,
}: BupArchitecturalMapProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border transition-colors duration-500 select-none ${
        isExpanded ? 'h-full min-h-[580px]' : 'min-h-[440px] sm:min-h-[540px]'
      } ${
        isNightMode
          ? 'bg-[#0e1511] border-[#223328] text-white shadow-2xl'
          : 'bg-[#f7f5ef] border-[#d8d2c4] text-[#1f2d24] shadow-md'
      }`}
    >
      {/* Precision CAD Drafting Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: isNightMode
            ? 'linear-gradient(90deg, #44634f 1px, transparent 1px), linear-gradient(#44634f 1px, transparent 1px)'
            : 'linear-gradient(90deg, #9e9483 1px, transparent 1px), linear-gradient(#9e9483 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* SVG Vector Architectural Site Plan */}
      <svg
        viewBox="0 0 1000 650"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Architectural Hatching for Buildings */}
          <pattern id="bldgHatchDay" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#d5ccbe" strokeWidth="1" />
          </pattern>
          <pattern id="bldgHatchNight" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#1d2e23" strokeWidth="1" />
          </pattern>

          {/* Plaza Paver Texture */}
          <pattern id="cadGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="none" stroke={isNightMode ? '#16231a' : '#ece6da'} strokeWidth="1" />
          </pattern>
        </defs>

        {/* 1. CAMPUS SITE BASE & CONCOURSE */}
        <rect x="0" y="0" width="1000" height="650" fill={isNightMode ? '#0e1511' : '#f7f5ef'} />
        <rect x="140" y="70" width="720" height="510" fill="url(#cadGrid)" />

        {/* 2. ARTERIAL PEDESTRIAN VECTORS & CIRCULATION */}
        {/* Primary North-South Axis */}
        <line
          x1="500"
          y1="40"
          x2="500"
          y2="610"
          stroke={isNightMode ? '#22362a' : '#ded6c7'}
          strokeWidth="28"
          strokeLinecap="square"
        />
        <line
          x1="500"
          y1="40"
          x2="500"
          y2="610"
          stroke={isNightMode ? '#3f5e4c' : '#b3a794'}
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* Secondary East-West Promenade */}
        <path
          d="M 90,340 L 910,340"
          stroke={isNightMode ? '#1e2f24' : '#e4dcce'}
          strokeWidth="22"
          strokeLinecap="square"
        />
        <line
          x1="90"
          y1="340"
          x2="910"
          y2="340"
          stroke={isNightMode ? '#334c3c' : '#c2b6a3'}
          strokeWidth="1"
          strokeDasharray="8 8"
        />

        {/* 3. BUP CENTRAL LAKE (ARCHITECTURAL CONTOUR WATER BODY) */}
        {/* Outer Buffer Contour */}
        <path
          d="M 340,190 C 430,175 550,195 615,255 C 680,315 650,405 570,430 C 490,455 390,445 345,390 C 300,335 295,220 340,190 Z"
          fill="none"
          stroke={isNightMode ? '#162b29' : '#d2c8b8'}
          strokeWidth="8"
        />
        {/* Inner Water Body */}
        <path
          d="M 340,190 C 430,175 550,195 615,255 C 680,315 650,405 570,430 C 490,455 390,445 345,390 C 300,335 295,220 340,190 Z"
          fill={isNightMode ? '#102123' : '#e2ecec'}
          stroke={isNightMode ? '#1e3e3f' : '#b2c8c8'}
          strokeWidth="1.5"
        />
        {/* Lake Elevation Depth Contours */}
        <path
          d="M 370,225 C 435,215 520,230 570,275 C 615,320 595,380 540,398 C 480,418 410,410 375,368 C 340,325 335,245 370,225 Z"
          fill="none"
          stroke={isNightMode ? '#162e30' : '#c9dcdd'}
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <text
          x="475"
          y="315"
          textAnchor="middle"
          fill={isNightMode ? '#3c6467' : '#88a7a9'}
          fontSize="10"
          fontWeight="700"
          letterSpacing="2"
        >
          CENTRAL LAKE RESERVOIR
        </text>

        {/* Timber Boardwalk Deck */}
        <line x1="400" y1="340" x2="515" y2="340" stroke="#8b4513" strokeWidth="8" opacity="0.8" />
        <line x1="400" y1="340" x2="515" y2="340" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* 4. ARCHITECTURAL BUILDING MASSING BLOCKS */}

        {/* BUILDING: FST Tower (Science & Engineering) */}
        <g>
          <rect
            x="80"
            y="90"
            width="170"
            height="85"
            fill={isNightMode ? 'url(#bldgHatchNight)' : 'url(#bldgHatchDay)'}
            stroke={isNightMode ? '#334e3e' : '#998d78'}
            strokeWidth="1.5"
          />
          <rect
            x="80"
            y="90"
            width="170"
            height="85"
            fill={isNightMode ? '#16241b' : '#ffffff'}
            fillOpacity="0.85"
            stroke={isNightMode ? '#446652' : '#7f735e'}
            strokeWidth="1.5"
          />
          <line x1="80" y1="120" x2="250" y2="120" stroke={isNightMode ? '#2b4032' : '#e0d8cc'} strokeWidth="1" />
          <text x="95" y="112" fill={isNightMode ? '#E3E890' : '#1f3024'} fontSize="10" fontWeight="800" letterSpacing="1">
            FST TOWER (BLDG-A)
          </text>
          <text x="95" y="145" fill={isNightMode ? '#88a892' : '#736855'} fontSize="8" fontWeight="600" letterSpacing="0.5">
            FACULTY OF SCIENCE &amp; TECH
          </text>
          <text x="95" y="158" fill={isNightMode ? '#587361' : '#9c907d'} fontSize="7.5" fontFamily="monospace">
            12 FLOORS • IT &amp; ROBOTICS ATRIUM
          </text>
        </g>

        {/* BUILDING: FBS Concourse (Business Studies) */}
        <g>
          <polygon
            points="70,280 220,280 220,350 140,350 140,430 70,430"
            fill={isNightMode ? '#16241b' : '#ffffff'}
            stroke={isNightMode ? '#446652' : '#7f735e'}
            strokeWidth="1.5"
          />
          <text x="85" y="305" fill={isNightMode ? '#E3E890' : '#1f3024'} fontSize="10" fontWeight="800" letterSpacing="1">
            FBS CONCOURSE (BLDG-B)
          </text>
          <text x="85" y="322" fill={isNightMode ? '#88a892' : '#736855'} fontSize="8" fontWeight="600" letterSpacing="0.5">
            BUSINESS STUDIES WING
          </text>
          <text x="85" y="335" fill={isNightMode ? '#587361' : '#9c907d'} fontSize="7.5" fontFamily="monospace">
            BBA / MBA EXECUTIVE SUITES
          </text>
        </g>

        {/* BUILDING: Vista Cafeteria & Lakeside Terrace */}
        <g>
          <rect
            x="240"
            y="360"
            width="105"
            height="55"
            fill={isNightMode ? '#221a15' : '#ffffff'}
            stroke="#964b00"
            strokeWidth="1.5"
          />
          <polygon
            points="275,415 345,415 360,455 260,455"
            fill={isNightMode ? '#1e140e' : '#ede2d5'}
            stroke="#964b00"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text x="292" y="385" textAnchor="middle" fill="#964b00" fontSize="9.5" fontWeight="800" letterSpacing="0.8">
            VISTA CAFETERIA
          </text>
          <text x="292" y="399" textAnchor="middle" fill={isNightMode ? '#a88876' : '#7d6b5e'} fontSize="7.5" fontWeight="600">
            Lakeside Terrace Deck
          </text>
        </g>

        {/* BUILDING: Bijoy Auditorium (Ceremonial Hall) */}
        <g>
          <polygon
            points="760,100 880,100 920,155 880,210 760,210 720,155"
            fill={isNightMode ? '#17261d' : '#ffffff'}
            stroke={isNightMode ? '#446652' : '#7f735e'}
            strokeWidth="1.5"
          />
          {/* Stepped Plaza Grid */}
          <line x1="720" y1="225" x2="920" y2="225" stroke={isNightMode ? '#2e4738' : '#c9bea9'} strokeWidth="1" />
          <line x1="740" y1="235" x2="900" y2="235" stroke={isNightMode ? '#2e4738' : '#c9bea9'} strokeWidth="1" />
          <text x="820" y="152" textAnchor="middle" fill={isNightMode ? '#E3E890' : '#1f3024'} fontSize="10" fontWeight="800" letterSpacing="1">
            BIJOY AUDITORIUM
          </text>
          <text x="820" y="167" textAnchor="middle" fill={isNightMode ? '#88a892' : '#736855'} fontSize="8" fontWeight="600" letterSpacing="0.5">
            GRAND CEREMONIAL HALL
          </text>
        </g>

        {/* BUILDING: Central Library & Archive */}
        <g>
          <path
            d="M 690,460 L 880,460 C 880,460 860,540 780,540 C 700,540 690,460 690,460 Z"
            fill={isNightMode ? '#16241b' : '#ffffff'}
            stroke={isNightMode ? '#446652' : '#7f735e'}
            strokeWidth="1.5"
          />
          <text x="785" y="492" textAnchor="middle" fill={isNightMode ? '#E3E890' : '#1f3024'} fontSize="10" fontWeight="800" letterSpacing="1">
            CENTRAL LIBRARY
          </text>
          <text x="785" y="506" textAnchor="middle" fill={isNightMode ? '#88a892' : '#736855'} fontSize="8" fontWeight="600" letterSpacing="0.5">
            RFID RESEARCH ARCHIVE
          </text>
        </g>

        {/* ATHLETICS SECTOR: Central Sports Complex */}
        <g>
          <ellipse
            cx="210"
            cy="525"
            rx="110"
            ry="55"
            fill="none"
            stroke={isNightMode ? '#284030' : '#cfc5b4'}
            strokeWidth="2"
          />
          <ellipse
            cx="210"
            cy="525"
            rx="85"
            ry="40"
            fill={isNightMode ? '#101d14' : '#e6f0e6'}
            stroke={isNightMode ? '#34543f' : '#b2ccb2'}
            strokeWidth="1"
          />
          <text x="210" y="528" textAnchor="middle" fill={isNightMode ? '#759980' : '#4d6952'} fontSize="9" fontWeight="700" letterSpacing="1">
            ATHLETICS FIELD
          </text>
        </g>

        {/* MINIMALIST ARCHITECTURAL TREE SYMBOLS (THIN CAD CIRCLES) */}
        {[
          [310, 140], [355, 125], [405, 120],
          [650, 220], [680, 260], [700, 310], [670, 375],
          [590, 480], [630, 500],
          [830, 270], [870, 305],
          [480, 560], [530, 570]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r="7"
              fill="none"
              stroke={isNightMode ? '#32523d' : '#a1b89d'}
              strokeWidth="1"
            />
            <circle cx={cx} cy={cy} r="1.5" fill={isNightMode ? '#487556' : '#7a9477'} />
          </g>
        ))}

        {/* 5. TITLE BLOCK & DRAWING DATA */}
        <g transform="translate(30, 600)">
          <text x="0" y="0" fill={isNightMode ? '#668770' : '#7a705e'} fontSize="8" fontFamily="monospace" fontWeight="700">
            BANGLADESH UNIVERSITY OF PROFESSIONALS • CAMPUS MASTERPLAN
          </text>
          <text x="0" y="11" fill={isNightMode ? '#445e4d' : '#a39783'} fontSize="7" fontFamily="monospace">
            CAD REF: BUP-SP-2026-REV3 | MIRPUR CANTONMENT, DHAKA | SCALE 1:500
          </text>
        </g>

        {/* TRUE NORTH ARROW */}
        <g transform="translate(950, 580)">
          <line x1="0" y1="12" x2="0" y2="-12" stroke={isNightMode ? '#E3E890' : '#1f3024'} strokeWidth="1.5" />
          <polygon points="0,-16 -3,-8 3,-8" fill={isNightMode ? '#E3E890' : '#1f3024'} />
          <text x="0" y="-19" textAnchor="middle" fill={isNightMode ? '#E3E890' : '#1f3024'} fontSize="8" fontWeight="900">
            N
          </text>
        </g>
      </svg>

      {/* TOP BAR: Clean technical header & enlarge trigger */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-white border border-white/10 pointer-events-auto">
          <Compass className="size-3.5 text-[#E3E890]" />
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-white/90">
            Plot Allocation Map
          </span>
          <span className="text-[10px] text-white/40">|</span>
          <span className="text-[9px] font-mono text-white/60">
            {stalls.length} Designated Campus Spaces
          </span>
        </div>

        {onExpandMap && !isExpanded && (
          <button
            type="button"
            onClick={onExpandMap}
            className="flex items-center gap-1.5 rounded-lg bg-[#1a2b20] hover:bg-[#121f17] px-3 py-1.5 text-xs font-semibold text-white shadow-md border border-white/20 transition-all pointer-events-auto cursor-pointer"
            title="Expand Masterplan to Full View"
          >
            <Maximize2 className="size-3 text-[#E3E890]" />
            <span>Full Masterplan</span>
          </button>
        )}
      </div>

      {/* REFINED ARCHITECTURAL PLOT BEACONS (NON-CARTOONISH, HIGH-PRECISION) */}
      <div className="absolute inset-0 pointer-events-none">
        {stalls.map((stall) => {
          const isActive = stall.id === activeStallId
          const isReserved = stall.status === 'Reserved'
          const isPopular = stall.status === 'Popular'

          return (
            <div
              key={stall.id}
              style={{
                left: `${stall.coordinates.x}%`,
                top: `${stall.coordinates.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group z-20"
              onMouseEnter={() => setHoveredStall && setHoveredStall(stall)}
              onMouseLeave={() => setHoveredStall && setHoveredStall(null)}
            >
              {/* Active Crosshair Target Reticle */}
              {isActive && (
                <div className="absolute -inset-2.5 rounded-full border border-dashed border-white animate-spin-slow pointer-events-none opacity-80" />
              )}

              {/* Refined Architectural Beacon Node */}
              <button
                type="button"
                onClick={() => onSelectStall(stall.id)}
                className={`relative flex items-center justify-center rounded-full size-7 text-[10px] font-mono font-bold tracking-tight shadow-md transition-all duration-200 transform hover:scale-125 cursor-pointer ${
                  isActive
                    ? 'bg-[#E3E890] text-[#141f17] ring-2 ring-white ring-offset-2 ring-offset-[#0e1511] font-black'
                    : isReserved
                    ? 'bg-[#2a2a2a] text-[#888888] border border-[#444444]'
                    : isPopular
                    ? 'bg-[#964b00] text-white border border-[#ffb07c]'
                    : isNightMode
                    ? 'bg-[#1b2f23] text-[#FAF5E9] border border-[#3b5e47] hover:bg-[#284735]'
                    : 'bg-white text-[#213527] border border-[#a89b88] hover:border-[#213527]'
                }`}
                title={`${stall.id}: ${stall.name}`}
              >
                {isReserved ? (
                  <Lock className="size-3" />
                ) : (
                  <span>{stall.id.replace('LAKE-', 'L').replace('VISTA-', 'V').replace('FST-', 'T').replace('FBS-', 'B').replace('PLAZA-', 'P').replace('LIB-', 'R').replace('SPORTS-', 'S')}</span>
                )}
              </button>

              {/* Minimalist Hover Technical Tag */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col w-48 rounded-lg bg-[#141e17] p-2.5 text-white shadow-xl border border-white/20 z-30 pointer-events-none animate-in fade-in">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#E3E890]">
                  <span>PLOT {stall.id}</span>
                  <span className="font-bold">৳{stall.dailyRate}/d</span>
                </div>
                <p className="text-xs font-semibold mt-0.5 line-clamp-1 text-white">
                  {stall.name}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[9px] text-white/70 border-t border-white/10 pt-1 font-mono">
                  <span>{stall.footfall.split(' ')[0]} visitors</span>
                  <span className={isReserved ? 'text-red-400' : 'text-emerald-400'}>
                    {stall.status}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* BOTTOM LEGEND: Subtle architectural key */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] text-white/80 border border-white/10 z-10 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#1b2f23] border border-[#3b5e47]" /> Standard Plot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#964b00]" /> Prime Waterfront
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#2a2a2a] border border-[#444444]" /> Reserved
          </span>
        </div>
        <span className="text-white/50 hidden sm:inline">
          Select plot node to inspect specification &amp; reserve
        </span>
      </div>
    </div>
  )
}
