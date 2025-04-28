import { useEffect, useState } from "react";
import { ButtonCommon, InputCommon } from "../common"

interface PointProps {
  id: number,
  top: number,
  left: number,
}

const ClearThePoints = () => {
  const [points, setPoints] = useState<PointProps[]>([]);
  const [pointCount, setPointCount] = useState<number | string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [nextId, setNextId] = useState(0);
  const [status, setStatus] = useState<'idle' | 'playing' | 'cleared' | 'gameover'>('idle');
  const [clickedPoints, setClickedPoints] = useState<number[]>([]);

  useEffect(() => {
    let timer: number;
    if (isPlaying && status === 'playing') {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, status]);

  useEffect(() => {
    if (isPlaying && points.length === 0 && status === 'playing') {
      setStatus('cleared');
      setIsPlaying(true);
    }
  }, [points, isPlaying, status]);

  const generateRandomPoints = (count: number) => {
    const margin = 8;
    const newPoints = Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * (100 - 2 * margin) + margin,
      left: Math.random() * (100 - 2 * margin) + margin,
    }));
    setPoints(newPoints);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPointCount(value === '' ? '' : parseInt(value, 10));
  };

  const handlePlay = () => {
    if (typeof pointCount !== 'number' || isNaN(pointCount) || pointCount < 3) {
      alert('Please enter a number greater than 3!');
      return;
    }

    setTime(0);
    setNextId(0);
    setStatus('playing');
    generateRandomPoints(pointCount);
    setClickedPoints([]);
    setIsPlaying(true);
  };

  const handleClickPoint = (id: number) => {
    if (status !== 'playing') return;

    if (id === nextId) {
      setClickedPoints((prev) => [...prev, id]);

      setTimeout(() => {
        setPoints((prevPoints) => prevPoints.filter((p) => p.id !== id));
        setNextId((prev) => prev + 1);
      }, 300);

    } else {
      setStatus('gameover');
      setIsPlaying(false);
    }
  };

  const renderTitle = () => {
    if (status === 'idle' || status === 'playing' ) {
      return { text: "LET'S PLAY", colorClass: '' };
    }
    if (status === 'cleared') {
      return { text: 'ALL CLEARED', colorClass: 'text-red-700' };
    }
    if (status === 'gameover') {
      return { text: 'GAME OVER', colorClass: 'text-red-700' };
    }
    return { text: '', colorClass: '' };
  };

  const { text, colorClass } = renderTitle();

  return (
    <div className='wrap-clear-points'>
      <div className="mx-[30rem]" >
        <h3 className={`wrap-title text-[20px] font-bold ${colorClass}`}>
          {text}
        </h3>

        <div className="flex items-center space-x-2">
          <p className=" font-normal w-[8rem] ">Points:</p>
          <InputCommon
            type="number"
            className="!py-0"
            value={pointCount}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <p className=" font-normal w-[8rem]">Time:</p>
          <p className="wrap-time" >{time.toFixed(1)}s</p>
        </div>

        <ButtonCommon className="my-2" onClick={handlePlay}>
          {(status === 'idle') ? 'Play' : 'Restart'}
        </ButtonCommon>

        <div className="wrap-box-container">
          <div className="wrap-box-points relative border border-black w-full h-[35rem] ">
            {
              points?.map((point) => (
                <div
                  key={point.id}
                  onClick={() => handleClickPoint(point.id)}

                  className={`wrap-points absolute border border-black font-bold flex justify-center items-center rounded-[2rem] w-12 h-12 cursor-pointer transition-colors duration-300 ${clickedPoints.includes(point.id) ? "bg-red-700 text-white" : "hover:bg-gray-200"
                    }`}

                  style={{
                    top: `${point.top}%`,
                    left: `${point.left}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {point.id + 1}
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default ClearThePoints