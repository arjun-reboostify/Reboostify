import React, { useState, useEffect, ReactNode } from 'react';
import { Layout } from '../components/layout/Layout/Layout';
import deserve from './img/29048830.webp'

interface ProgressProps {
  value: number;
  className?: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  image: string;
}

// Custom Progress Component
const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full ${className}`}>
    <div 
      className="bg-blue-500 rounded-full transition-all duration-300"
      style={{ width: `${value}%`, height: '100%' }}
    />
  </div>
);

// Custom Card Components
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-4 md:p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
);

// Custom Badge Component
const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800',
  } as const;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const tasks: Task[] = [
  { 
    id: 1, 
    title: 'Complete a teacher lecture full without skipping',
    description: 'Watch an entire lecture to earn points and unlock achievements',
    points: 100,
    image: deserve
  },
  { 
    id: 2, 
    title: 'Invite 5 friends',
    description: 'Share your learning journey with friends',
    points: 150,
    image: '/api/placeholder/400/320'
  },
  { 
    id: 3, 
    title: 'Customize your profile',
    description: 'Make your profile unique and stand out',
    points: 50,
    image: '/api/placeholder/400/320'
  },
  { 
    id: 4, 
    title: 'Post your first update',
    description: 'Share your progress with the community',
    points: 75,
    image: '/api/placeholder/400/320'
  },
  { 
    id: 5, 
    title: 'Earn your first badge',
    description: 'Complete tasks to earn special badges',
    points: 200,
    image: '/api/placeholder/400/320'
  },
];

interface StoredData {
  completed: number[];
  points: number;
  currentIndex: number;
}

const GlowRoadTasks: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('taskProgress');
    if (storedData) {
      const { completed, points, currentIndex } = JSON.parse(storedData) as StoredData;
      setCompletedTasks(completed);
      setTotalPoints(points);
      setCurrentTaskIndex(currentIndex);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskProgress', JSON.stringify({
      completed: completedTasks,
      points: totalPoints,
      currentIndex: currentTaskIndex
    }));
  }, [completedTasks, totalPoints, currentTaskIndex]);

  const handleTaskComplete = () => {
    const currentTask = tasks[currentTaskIndex];
    
    setCompletedTasks(prev => [...prev, currentTask.id]);
    setTotalPoints(prev => prev + currentTask.points);
    setShowReward(true);
    setAnimation('animate-bounce');
    
    setTimeout(() => {
      setAnimation('');
      setCurrentTaskIndex(prev => prev + 1);
      setShowReward(false);
    }, 2000);
  };

  const handleReset = () => {
    localStorage.removeItem('taskProgress');
    setCompletedTasks([]);
    setTotalPoints(0);
    setCurrentTaskIndex(0);
    setShowReward(false);
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <Layout title="Glow Road">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Glow Road Tasks</h1>
            <p className="text-gray-600 text-sm md:text-base">Complete tasks to earn points and rewards</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2 justify-end">
              <span className="text-2xl">🏆</span>
              <span className="text-xl md:text-2xl font-bold">{totalPoints}</span>
              <span className="text-gray-600 text-sm md:text-base">points</span>
            </div>
            <Badge variant="secondary" className="text-xs md:text-sm">
              Level {Math.floor(totalPoints / 100) + 1}
            </Badge>
          </div>
        </div>

        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              {completedTasks.length} of {tasks.length} tasks completed
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3 md:space-y-4">
          {tasks.map((task, index) => (
            <Card 
              key={task.id}
              className={`transition-all duration-300 ${
                completedTasks.includes(task.id)
                  ? 'bg-gray-50'
                  : index === currentTaskIndex
                  ? 'ring-2 ring-blue-500'
                  : 'opacity-60'
              }`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {completedTasks.includes(task.id) ? (
                        <span className="text-green-500 text-xl">✅</span>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                      )}
                      <h3 className="text-lg md:text-xl font-semibold">{task.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base mt-2">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-xs md:text-sm font-medium">{task.points} points</span>
                    </div>
                  </div>
                  
                  {index === currentTaskIndex && !completedTasks.includes(task.id) && (
                    <button
                      onClick={handleTaskComplete}
                      className={`w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-all ${animation}`}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm md:w-96 text-center p-4 md:p-6">
              <CardContent>
                <span className="text-5xl md:text-6xl mb-4 block">🏆</span>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-gray-600 text-sm md:text-base mb-4">
                  You earned {tasks[currentTaskIndex].points} points!
                </p>
                <button
                  onClick={() => setShowReward(false)}
                  className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Continue
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        <button
          onClick={handleReset}
          className="mt-6 md:mt-8 text-red-500 hover:text-red-600 font-medium flex items-center gap-2 text-sm md:text-base"
        >
          <span>❌</span>
          Reset Progress
        </button>
      </div>
    </Layout>
  );
};

export default GlowRoadTasks;