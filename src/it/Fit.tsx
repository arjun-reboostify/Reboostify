import React, { useState, useEffect } from 'react';

const StepCounter: React.FC = () => {
  const [steps, setSteps] = useState(0);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [lastAcceleration, setLastAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const stepThreshold = 1.5; // Threshold to consider it as a step (adjust as needed)

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
      if (x && y && z) {
        // Calculate the change in acceleration
        const deltaX = Math.abs(x - lastAcceleration.x);
        const deltaY = Math.abs(y - lastAcceleration.y);
        const deltaZ = Math.abs(z - lastAcceleration.z);

        // Update if movement exceeds the step threshold
        if (deltaX + deltaY + deltaZ > stepThreshold) {
          setSteps((prevSteps) => prevSteps + 1);
        }

        // Update the last acceleration values
        setLastAcceleration({ x, y, z });
        setAcceleration({ x, y, z });
      }
    };

    // Add the motion event listener
    window.addEventListener('devicemotion', handleMotion);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [lastAcceleration]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Step Counter</h1>
      <div className="text-6xl font-bold text-blue-500">{steps}</div>
      <p className="text-gray-600 mt-2">Steps</p>
    </div>
  );
};

export default StepCounter;
