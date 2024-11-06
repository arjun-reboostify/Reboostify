import React, { useState, useEffect } from 'react';
import coverImage from './img/30001652.webp';
import coverImag from './img/beautiful-fantasy-sexy-anime-girl-black-bikini_483949-6783.avif';
import { Layout } from '../components/layout/Layout/Layout'

// Sample task data
const tasks = [
  { id: 1, title: 'Complete a teacher lecture full without skipping', image: coverImage },
  { id: 2, title: 'Invite 5 friends', image: coverImag },
  { id: 3, title: 'Customize your profile', image: '/api/placeholder/400/320' },
  { id: 4, title: 'Post your first update', image: '/api/placeholder/400/320' },
  { id: 5, title: 'Earn your first badge', image: '/api/placeholder/400/320' },
];

const GlowRoadTasks: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [rewardImage, setRewardImage] = useState<string>('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  useEffect(() => {
    // Load progress from localStorage on component mount
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    if (storedCompletedTasks) {
      setCompletedTasks(JSON.parse(storedCompletedTasks));
      setCurrentTaskIndex(JSON.parse(storedCompletedTasks).length);
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage whenever completedTasks changes
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const handleTaskComplete = () => {
    const currentTask = tasks[currentTaskIndex];
    setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, currentTask.id]);
    setRewardImage(currentTask.image);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 20000); // Hide reward after 20 seconds

    // Move to the next task
    setCurrentTaskIndex((prevIndex) => prevIndex + 1);
  };

  const handleReset = () => {
    // Clear the local storage
    localStorage.removeItem('completedTasks');
    setCompletedTasks([]);
    setCurrentTaskIndex(0);
  };

  const currentTask = tasks[currentTaskIndex];

  return (
    <Layout title='Road'>
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Glow Road Tasks</h2>

      {currentTask && (
        <div
          className={`bg-white p-4 rounded-lg mb-4 ${completedTasks.includes(currentTask.id) ? 'opacity-50' : ''}`}
        >
          <h3 className="text-xl font-semibold">{currentTask.title}</h3>
          {!completedTasks.includes(currentTask.id) && (
            <button
              onClick={handleTaskComplete}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Complete Task
            </button>
          )}
        </div>
      )}

      {showReward && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black">
          <img src={rewardImage} alt="Reward" className="max-w-full max-h-full object-contain" />
          <button
            onClick={() => setShowReward(false)}
            className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      )}

      {/* Add the reset button */}
      <button
        onClick={handleReset}
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Reset
      </button>
    </div>
    </Layout>
  );
};

export default GlowRoadTasks;