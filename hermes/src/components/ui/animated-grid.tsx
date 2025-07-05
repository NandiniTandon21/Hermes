"use client"

import { TokenIcon } from '@web3icons/react'
import {  useId, useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeWidth?: number
  className?: string
  [key: string]: any
}

export function AnimatedGrid({
  width = 64,
  height = 64,
  x = 0,
  y = 0,
  strokeWidth = 1,
  className,
  ...props
}: GridPatternProps) {
  const id = useId()
  const [hoveredCell, setHoveredCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [mousePosition, setMousePosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [spawnedTokens, setSpawnedTokens] = useState<Set<string>>(new Set())

  const tokenIcons = [
    { symbol: 'eth', variant: 'branded' },
    { symbol: 'btc', variant: 'branded' },
    { symbol: 'sol', variant: 'branded' },
    { symbol: 'usdt', variant: 'branded' },
    { symbol: 'usdc', variant: 'branded' },
    { symbol: 'xrp', variant: 'branded' },
    { symbol: 'ada', variant: 'branded' },
    { symbol: 'bnb', variant: 'branded' },
  ];

  function getRandomAdjacentCells(center: {row: number, col: number}, count: number = 5) {
    const directions = [
      [0,0], [0,1], [1,0], [0,-1], [-1,0], [1,1], [-1,-1], [1,-1], [-1,1]
    ];
    const shuffled = directions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(([dr, dc]) => ({row: center.row + dr, col: center.col + dc}));
  }

  const expandedCells = useMemo(() => {
    if (!hoveredCell) return [];
    const cells = getRandomAdjacentCells(hoveredCell, 5);

    return cells.map(cell => ({
      ...cell,
      token: tokenIcons[Math.floor(Math.random() * tokenIcons.length)]
    }));
  }, [hoveredCell]);

  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    const col = Math.floor(mouseX / width)
    const row = Math.floor(mouseY / height)

    setHoveredCell({ row, col })
    setMousePosition({ x: mouseX, y: mouseY })
  }

  const handleMouseLeave = () => {
    setHoveredCell(null)
    setMousePosition(null)
  }

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-auto h-full w-full stroke-neutral-400/30 [--highlighted-grid-color:theme(colors.neutral.400/30)] dark:[--highlighted-grid-color:theme(colors.neutral.700/30)]",
        className
      )}
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <line x1="0" y1="0" x2={width} y2="0" strokeWidth={strokeWidth} />
          <line x1="0" y1="0" x2="0" y2={height} strokeWidth={strokeWidth} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {/* Highlight expanded cells */}
      <AnimatePresence>
        {expandedCells.map(cell => (
          <motion.g
            key={`expanded-${cell.row}-${cell.col}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <rect
              x={cell.col * width}
              y={cell.row * height}
              width={width}
              height={height}
              fill="black"
              stroke="#fbbf24"
              strokeWidth={3}
              rx={16}
              style={{ filter: 'drop-shadow(0 0 12px #fbbf24aa)' }}
            />
            <foreignObject
              x={cell.col * width}
              y={cell.row * height}
              width={width}
              height={height}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'black',
                borderRadius: '16px'
              }}>
                <TokenIcon symbol={cell.token.symbol} variant={cell.token.variant} size={36} />
              </div>
            </foreignObject>
          </motion.g>
        ))}
      </AnimatePresence>
      {mousePosition && (
        <motion.circle
          cx={mousePosition.x}
          cy={mousePosition.y}
          r={width / 2}
          fill="none"
          stroke="var(--highlighted-grid-color)"
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        />
      )}
      {mousePosition && (
        <motion.circle
          cx={mousePosition.x}
          cy={mousePosition.y}
          r={width / 4}
          fill="var(--highlighted-grid-color)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        />
      )}
    </svg>
  )
}
