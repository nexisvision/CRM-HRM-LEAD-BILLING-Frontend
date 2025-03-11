import React, { useMemo, useState } from 'react';

const RecentOrderGraph = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = useMemo(() => [
    { date: '29-Dec', income: 400 },
    { date: '30-Dec', income: 100 },
    { date: '31-Dec', income: 380 },
    { date: '01-Jan', income: 100 },
    { date: '02-Jan', income: 450 },
    { date: '03-Jan', income: 200 },
    { date: '04-Jan', income: 480 },
    { date: '05-Jan', income: 100 },
    { date: '06-Jan', income: 300 },
    { date: '07-Jan', income: 100 },
    { date: '08-Jan', income: 480 },
    { date: '09-Jan', income: 100 },
    { date: '10-Jan', income: 380 },
    { date: '11-Jan', income: 200 }
  ], []);

  const { linePath, areaPath } = useMemo(() => {
    const maxIncome = Math.max(...data.map(item => item.income));
    const height = 200;
    const width = 1000;

    // Calculate points for smooth curve
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - (item.income / maxIncome * height * 0.8)
    }));

    // Generate smooth curve path
    const linePath = points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = points[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 3;
      const cp2x = prev.x + 2 * (point.x - prev.x) / 3;
      return `${path} C ${cp1x},${prev.y} ${cp2x},${point.y} ${point.x},${point.y}`;
    }, '');

    // Generate area path
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return { linePath, areaPath };
  }, [data]);

  // Calculate y-axis values
  const yAxisValues = [600, 500, 400, 300, 200, 100, 0];

  return (
    <div className="w-full ">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-end mb-8">

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Trend</span>
            </div>
          </div>
        </div>

        {/* Graph Container */}
        <div className="relative h-[300px] mt-4">
          {/* Y-axis labels */}
          <div className="absolute -left-9 top-20 items-center  -translate-y-1/2">
            <p className="text-sm text-black font-medium transform -rotate-90 whitespace-nowrap ">Income</p>
          </div>
          <div className="absolute left-0 h-[200px] ms-2 flex flex-col justify-between  text-sm text-gray-500">
            {yAxisValues.map((value, index) => (
              <div key={index} className="relative h-0">
                <span className="absolute -translate-y-1/2 -translate-x-full ml-[15px] text-xs">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Graph Area */}
          <div className="ml-8 h-full">

            {/* Grid Lines */}
            <div className="absolute left-8 right-0 h-[200px]">
              {yAxisValues.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-gray-100"
                  style={{ top: `${(index * 100) / 6}%` }}

                ></div>
              ))}
            </div>

            {/* SVG Graph */}
            <div className="relative h-[200px] z-10">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 1000 200"
                preserveAspectRatio="none"
              >
                {/* Area Fill */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(16 185 129 / 0.2)" />
                    <stop offset="100%" stopColor="rgb(16 185 129 / 0.05)" />
                  </linearGradient>
                </defs>
                <path
                  d={areaPath}
                  fill="url(#areaGradient)"
                  className="transition-all duration-300"
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Data Points with Tooltips */}
                {data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 1000;
                  const y = 200 - (item.income / Math.max(...data.map(d => d.income)) * 200 * 0.8);
                  const isHovered = hoveredPoint === index;

                  return (
                    <g
                      key={index}
                      className="transform pb-5"
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <foreignObject
                          x={x - 50}
                          y={y - 45}
                          width="100"
                          height="35"
                          className="bg-gray-50 rounded-md  pb-2"
                        >
                          <div className="px-2">
                            <p className="text-xs text-gray-700 ">{item.date}</p>
                            <p className="text-xs font-semibold text-gray-900 ">{`Income: $${item.income}`}</p>
                          </div>
                        </foreignObject>
                      )}

                      {/* Outer circle (always visible) */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        className="fill-emerald-500 opacity-10"
                      />

                      {/* Inner circle (no hover effect) */}
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        className="fill-emerald-500 stroke-white stroke-2"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-axis Labels */}
            <div className="mt-4">
              {/* Dates */}
              <div className="flex justify-between gap-x-1">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className={`text-xs text-gray-500 text-center transition-all duration-200 ${hoveredPoint === index
                      ? 'border-b-2 border-emerald-500'
                      : ''
                      }`}
                  >
                    {item.date}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <span className="text-sm font-medium text-black">Month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrderGraph;

