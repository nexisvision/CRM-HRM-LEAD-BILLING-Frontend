import React, { useMemo, useState } from 'react';
import { Select } from 'antd';
import moment from 'moment';

const RecentOrderGraph = ({ subclients }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const currentYear = moment().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate year options (current year - 4 years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.unshift(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // Process data for the selected year
  const data = useMemo(() => {
    if (!subclients) return [];

    // Filter clients for selected year and group by month
    const monthlyData = Array(12).fill(0);
    
    subclients.forEach(client => {
      const createdDate = moment(client.createdAt);
      if (createdDate.year() === selectedYear) {
        const month = createdDate.month();
        monthlyData[month]++;
      }
    });

    // Convert to required format
    return monthlyData.map((count, index) => ({
      date: moment().month(index).format('MMM'),
      count: count
    }));
  }, [subclients, selectedYear]);

  // Calculate y-axis values dynamically
  const maxCount = Math.max(...data.map(item => item.count), 1);
  const yAxisValues = useMemo(() => {
    const step = Math.ceil(maxCount / 5); // Dynamic step based on max value
    const values = [];
    for (let i = 0; i <= 5; i++) {
      values.push(step * (5 - i));
    }
    return values;
  }, [maxCount]);

  const { linePath, areaPath } = useMemo(() => {
    const height = 200;
    const width = 1000;

    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - (item.count / maxCount * height * 0.8)
    }));

    const linePath = points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = points[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 3;
      const cp2x = prev.x + 2 * (point.x - prev.x) / 3;
      return `${path} C ${cp1x},${prev.y} ${cp2x},${point.y} ${point.x},${point.y}`;
    }, '');

    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return { linePath, areaPath };
  }, [data, maxCount]);

  return (
    <div className="w-full">
      <div className="p-6">
        {/* Header with Year Filter */}
        <div className="flex items-center justify-between mb-8">
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 120 }}
          >
            {yearOptions.map(year => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Clients</span>
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
          <div className="absolute -left-9 top-20 items-center -translate-y-1/2">
            <p className="text-sm text-black font-medium transform -rotate-90 whitespace-nowrap">
              Number of Clients
            </p>
          </div>
          <div className="absolute left-0 h-[200px] ms-2 flex flex-col justify-between text-sm text-gray-500">
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
                  style={{ top: `${(index * 100) / 5}%` }}
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
                  const y = 200 - (item.count / maxCount * 200 * 0.8);
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
                          className="bg-gray-50 rounded-md pb-2"
                        >
                          <div className="px-2">
                            <p className="text-xs text-gray-700">{item.date}</p>
                            <p className="text-xs font-semibold text-gray-900">{`Clients: ${item.count}`}</p>
                          </div>
                        </foreignObject>
                      )}

                      {/* Data Point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        className="fill-emerald-500 opacity-10"
                      />
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
              <div className="flex justify-between gap-x-1">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className={`text-xs text-gray-500 text-center transition-all duration-200 ${
                      hoveredPoint === index ? 'border-b-2 border-emerald-500' : ''
                    }`}
                  >
                    {item.date}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <span className="text-sm font-medium text-black">Months ({selectedYear})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrderGraph;

