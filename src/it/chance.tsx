import React, { useEffect, useState } from 'react';
import loadingImage from './music/espresso.jpg'; // Update the path to your image

const LoadingOverlay: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the overlay after 2 seconds
    const timer1 = setTimeout(() => {
      setVisible(true);
    }, 3500);

    // Hide the overlay after 4 seconds
    const timer2 = setTimeout(() => {
      setVisible(false);
    }, 6000); // 2 seconds + 4 seconds

    // Clean up timers on component unmount
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) {
    return null; // Do not render anything if not visible
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center text-white bg-black p-4 rounded-lg shadow-lg max-w-xs w-full">
        <img
          src={loadingImage} // Use the local image
          alt="Loading"
          className="mb-2"
        />
        <p className="text-center">Reboostify v2.11</p>
        <p className="text-center">Developed by - AKD</p>
       
      </div>
    </div>
  );
};

export default LoadingOverlay;
