import React, { useState,useEffect,useRef } from 'react';

const DateRangeFilter = ({ onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Day');
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [currentMonths, setCurrentMonths] = useState([
    new Date().getMonth(),
    new Date().getMonth() + 1
  ]);
  const [currentYears, setCurrentYears] = useState([
    new Date().getFullYear(),
    new Date().getFullYear()
  ]);
   const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const ranges = [
    'Today',
    'Yesterday',
    'Last 7 Day',
    'Last 30 Day',
    'This Month',
    'Custom'
  ];

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleDateClick = (date) => {
    if (!date.isCurrentMonth) return;

    const newDates = { ...selectedDates };
    if (!selectedDates.startDate || (selectedDates.startDate && selectedDates.endDate)) {
      newDates.startDate = date.date;
      newDates.endDate = date.date;
    } else {
      if (date.date < selectedDates.startDate) {
        newDates.startDate = date.date;
        newDates.endDate = selectedDates.startDate;
      } else {
        newDates.endDate = date.date;
      }
    }
    setSelectedDates(newDates);
  };

  const handleMonthChange = (value, index) => {
    const newMonths = [...currentMonths];
    newMonths[index] = parseInt(value);
    setCurrentMonths(newMonths);
  };

  const handleYearChange = (value, index) => {
    const newYears = [...currentYears];
    newYears[index] = parseInt(value);
    setCurrentYears(newYears);
  };

  const handleRangeClick = (range) => {
    setSelectedRange(range);
    if (range !== 'Custom') {
      setIsOpen(false);
      onDateRangeChange && onDateRangeChange(range);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const today = new Date();
    const startDate = selectedDates.startDate;
    const endDate = selectedDates.endDate;

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isSelected = currentDate >= startDate && currentDate <= endDate;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      days.push({
        day: i,
        isCurrentMonth: true,
        isSelected,
        isToday,
        date: currentDate
      });
    }

    return days;
  };

  const Calendar = ({ index }) => (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <select
          value={currentMonths[index]}
          onChange={(e) => handleMonthChange(e.target.value, index)}
          className="px-2 py-1 border border-gray-200 rounded text-sm"
        >
          {months.map((month, i) => (
            <option key={month} value={i}>{month}</option>
          ))}
        </select>
        <select
          value={currentYears[index]}
          onChange={(e) => handleYearChange(e.target.value, index)}
          className="px-2 py-1 border border-gray-200 rounded text-sm"
        >
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(
            (year) => (
              <option key={year} value={year}>{year}</option>
            )
          )}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}

        {generateCalendarDays(currentYears[index], currentMonths[index]).map((day, i) => (
          <div
            key={i}
            onClick={() => day.isCurrentMonth && handleDateClick(day)}
            className={`
              text-center py-2 text-sm rounded cursor-pointer
              ${!day.isCurrentMonth ? 'text-gray-300' : 'hover:bg-blue-50'}
              ${day.isSelected ? 'bg-blue-100 text-blue-600' : ''}
              ${day.isToday ? 'border border-blue-300' : ''}
            `}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    if (popupRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const isSpaceBelow = window.innerHeight - buttonRect.bottom > popupRect.height;
      if (!isSpaceBelow) {
        // If space below is not enough, place it above the button
        popupRef.current.style.top = `${buttonRect.top - popupRect.height - 10}px`;
      } else {
        // Otherwise, place it below the button
        popupRef.current.style.top = `${buttonRect.bottom + 10}px`;
      }
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      
      <button
      ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2  border border-gray-200 rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm text-gray-600">
          {selectedRange === 'Custom' 
            ? `${formatDate(selectedDates.startDate)} ~ ${formatDate(selectedDates.endDate)}`
            : selectedRange
          }
        </span>
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow z-50"
          style={{
            right: '20px',
            top: '180px'
          }}
        >
          <div className="flex">
            <div className="w-48 border-r border-gray-200 p-4">
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleRangeClick(range)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-1 text-sm ${
                    selectedRange === range
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {selectedRange === 'Custom' && (
              <div className="flex-1">
                <div className="flex justify-between p-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    {formatDate(selectedDates.startDate)} ~ {formatDate(selectedDates.endDate)}
                  </span>
                </div>
                <div className="flex">
                  <Calendar index={0} />
                  <div className="border-r border-gray-200" />
                  <Calendar index={1} />
                </div>
                <div className="flex justify-end p-4 space-x-2 border-t border-gray-200">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onDateRangeChange && onDateRangeChange({
                        startDate: selectedDates.startDate,
                        endDate: selectedDates.endDate
                      });
                    }}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;



