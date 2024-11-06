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

  return (
    <Layout title='Make'>
   
      <h1 className="text-center text-2xl font-bold text-white mb-6">Now or Never Dump all the demons and face it relentlessly this will prove that you have up lifted from this materialism and pleasureness to achieve greatness so just a tool to help you face demons so you are all in the fake reality game interpreted by the mind so just have to do it just to go the distance to finish i have to finish its not like to beat somebody else but victory over myself by going to war with myself each and every second just like breathing breathing is normal we don't even know that we are doing so that is how we have to live our life period that is how we find peace with ourselves so just stop thinking make mind numb and most importantly let me enjoy the pain so do it right now to beat the uncertainity one life go achieve always remember mind is above all mind is everything it's simple god/creator has given you two choices as it is a elimination process to check what i choose either to face demons relentlessly transcending my own limits to a greater purpose or i get to indulge into worldly things the choice is yours and you have to make it remembering that heavens is his also krishna said in bhavgad gita that he love and enjoys to see a person sacrificing so conclusion is the more you sacrifice your identity for the greater purpose or your duty the more likely is that you got to live in heaven pray and beleive because believe is everything as it is rendered by the mind itself don't worry the thing that has to happen will defenitely happen in future even if it's death so stop worrying and redirect your mind to suffering and enjoy it every bit of it</h1>
      
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
    
    </Layout>
  );
};

export default TodoList;
