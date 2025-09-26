import { useEffect, useState } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  start?: boolean;
}

const Counter: React.FC<CounterProps> = ({ value, suffix = "", duration = 2000, start = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return; 

    let startValue = 0;
    const end = value;
    if (end === 0) return;

    const incrementTime = Math.floor(duration / end);

    const counter = setInterval(() => {
      startValue += 1;
      setCount(startValue);
      if (startValue >= end) {
        clearInterval(counter);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [value, duration, start]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export default Counter;
