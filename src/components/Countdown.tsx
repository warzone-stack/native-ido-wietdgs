import { useEffect, useState } from 'react';

interface CountdownProps {
  endTime: Date;
}

export function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        return { hours: 0, minutes: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      return { hours, minutes };
    };

    // 初始计算
    setTimeLeft(calculateTimeLeft());

    // 每分钟更新一次
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className='flex items-center justify-center gap-1 text-base font-semibold'>
      <div>Finishing in：</div>
      <div className='p-2 rounded-sm bg-[#0000001A] dark:bg-background-dark'>
        {String(timeLeft.hours).padStart(2, '0')}
      </div>
      <div>：</div>
      <div className='p-2 rounded-sm bg-[#0000001A] dark:bg-background-dark'>
        {String(timeLeft.minutes).padStart(2, '0')}
      </div>
    </div>
  );
}
