import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout/Layout'

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      task,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setTask('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
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
   
      
      <div className="mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-300 mb-2 text-gray-700"
        />
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded-lg transition duration-300"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
      
      <ul className="list-none p-0">
        {todos.map(todo => (
          <li key={todo.id} className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''}`}>
              {todo.task}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => toggleTodo(todo.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg transition duration-300"
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => removeTodo(todo.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
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
