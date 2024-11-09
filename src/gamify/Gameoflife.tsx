import React, { useState, useCallback, useEffect } from 'react';
import { X, Plus, Quote, Search, ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import { Layout } from '../components/layout/Layout/Layout';
import A from '../it/img/08e7afa211903fbb15f36d9bf9fc166fb52e4ad74b3c9b9bf4ea35a52d513674.webp'
import B from '../it/img/1326cb3e-be11-4ab7-afdf-ab82bdcc0801.webp'


interface Card {
  id: string;
  heading: string;
  emoji: string;
  description: string;
  tried: boolean;
  completedAt?: string;
  category?: string;
}

interface Quote {
  text: string;
  image: string;
  author: string;
}

// Emoji categories for the picker
const emojiCategories = {
    'Lecture':['🎨', '🎮', '🎲', '🎯', '🎭', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '🎺', '🎻'],
    'Coding':['🌺', '🌸', '🌼', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀'],
    'Excercise':['📱', '💻', '⌚️', '📚', '✏️', '📝', '📌', '📎', '🔑', '🔨', '🛠️', '⚙️', '📦', '📫', '🗑️'],
    'Podcasts/speeches': ['🧘', '🌟', '💭', '🎯', '📝', '🌱', '💪', '🧠', '❤️', '✨', '🌈', '☮️', '🕊️', '🌞', '🌙'],
    'CourseFollow':[],
    'Writing':[]
};
  

const SwipeableCards = () => {
  const [cards, setCards] = useState<Card[]>([
    {
        id: '1',
        heading: 'Maths',
        emoji: '📱',
        description: 'watch it attentively till the end',
        tried: false,
        category: 'Lecture'
      },
      {
        id: '2',
        heading: 'Question Paper',
        emoji: '📓',
        description: 'write down through pen your solutions to the problems',
        tried: false,
        category: 'Writing'
      },
      {
          id: '3',
          heading: 'Dsa',
          emoji: '🧠',
          description: 'do it by heart ',
          tried: false,
          category: 'CourseFollow'
        },
        {
          id: '4',
          heading: 'AcharyaPrashant',
          emoji: '🌞',
          description: 'gain insights of spirituality',
          tried: false,
          category: 'Podcasts/speeches'
        },
        {
          id: '5',
          heading: 'Pushups',
          emoji: '🤸🏻‍♂️',
          description: 'cross the physical limits',
          tried: false,
          category: 'Excercise'
        },
        {
          id: '6',
          heading: 'ReactJS',
          emoji: '💻',
          description: 'Build your Dream',
          tried: false,
          category: 'Coding'
        },


  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [searchEmoji, setSearchEmoji] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Lecture');
  const [newCard, setNewCard] = useState({
    heading: '',
    description: '',
    category: 'Lecture'
  });              
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const stoicQuotes: Quote[] = [
    {
      text: "I need you to push a little bit more hard to get me",
      image: A,
      author: "Futuriora"
    },
    {
      text: "I need you to push a little bit more hard to get me",
      image: B,
      author: "Futuriora"
    },
    {
      text: "I need you to push a little bit more hard to get me",
      image: A,
      author: "Futuriora"
    },
    {
      text: "I need you to push a little bit more hard to get me",
      image: A,
      author: "Futuriora"
    },
   
  ];

  // Touch handlers (same as before)
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(offsetX) > 100) {
      if (offsetX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (offsetX < 0 && currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
    setOffsetX(0);
  };

  const filteredEmojis = Object.entries(emojiCategories)
    .find(([category]) => category === selectedCategory)?.[1]
    .filter(emoji => 
      searchEmoji ? emoji.includes(searchEmoji) : true
    ) || [];

  const handleAddCard = () => {
    const newCardData: Card = {
      id: String(Date.now()),
      heading: newCard.heading,
      emoji: selectedEmoji,
      description: newCard.description,
      tried: false,
      category: newCard.category
    };
    setCards([...cards, newCardData]);
    setShowAddCard(false);
    setNewCard({ heading: '', description: '', category: 'Lecture' });
    setSelectedEmoji('✨');
  };

  const toggleTried = (id: string) => {
    setCards(cards.map(card => {
      if (card.id === id) {
        const newCard = { 
          ...card, 
          tried: !card.tried,
          completedAt: !card.tried ? new Date().toISOString() : undefined
        };
        if (newCard.tried) {
          setShowQuote(true);
        }
        return newCard;
      }
      return card;
    }));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    setShowDeleteConfirm(false);
  };

  const randomQuote = useCallback(() => {
    return stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)];
  }, []);

  const filteredCards = filterCategory
    ? cards.filter(card => card.category === filterCategory)
    : cards;
    
useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);
  
  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);
  
  // Save current index to localStorage
  useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex.toString());
  }, [currentIndex]);
  
  // Load current index on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('currentIndex');
    if (savedIndex) {
      setCurrentIndex(parseInt(savedIndex));
    }
  }, []);
  
  // Save filter category
  useEffect(() => {
    if (filterCategory) {
      localStorage.setItem('filterCategory', filterCategory);
    } else {
      localStorage.removeItem('filterCategory');
    }
  }, [filterCategory]);
  
  // Load filter category
  useEffect(() => {
    const savedFilter = localStorage.getItem('filterCategory');
    if (savedFilter) {
      setFilterCategory(savedFilter);
    }
  }, []);
  const clearStorageAndReset = () => {
    localStorage.removeItem('cards');
    localStorage.removeItem('currentIndex');
    localStorage.removeItem('filterCategory');
    setCards([
        {
            id: '1',
            heading: 'Maths',
            emoji: '📱',
            description: 'watch it attentively till the end',
            tried: false,
            category: 'Lecture'
          },
          {
            id: '2',
            heading: 'Question Paper',
            emoji: '📓',
            description: 'write down through pen your solutions to the problems',
            tried: false,
            category: 'Writing'
          },
          {
              id: '3',
              heading: 'Dsa',
              emoji: '🧠',
              description: 'do it by heart ',
              tried: false,
              category: 'CourseFollow'
            },
            {
              id: '4',
              heading: 'AcharyaPrashant',
              emoji: '🌞',
              description: 'gain insights of spirituality',
              tried: false,
              category: 'Podcasts/speeches'
            },
            {
              id: '5',
              heading: 'Pushups',
              emoji: '🤸🏻‍♂️',
              description: 'cross the physical limits',
              tried: false,
              category: 'Excercise'
            },
            {
              id: '6',
              heading: 'ReactJS',
              emoji: '💻',
              description: 'build your dream',
              tried: false,
              category: 'Coding'
            },
    ]);
    setCurrentIndex(0);
    setFilterCategory(null);
  };

  return (
    <Layout title='Gameoflife'>
<div className="relative h-[120vh] bg-black p-4 overflow-hidden">
  <div className="max-w-md h-[110vh] mx-auto flex flex-col">

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
              ${!filterCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {Object.keys(emojiCategories).map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
                ${filterCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Card Stack */}
        <div className="relative flex-1 overflow-hidden">
          {filteredCards.map((card, index) => {
            const isVisible = index === currentIndex;
            const transform = isVisible ? `translateX(${offsetX}px)` : 
                            index < currentIndex ? 'translateX(-120%)' : 'translateX(120%)';
            
            return (
              <div
                key={card.id}
                className={`absolute w-full transition-transform duration-300 ease-out
                           ${isVisible ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}
                style={{ transform }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
              >
                <div className="bg-gray-900 rounded-lg shadow-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl text-white font-bold">{card.heading}</h2>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-50 h-90 mx-auto mb-4 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-[15rem]">{card.emoji}</span>

                  </div>
                  <p className="text-white mb-6">{card.description}</p>
                  {card.category && (
                    <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm text-white mb-4">
                      {card.category}
                    </span>
                    
                  )}
                  <p className='text-white'> one life, one cycle ,uncertainity in every moment, so dont die of ignorance, at least try, at least take the first step,rest will be non regretfull history </p>
                  {card.completedAt && (
                    <p className="text-sm text-white mb-4">
                      Completed: {new Date(card.completedAt).toLocaleDateString()}
                    </p>
                  )}
                 
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleTried(card.id)}
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        card.tried 
                          ? 'bg-green-500 text-white' 
                          : 'bg-black text-white'
                      }`}
                    >
                      {card.tried ? 'Tried' : ' Have you tried it mate ??'}
                    </button>
                    
                 
                  </div>
                </div>
         
              </div>
              
              
            );
            
          })}
               
       
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            className="p-2 text-gray-500"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {filteredCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => currentIndex < filteredCards.length - 1 && setCurrentIndex(currentIndex + 1)}
            className="p-2 text-gray-500"
            disabled={currentIndex === filteredCards.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
       

        {/* Add New Card Button */}
      
        <button
  onClick={() => setShowAddCard(true)}
  className="absolute bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg"
>
  <Plus className="w-6 h-6" />
</button>
        {/* Add Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Card</h3>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={newCard.heading}
                    onChange={(e) => setNewCard({...newCard, heading: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Card heading"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCard.description}
                    onChange={(e) => setNewCard({...newCard, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="Card description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCard.category}
                    onChange={(e) => setNewCard({...newCard, category: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    {Object.keys(emojiCategories).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Emoji
                  </label>
                  <div className="flex gap-2 mb-2">
                    {Object.keys(emojiCategories).map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm
                          ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={searchEmoji}
                      onChange={(e) => setSearchEmoji(e.target.value)}
                      className="w-full p-2 pl-8 border rounded-lg"
                      placeholder="Search emoji..."
                    />
                    <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-6 gap-2 h-40 overflow-y-auto border rounded-lg p-2">
                    {filteredEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-2xl p-2 rounded hover:bg-gray-100
                          ${selectedEmoji === emoji ? 'bg-blue-100' : ''}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 p-2 border rounded-lg text-center">
                    Selected: <span className="text-2xl">{selectedEmoji}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddCard}
                  disabled={!newCard.heading || !newCard.description}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  Save Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quote Modal */}
        {showQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Congratulations! 🎉</h3>
                <button
                  onClick={() => setShowQuote(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-4">
                <img
                  src={randomQuote().image}
                  alt="Stoic wisdom"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex items-start gap-2">
                <Quote className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-gray-700 mb-2">{randomQuote().text}</p>
                  <p className="text-sm text-gray-500">— {randomQuote().author}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h3 className="text-xl font-bold mb-4">Delete Card</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this card? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCard(cards[currentIndex].id)}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Reset Button */}
      <button
  onClick={() => {
    if (window.confirm('Are you sure you want to reset all cards? This cannot be undone.')) {
      clearStorageAndReset();
    }
  }}
  className="absolute bottom-6 left-6 bg-gray-500 text-white p-3 rounded-full shadow-lg hover:bg-gray-600"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
</button>
</div>
    </div>
    </Layout>
  );
};

export default SwipeableCards;