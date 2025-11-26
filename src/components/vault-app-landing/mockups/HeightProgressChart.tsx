import React from 'react';
import { motion } from 'framer-motion';

interface HeightProgressChartProps {
  compact?: boolean;
}

const HeightProgressChart: React.FC<HeightProgressChartProps> = ({ compact = false }) => {
  // Sample data for 12 sessions
  const maxHeights = [5.6, 5.65, 5.5, 5.75, 5.8, 5.95, 5.85, 6.0, 5.9, 6.05, 6.1, 6.05];
  const avgHeights = [5.3, 5.35, 5.25, 5.45, 5.5, 5.65, 5.55, 5.7, 5.6, 5.75, 5.8, 5.75];

  const minY = 5.0;
  const maxY = 6.2;
  const range = maxY - minY;

  const chartHeight = compact ? 100 : 180;
  const chartWidth = compact ? 240 : 400;
  const padding = { left: 40, right: 10, top: 10, bottom: 25 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const getX = (index: number) => padding.left + (index / (maxHeights.length - 1)) * innerWidth;
  const getY = (value: number) => padding.top + innerHeight - ((value - minY) / range) * innerHeight;

  // Create path strings
  const createPath = (data: number[]) => {
    return data
      .map((val, i) => {
        const x = getX(i);
        const y = getY(val);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Create area path
  const createAreaPath = (data: number[]) => {
    const linePath = createPath(data);
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = padding.top + innerHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="font-roboto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis labels */}
        {[5.0, 5.5, 6.0].map((val) => (
          <g key={val}>
            <text
              x={padding.left - 8}
              y={getY(val) + 4}
              textAnchor="end"
              className="fill-vault-text-muted"
              fontSize={compact ? 8 : 10}
            >
              {val.toFixed(1)}m
            </text>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={chartWidth - padding.right}
              y2={getY(val)}
              stroke="#e5e5e5"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          </g>
        ))}

        {/* Area fill for max heights */}
        <motion.path
          d={createAreaPath(maxHeights)}
          fill="url(#maxGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />

        {/* Max height line */}
        <motion.path
          d={createPath(maxHeights)}
          fill="none"
          stroke="#072f57"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Avg height line */}
        <motion.path
          d={createPath(avgHeights)}
          fill="none"
          stroke="#0a4a8a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Data points for max */}
        {maxHeights.map((val, i) => (
          <motion.circle
            key={`max-${i}`}
            cx={getX(i)}
            cy={getY(val)}
            r={compact ? 3 : 4}
            fill="#072f57"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="maxGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#072f57" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#072f57" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* X-axis labels */}
        {!compact && (
          <>
            <text
              x={padding.left}
              y={chartHeight - 5}
              className="fill-vault-text-muted"
              fontSize="9"
            >
              Sept 1
            </text>
            <text
              x={chartWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              className="fill-vault-text-muted"
              fontSize="9"
            >
              Sept 15
            </text>
            <text
              x={chartWidth - padding.right}
              y={chartHeight - 5}
              textAnchor="end"
              className="fill-vault-text-muted"
              fontSize="9"
            >
              Oct 15
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className={`flex items-center justify-center gap-4 ${compact ? 'mt-1' : 'mt-3'}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-vault-primary rounded" />
          <span className={`text-vault-text-muted ${compact ? 'text-[8px]' : 'text-xs'}`}>Max Height</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-vault-primary-light rounded border-dashed" style={{ borderTop: '2px dashed #0a4a8a', height: 0 }} />
          <span className={`text-vault-text-muted ${compact ? 'text-[8px]' : 'text-xs'}`}>Avg Height</span>
        </div>
      </div>
    </div>
  );
};

export default HeightProgressChart;
