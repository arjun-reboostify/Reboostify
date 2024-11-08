import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  deadline: string;
  description: string;
}

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('clockTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({ deadline: '', description: '' });
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('clockTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isTimeInRange = (current: string, start: string, end: string): boolean => {
    // Ensure all parameters are valid strings
    if (!current || !start || !end) {
      return false;
    }

    try {
      const [currentHour, currentMinute] = current.split(':').map(Number);
      const [startHour, startMinute] = start.split(':').map(Number);
      const [endHour, endMinute] = end.split(':').map(Number);

      const currentMinutes = currentHour * 60 + currentMinute;
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      // Handle cases crossing midnight
      if (endMinutes < startMinutes) {
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      }

      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } catch (error) {
      console.error('Error parsing time:', error);
      return false;
    }
  };

  const getCurrentTask = () => {
    if (tasks.length === 0) return null;

    const currentTimeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    const sortedTasks = [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
    
    // Find the current task based on time ranges
    for (let i = 0; i < sortedTasks.length; i++) {
      const currentTaskDeadline = sortedTasks[i].deadline;
      const previousTaskDeadline = i > 0 ? sortedTasks[i - 1].deadline : '00:00';
      
      if (isTimeInRange(currentTimeString, previousTaskDeadline, currentTaskDeadline)) {
        return sortedTasks[i];
      }
    }

    // Check if we're in the last task's range (from last deadline to midnight)
    const lastTask = sortedTasks[sortedTasks.length - 1];
    if (isTimeInRange(currentTimeString, lastTask.deadline, '23:59')) {
      return lastTask;
    }

    // If no task is found, return the first task of the day
    return sortedTasks[0];
  };

  // Rest of the component remains the same...
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.deadline && newTask.description) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask
      };
      setTasks([...tasks, task]);
      setNewTask({ deadline: '', description: '' });
      setIsAddingTask(false);
    }
  };

  const updateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? editingTask : task
      ));
      setEditingTask(null);
    }
  };

  const cycleCurrentTask = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
    if (sortedTasks.length > 1) {
      setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % sortedTasks.length);
    }
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const hourRotation = ((hours % 12) * 30) + (minutes / 2);
  const minuteRotation = (minutes * 6) + (seconds / 10);
  const secondRotation = seconds * 6;

  const currentTask = getCurrentTask();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Active Task Banner */}
      {currentTask && (
        <div 
          onClick={cycleCurrentTask}
          className="w-full max-w-3xl mb-8 cursor-pointer transform hover:scale-105 transition-all"
        >
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg animate-pulse">
            <div className="text-white text-center">
              <p className="text-xl font-bold mb-1">{currentTask.description}</p>
              <p className="text-sm">Deadline: {currentTask.deadline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Clock Face */}
      <div className="relative w-[350px] h-[350px] flex items-center justify-center bg-gray-800 rounded-full shadow-2xl">
        {/* Clock Numbers */}
        {[...Array(12)].map((_, i) => (
          <span
            key={i + 1}
            className="absolute font-bold text-2xl text-white"
            style={{
              transform: `rotate(${(i + 1) * 30}deg) translateY(-140px)`,
            }}
          >
            <span
              style={{
                transform: `rotate(${-(i + 1) * 30}deg)`,
                display: 'inline-block',
              }}
            >
              {i + 1}
            </span>
          </span>
        ))}

        {/* Clock Hands */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute w-2 h-24 bg-green-400 rounded-full"
            style={{
              transform: `rotate(${hourRotation}deg)`,
              transformOrigin: 'center bottom',
              bottom: '50%',
            }}
          />
          <div
            className="absolute w-1.5 h-32 bg-yellow-400 rounded-full"
            style={{
              transform: `rotate(${minuteRotation}deg)`,
              transformOrigin: 'center bottom',
              bottom: '50%',
            }}
          />
          <div
            className="absolute w-1 h-36 bg-pink-500 rounded-full"
            style={{
              transform: `rotate(${secondRotation}deg)`,
              transformOrigin: 'center bottom',
              bottom: '50%',
            }}
          />
          <div className="absolute w-4 h-4 bg-white rounded-full z-10" />
        </div>
      </div>

      {/* Digital Time Display */}
      <div className="mt-8 flex gap-4 text-4xl font-bold text-white">
        <span className="bg-green-400 px-4 py-2 rounded-lg shadow-lg">
          {hours.toString().padStart(2, '0')}
        </span>
        <span className="bg-yellow-400 px-4 py-2 rounded-lg shadow-lg">
          {minutes.toString().padStart(2, '0')}
        </span>
        <span className="bg-pink-500 px-4 py-2 rounded-lg shadow-lg">
          {seconds.toString().padStart(2, '0')}
        </span>
        <span className="bg-blue-500 px-4 py-2 rounded-lg shadow-lg">{ampm}</span>
      </div>

      {/* Task Management */}
      <div className="mt-8 w-full max-w-md">
        <button
          onClick={() => {
            setIsAddingTask(!isAddingTask);
            setEditingTask(null);
          }}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all"
        >
          {isAddingTask ? 'Cancel' : 'Add New Task'}
        </button>

        {/* Add/Edit Task Form */}
        {(isAddingTask || editingTask) && (
          <form onSubmit={editingTask ? updateTask : addTask} className="mt-4 space-y-4 bg-gray-800 p-4 rounded-lg">
            <div>
              <label className="block text-white mb-1 text-sm">Deadline</label>
              <input
                type="time"
                value={editingTask ? editingTask.deadline : newTask.deadline}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, deadline: e.target.value });
                  } else {
                    setNewTask({ ...newTask, deadline: e.target.value });
                  }
                }}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1 text-sm">Description</label>
              <input
                type="text"
                value={editingTask ? editingTask.description : newTask.description}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, description: e.target.value });
                  } else {
                    setNewTask({ ...newTask, description: e.target.value });
                  }
                }}
                placeholder="Task description"
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transform hover:scale-105 transition-all"
            >
              {editingTask ? 'Update Task' : 'Save Task'}
            </button>
          </form>
        )}

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold mb-2">Scheduled Tasks</h3>
            <div className="space-y-2">
              {[...tasks]
                .sort((a, b) => a.deadline.localeCompare(b.deadline))
                .map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div 
                    className="flex flex-col flex-grow cursor-pointer"
                    onClick={() => {
                      setEditingTask(task);
                      setIsAddingTask(false);
                    }}
                  >
                    <span className="text-white text-sm">Deadline: {task.deadline}</span>
                    <span className="text-white font-medium">{task.description}</span>
                  </div>
                  <button
                    onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                    className="text-red-500 hover:text-red-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-colors ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clock;