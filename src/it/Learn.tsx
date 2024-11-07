import React, { useState, useEffect } from 'react';

// Types
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastReviewed: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  timesReviewed: number;
}

interface FlashcardStats {
  totalCards: number;
  masteredCards: number;
  needsReview: number;
}

const FlashcardApp = () => {
  // State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '', category: '' });
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'lastReviewed' | 'difficulty' | 'category'>('lastReviewed');
  const [showForm, setShowForm] = useState(false);

  // Load flashcards from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      setFlashcards(JSON.parse(savedCards));
    }
  }, []);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  // Calculate stats
  const calculateStats = (): FlashcardStats => {
    return {
      totalCards: flashcards.length,
      masteredCards: flashcards.filter(card => card.timesReviewed >= 5 && card.difficulty === 'easy').length,
      needsReview: flashcards.filter(card => {
        const daysSinceReview = Math.floor((new Date().getTime() - new Date(card.lastReviewed).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceReview > 3;
      }).length
    };
  };

  // Add new flashcard
  const addFlashcard = () => {
    if (newCard.question && newCard.answer) {
      const card: Flashcard = {
        id: Date.now().toString(),
        ...newCard,
        lastReviewed: new Date(),
        difficulty: 'medium',
        timesReviewed: 0
      };
      setFlashcards([...flashcards, card]);
      setNewCard({ question: '', answer: '', category: '' });
      setShowForm(false);
    }
  };

  // Delete flashcard
  const deleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  // Update difficulty
  const updateDifficulty = (id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    setFlashcards(flashcards.map(card => 
      card.id === id 
        ? { 
            ...card, 
            difficulty,
            timesReviewed: card.timesReviewed + 1,
            lastReviewed: new Date()
          }
        : card
    ));
  };

  // Filter and sort cards
  const filteredAndSortedCards = flashcards
    .filter(card => {
      if (filter === 'all') return true;
      if (filter === 'needsReview') {
        const daysSinceReview = Math.floor((new Date().getTime() - new Date(card.lastReviewed).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceReview > 3;
      }
      return card.difficulty === filter;
    })
    .filter(card => 
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'lastReviewed') {
        return new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime();
      }
      if (sortBy === 'difficulty') {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      }
      return a.category.localeCompare(b.category);
    });

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 Flashcards</h1>
        <div className="flex justify-center space-x-4 text-sm">
          <span className="bg-blue-100 px-3 py-1 rounded">📊 Total: {stats.totalCards}</span>
          <span className="bg-green-100 px-3 py-1 rounded">🌟 Mastered: {stats.masteredCards}</span>
          <span className="bg-yellow-100 px-3 py-1 rounded">⏰ Needs Review: {stats.needsReview}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ New Card
        </button>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">🔍 All Cards</option>
          <option value="easy">💚 Easy</option>
          <option value="medium">💛 Medium</option>
          <option value="hard">❤️ Hard</option>
          <option value="needsReview">⏰ Needs Review</option>
        </select>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="lastReviewed">⏱️ Sort by Last Reviewed</option>
          <option value="difficulty">📊 Sort by Difficulty</option>
          <option value="category">📑 Sort by Category</option>
        </select>
        <input
          type="search"
          placeholder="🔍 Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* New Card Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Question"
              value={newCard.question}
              onChange={(e) => setNewCard({...newCard, question: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Answer"
              value={newCard.answer}
              onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={newCard.category}
              onChange={(e) => setNewCard({...newCard, category: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
            <button 
              onClick={addFlashcard}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              ✅ Add Card
            </button>
          </div>
        </div>
      )}

      {/* Flashcard Display */}
      {filteredAndSortedCards.length > 0 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div 
              className="bg-white rounded-lg shadow-lg p-8 cursor-pointer transform transition hover:scale-105"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {filteredAndSortedCards[currentCard].category} • Card {currentCard + 1}/{filteredAndSortedCards.length}
                </span>
                <span className="text-sm text-gray-500">
                  {filteredAndSortedCards[currentCard].difficulty === 'easy' ? '💚' : 
                   filteredAndSortedCards[currentCard].difficulty === 'medium' ? '💛' : '❤️'}
                </span>
              </div>
              
              <div className="min-h-[200px] flex items-center justify-center text-xl">
                {showAnswer ? 
                  <p className="text-blue-600">💡 {filteredAndSortedCards[currentCard].answer}</p> :
                  <p className="text-gray-800">❓ {filteredAndSortedCards[currentCard].question}</p>
                }
              </div>

              {showAnswer && (
                <div className="mt-6 flex justify-center space-x-4">
                  <button 
                    onClick={() => updateDifficulty(filteredAndSortedCards[currentCard].id, 'easy')}
                    className="bg-green-100 px-4 py-2 rounded hover:bg-green-200"
                  >
                    💚 Easy
                  </button>
                  <button 
                    onClick={() => updateDifficulty(filteredAndSortedCards[currentCard].id, 'medium')}
                    className="bg-yellow-100 px-4 py-2 rounded hover:bg-yellow-200"
                  >
                    💛 Medium
                  </button>
                  <button 
                    onClick={() => updateDifficulty(filteredAndSortedCards[currentCard].id, 'hard')}
                    className="bg-red-100 px-4 py-2 rounded hover:bg-red-200"
                  >
                    ❤️ Hard
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button 
                onClick={() => {
                  setShowAnswer(false);
                  setCurrentCard(prev => (prev === 0 ? filteredAndSortedCards.length - 1 : prev - 1));
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                disabled={currentCard === 0}
              >
                ⬅️ Previous
              </button>
              <button 
                onClick={() => deleteFlashcard(filteredAndSortedCards[currentCard].id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🗑️ Delete
              </button>
              <button 
                onClick={() => {
                  setShowAnswer(false);
                  setCurrentCard(prev => (prev === filteredAndSortedCards.length - 1 ? 0 : prev + 1));
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                disabled={currentCard === filteredAndSortedCards.length - 1}
              >
                Next ➡️
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No flashcards found. Create your first one! 📝
        </div>
      )}
    </div>
  );
};

export default FlashcardApp;