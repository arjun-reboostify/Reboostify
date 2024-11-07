import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout/Layout'

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  category: string;
  timeSpent: number;
  notes: string[];
  tags: string[];
  subtasks: {
    id: number;
    text: string;
    completed: boolean;
  }[];
}

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  averageTimeSpent: number;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  categoryBreakdown: Record<string, number>;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate' | 'timeSpent'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [taskNote, setTaskNote] = useState('');
  const [taskTag, setTaskTag] = useState('');
  const [subtask, setSubtask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [categories] = useState([
    'Work', 'Personal', 'Shopping', 'Health', 'Education', 'Home'
  ]);

  // Timer for tracking time spent
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTask !== null) {
      interval = setInterval(() => {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === activeTask 
              ? { ...todo, timeSpent: todo.timeSpent + 1 }
              : todo
          )
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTask]);

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos, (key, value) => {
        if (key === 'createdAt' || key === 'dueDate') {
          return value ? new Date(value) : null;
        }
        return value;
      }));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const calculateStats = (): TodoStats => {
    const now = new Date();
    const completed = todos.filter(todo => todo.completed).length;

    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
      overdue: todos.filter(todo => 
        todo.dueDate && new Date(todo.dueDate) < now && !todo.completed
      ).length,
      completionRate: todos.length ? (completed / todos.length) * 100 : 0,
      averageTimeSpent: todos.length 
        ? todos.reduce((acc, todo) => acc + todo.timeSpent, 0) / todos.length 
        : 0,
      priorityBreakdown: {
        high: todos.filter(todo => todo.priority === 'high').length,
        medium: todos.filter(todo => todo.priority === 'medium').length,
        low: todos.filter(todo => todo.priority === 'low').length,
      },
      categoryBreakdown: todos.reduce((acc, todo) => ({
        ...acc,
        [todo.category]: (acc[todo.category] || 0) + 1
      }), {} as Record<string, number>)
    };
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      task,
      completed: false,
      priority,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      category: category || 'Uncategorized',
      timeSpent: 0,
      notes: [],
      tags: [],
      subtasks: []
    };

    setTodos([...todos, newTodo]);
    setTask('');
    setDueDate('');
    setPriority('medium');
    setCategory('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    if (activeTask === id) setActiveTask(null);
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (activeTask === id) setActiveTask(null);
  };

  const addNote = (id: number) => {
    if (!taskNote.trim()) return;
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { ...todo, notes: [...todo.notes, taskNote] }
        : todo
    ));
    setTaskNote('');
  };

  const addTag = (id: number) => {
    if (!taskTag.trim()) return;
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        // Create a Set, add the new tag, and convert back to array without spread
        const tagSet = new Set(todo.tags);
        tagSet.add(taskTag);
        return { ...todo, tags: Array.from(tagSet) };
      }
      return todo;
    }));
    setTaskTag('');
  };

  const addSubtask = (id: number) => {
    if (!subtask.trim()) return;
    setTodos(todos.map(todo =>
      todo.id === id 
        ? {
            ...todo,
            subtasks: [
              ...todo.subtasks,
              { id: Date.now(), text: subtask, completed: false }
            ]
          }
        : todo
    ));
    setSubtask('');
  };

  const toggleSubtask = (todoId: number, subtaskId: number) => {
    setTodos(todos.map(todo =>
      todo.id === todoId
        ? {
            ...todo,
            subtasks: todo.subtasks.map(st =>
              st.id === subtaskId
                ? { ...st, completed: !st.completed }
                : st
            )
          }
        : todo
    ));
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getPriorityEmoji = (priority: Todo['priority']): string => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '';
    }
  };

  const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
      'Work': '💼',
      'Personal': '👤',
      'Shopping': '🛒',
      'Health': '🏥',
      'Education': '📚',
      'Home': '🏠',
      'Uncategorized': '📋'
    };
    return emojiMap[category] || '📋';
  };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      const matchesSearch = todo.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const now = new Date();
      switch (filter) {
        case 'active': return !todo.completed && matchesSearch;
        case 'completed': return todo.completed && matchesSearch;
        case 'overdue': return !todo.completed && todo.dueDate && new Date(todo.dueDate) < now && matchesSearch;
        default: return matchesSearch;
      }
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] - priorityOrder[a.priority]) * order;
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return (b.dueDate.getTime() - a.dueDate.getTime()) * order;
        case 'timeSpent':
          return (b.timeSpent - a.timeSpent) * order;
        default:
          return (b.createdAt.getTime() - a.createdAt.getTime()) * order;
      }
    });

  const stats = calculateStats();
  const points = [
    {
      title: "Face Your Demons",
      text: "Now or never - dump all the demons and face it relentlessly. This will prove you have uplifted from materialism and pleasureness to achieve greatness.",
      icon: "🔥"
    },
    {
      title: "Beyond Reality",
      text: "You are all in the fake reality game interpreted by the mind. It's just a tool to help you face demons.",
      icon: "🧠"
    },
    {
      title: "Victory Over Self",
      text: "It's not about beating somebody else but victory over myself by going to war with myself each and every second.",
      icon: "⚔️"
    },
    {
      title: "Normsl as Breathing",
      text: "Just like breathing is normal and we don't even know we're doing it, that is how we have to live our life. we have to suffer every bit of seconds till the point it feels normal and don't even know that we are doing it That is how we find peace with ourselves.",
      icon: "🌬️"
    },
    {
      title: "Embrace the Pain",
      text: "Stop thinking, make mind numb and most importantly let me enjoy the pain. Do it right now to beat the uncertainty.",
      icon: "💪"
    },
    {
      title: "Mind is Everything",
      text: "Always remember mind is above all. Mind is everything. The Creator has given you two choices as an elimination process.",
      icon: "✨"
    },
    {
      title: "The Choice",
      text: "Either face demons relentlessly transcending limits for a greater purpose, or indulge in worldly things. The choice is yours.",
      icon: "⚖️"
    },
    {
      title: "Divine Love",
      text: "Krishna said in Bhagavad Gita that he loves and enjoys seeing a person sacrificing. The more you sacrifice your identity for the greater purpose, the more likely you are to live in heaven.",
      icon: "🙏"
    },
    {
      title: "Power of Belief",
      text: "Pray and believe because belief is everything as it is rendered by the mind itself.",
      icon: "⭐"
    },
    {
      title: "Embrace the Journey",
      text: "Don't worry - what has to happen will definitely happen in future even if it's death. Stop worrying and redirect your mind to suffering and enjoy every bit of it NOW!",
      icon: "🚀"
    }
  ];
  return (
    <Layout title='Make'>
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">📝 Ultra Todo List</h1>

      {/* Stats Dashboard */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="mb-4 px-3 py-2 bg-blue-100 rounded-lg w-full text-left text-sm sm:text-base"
      >
        📊 {showStats ? 'Hide' : 'Show'} Statistics
      </button>

      {showStats && (
        <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
              <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
              <p className="text-lg sm:text-2xl font-bold">📊 {stats.total}</p>
            </div>
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
              <p className="text-xs sm:text-sm text-gray-600">Completed</p>
              <p className="text-lg sm:text-2xl font-bold">✅ {stats.completed}</p>
            </div>
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
              <p className="text-lg sm:text-2xl font-bold">⏳ {stats.pending}</p>
            </div>
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
              <p className="text-xs sm:text-sm text-gray-600">Overdue</p>
              <p className="text-lg sm:text-2xl font-bold">⚠️ {stats.overdue}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
              <h3 className="font-bold mb-2 text-sm sm:text-base">Priority Breakdown</h3>
              <p className="text-sm">🔴 High: {stats.priorityBreakdown.high}</p>
              <p className="text-sm">🟡 Medium: {stats.priorityBreakdown.medium}</p>
              <p className="text-sm">🟢 Low: {stats.priorityBreakdown.low}</p>
            </div>
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow">
              <h3 className="font-bold mb-2 text-sm sm:text-base">Category Breakdown</h3>
              {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                <p key={category} className="text-sm">{getCategoryEmoji(category)} {category}: {count}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-4 sm:mb-6 space-y-2 sm:space-y-4">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="🖊️ Add a new task"
          className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Todo['priority'])}
            className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {getCategoryEmoji(cat)} {cat}
              </option>
            ))}
          </select>
          
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          />
        </div>
        
        <button
          type="submit"
          className="w-full p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
        >
          ➕ Add Task
        </button>
      </form>

      {/* Search and Filters */}
      <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search tasks..."
          className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as typeof filter)}
            className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="all">📋 All Tasks</option>
            <option value="active">⏳ Active</option>
            <option value="completed">✅ Completed</option>
            <option value="overdue">⚠️ Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            <option value="createdAt">📅 Sort by Date Created</option>
            <option value="priority">🎯 Sort by Priority</option>
            <option value="dueDate">⏰ Sort by Due Date</option>
            <option value="timeSpent">⌛ Sort by Time Spent</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
          >
            {sortOrder === 'asc' ? '⬆️ Ascending' : '⬇️ Descending'}
          </button>
        </div>
      </div>

      {/* Todo List */}
      {filteredAndSortedTodos.length === 0 ? (
        <div className="text-center p-4 sm:p-8 bg-gray-50 rounded-lg">
          <p className="text-lg sm:text-xl">📭 No tasks found</p>
          <p className="text-sm sm:text-base text-gray-500">Add some tasks or try a different filter</p>
        </div>
      ) : (
        <ul className="space-y-2 sm:space-y-4">
          {filteredAndSortedTodos.map(todo => (
            <li
              key={todo.id}
              className={`p-2 sm:p-4 border rounded-lg ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="p-1 sm:p-2 hover:bg-gray-100 rounded"
                  >
                    {todo.completed ? '✅' : '⭕'}
                  </button>
                  
                  <span className={`font-medium text-sm sm:text-base ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.task}
                  </span>
                </div>

                <button
                  onClick={() => removeTodo(todo.id)}
                  className="p-1 sm:p-2 hover:bg-red-100 rounded text-red-500"
                >
                  🗑️
                </button>
              </div>

              <div className="ml-6 sm:ml-10 space-y-2">
                {/* Task Details */}
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span>{getPriorityEmoji(todo.priority)} {todo.priority}</span>
                  <span>{getCategoryEmoji(todo.category)} {todo.category}</span>
                  {todo.dueDate && (
                    <span className={`
                      ${new Date(todo.dueDate) < new Date() && !todo.completed 
                        ? 'text-red-500' 
                        : 'text-gray-500'}
                    `}>
                      ⏰ Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span>⌛ Time: {formatTime(todo.timeSpent)}</span>
                </div>

                {/* Tags */}
                {todo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {todo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 rounded-full text-xs sm:text-sm"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Subtasks */}
                {todo.subtasks.length > 0 && (
                  <div className="space-y-1">
                    {todo.subtasks.map(subtask => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-2 ml-4"
                      >
                        <button
                          onClick={() => toggleSubtask(todo.id, subtask.id)}
                          className="text-xs sm:text-sm"
                        >
                          {subtask.completed ? '✅' : '⭕'}
                        </button>
                        <span className={`text-xs sm:text-sm ${subtask.completed ? 'line-through' : ''}`}>
                          {subtask.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Task Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTask(activeTask === todo.id ? null : todo.id)}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-100 rounded-full"
                  >
                    {activeTask === todo.id ? '⏹️ Stop' : '▶️ Start'} Timer
                  </button>

                  {/* Notes Input */}
                  <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={taskNote}
                      onChange={e => setTaskNote(e.target.value)}
                      placeholder="📝 Add note"
                      className="flex-1 px-2 py-1 text-xs sm:text-sm border rounded"
                    />
                    <button
                      onClick={() => addNote(todo.id)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-yellow-100 rounded-full whitespace-nowrap"
                    >
                      ➕ Note
                    </button>
                  </div>

                  {/* Tags Input */}
                  <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={taskTag}
                      onChange={e => setTaskTag(e.target.value)}
                      placeholder="🏷️ Add tag"
                      className="flex-1 px-2 py-1 text-xs sm:text-sm border rounded"
                    />
                    <button
                      onClick={() => addTag(todo.id)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 rounded-full whitespace-nowrap"
                    >
                      ➕ Tag
                    </button>
                  </div>

                  {/* Subtask Input */}
                  <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={subtask}
                      onChange={e => setSubtask(e.target.value)}
                      placeholder="📋 Add subtask"
                      className="flex-1 px-2 py-1 text-xs sm:text-sm border rounded"
                    />
                    <button
                      onClick={() => addSubtask(todo.id)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-100 rounded-full whitespace-nowrap"
                    >
                      ➕ Subtask
                    </button>
                  </div>
                </div>

                {/* Notes List */}
                {todo.notes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {todo.notes.map((note, index) => (
                      <div key={index} className="text-xs sm:text-sm text-gray-600">
                        📝 {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      
    </div>
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 md:p-12">
   <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 leading-tight">
     Transcend Your Limits
   </h1>
   
   <div className="max-w-4xl mx-auto grid gap-6 md:gap-8">
     {points.map((point, index) => (
       <div
         key={index}
         className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-102 transition-transform duration-300 border border-white border-opacity-20"
       >
         <div className="flex items-start gap-4">
           <span className="text-3xl">{point.icon}</span>
           <div>
             <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
               {point.title}
             </h2>
             <p className="text-gray-300 leading-relaxed">
               {point.text}
             </p>
           </div>
         </div>
       </div>
     ))}
   </div>
   
   <div className="text-center mt-12">
     <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 border border-white border-opacity-20 backdrop-blur-lg">
       Start Your Journey Now 🚀
     </button>
   </div>
 </div>
 </Layout>
    
  );
};

export default TodoList;