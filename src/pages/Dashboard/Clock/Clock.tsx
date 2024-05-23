import React, { useState, useEffect } from "react";

interface ClockProps {
  timezone: string;
}

const colors = [
  "#FFD1DC", // Light Pink
  "#FF9AA2", // Pastel Red
  "#FFB7B2", // Light Coral
  "#FFDAC1", // Light Orange
  "#E2F0CB", // Light Green
  "#B5EAD7", // Light Cyan
  "#C7CEEA", // Light Lavender
  "#C1C8E4", // Light Blue
  "#B2EBF2", // Light Aqua
  "#FFDFD3"  // Light Peach
];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const Clock: React.FC<ClockProps> = ({ timezone, address }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [backgroundColor, setBackgroundColor] = useState<string>(getRandomColor());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  function tick() {
    setCurrentTime(new Date());
  }

  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // Handle special cases for 11th, 12th, 13th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  function formatDate(date: Date, timezone: string): string {
    const options = { timeZone: timezone, weekday: 'short' };
    const day = date.toLocaleDateString("en-US", { day: 'numeric', timeZone: timezone });
    const weekday = date.toLocaleDateString("en-US", options);
    return `${day}${getOrdinalSuffix(parseInt(day))}, ${weekday}`;
  }

  function formatTime(date: Date, timezone: string): string {
    const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = date.toLocaleTimeString("en-US", options);
    
    // Ensure leading zeros for hour and minute
    const [hour, minute, period] = timeString.split(/[: ]/);
    const formattedHour = hour.padStart(2, '0');
    const formattedMinute = minute.padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  return (
    <div className="card" style={{ backgroundColor: backgroundColor }}>
      <h3 >{formatTime(currentTime, timezone)}</h3>
      <h2>{formatDate(currentTime, timezone)}</h2>
      <img src="https://img.freepik.com/premium-vector/syrmak-oyu_634064-111.jpg?size=626&ext=jpg&ga=GA1.2.659085256.1710435137&semt=ais_user_b" alt="" />
      <div className="line"></div>
      <h4>{address}</h4>
      <button>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </button>
    </div>
  );
}

export default Clock;
