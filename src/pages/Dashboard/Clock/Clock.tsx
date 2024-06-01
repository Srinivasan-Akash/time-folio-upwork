// @ts-nocheck
import React, { useState, useEffect } from "react";
import moment from 'moment-timezone';

interface ClockProps {
  timezone: string;
  address: string;
  id: string;
  documentId: any;
  allTimezones: any;
}

const Clock: React.FC<ClockProps> = ({ timezone, address, deleteCard, id, documentId, allTimezones, color }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [daysUntilDSTChange, setDaysUntilDSTChange] = useState<number | null>(null);
  const [dstChangeType, setDSTChangeType] = useState<string | null>(null);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    checkDSTChange();
  }, [timezone]);

  function tick() {
    setCurrentTime(new Date());
  }

  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return "th"; // Handle special cases for 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  function formatDate(date: Date, timezone: string): string {
    const options = { timeZone: timezone, weekday: "short" };
    const day = date.toLocaleDateString("en-US", {
      day: "numeric",
      timeZone: timezone,
    });
    const weekday = date.toLocaleDateString("en-US", options);
    return `${day}${getOrdinalSuffix(parseInt(day))}, ${weekday}`;
  }

  function formatTime(date: Date, timezone: string): string {
    const options = {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const timeString = date.toLocaleTimeString("en-US", options);

    // Ensure leading zeros for hour and minute
    const [hour, minute, period] = timeString.split(/[: ]/);
    const formattedHour = hour.padStart(2, "0");
    const formattedMinute = minute.padStart(2, "0");
    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  function checkDSTChange() {
    const now = moment.tz(timezone);
    const isDST = now.isDST();
    let nextTransition;
    
    if (isDST) {
      nextTransition = moment.tz(timezone).endOf('year').startOf('day');
      while (!nextTransition.isDST()) {
        nextTransition.subtract(1, 'day');
      }
      nextTransition.add(1, 'day'); // Move to the first non-DST day
    } else {
      nextTransition = moment.tz(timezone).endOf('year').startOf('day');
      while (nextTransition.isDST()) {
        nextTransition.subtract(1, 'day');
      }
    }

    const daysUntilDSTChange = nextTransition.diff(now, 'days');
    if (daysUntilDSTChange <= 360 && daysUntilDSTChange > 0) {
      setDaysUntilDSTChange(daysUntilDSTChange);
      setDSTChangeType(isDST ? 'ends' : 'starts');
    } else {
      setDaysUntilDSTChange(null);
      setDSTChangeType(null);
    }
  }

  return (
    <div className="card" style={{ backgroundColor: color }}>
      <h3>{formatTime(currentTime, timezone)}</h3>
      <h2>{formatDate(currentTime, timezone)}</h2>
      <img
        src="https://img.freepik.com/premium-vector/syrmak-oyu_634064-111.jpg?size=626&ext=jpg&ga=GA1.2.659085256.1710435137&semt=ais_user_b"
        alt=""
      />
      <div className="line"></div>
      <h4>{address} {moment.tz(timezone).format('z')}</h4>
      {daysUntilDSTChange !== null && (
        <h2 style={{ marginTop: ".25em" }}>
          {daysUntilDSTChange === 1
            ? `DST ${dstChangeType} tomorrow`
            : `DST ${dstChangeType} in ${daysUntilDSTChange} days!`}
        </h2>
      )}
      <button onClick={() => deleteCard(id, documentId)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-trash-2"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>
    </div>
  );
};

export default Clock;
