import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface SentenceScore {
  text: string;
  score: number;
}

const SmartChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // List of common words to ignore
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
    'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
    'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
    'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'into', 'your', 'some', 'could',
    'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
    'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
    'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'is', 'am', 'are', 'was', 'were', 'been'
  ]);

  // Database of response sentences
  const responseDatabase = [
    "Python programming language offers great data analysis capabilities.",
    "JavaScript frameworks enable interactive web development.",
    "Machine learning algorithms require substantial computing power.",
    "Database optimization improves application performance significantly.",
    "Cloud computing platforms provide scalable infrastructure solutions.",
    "Software testing ensures reliable code deployment.",
    "Version control systems help manage code changes effectively.",
    "API integration connects different software systems seamlessly.",
    "Mobile app development requires platform-specific knowledge.",
    "Artificial intelligence models process large datasets efficiently."
  ];

  const extractMeaningfulWords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[.,!?]/g, '') // Remove punctuation
      .split(' ')
      .filter(word => 
        word.length > 2 && // Ignore very short words
        !stopWords.has(word) && // Ignore common stop words
        !/^\d+$/.test(word) // Ignore numbers
      );
  };

  const findBestMatches = (userInput: string): string[] => {
    const userWords = extractMeaningfulWords(userInput);
    
    if (userWords.length === 0) {
      return ["Could you please provide more specific terms about what you'd like to discuss?"];
    }

    const scoredResponses: SentenceScore[] = responseDatabase.map(response => {
      const responseWords = extractMeaningfulWords(response);
      let matchScore = 0;
      let matchedWords = new Set<string>();
      
      // Score based on matching meaningful words
      userWords.forEach(userWord => {
        responseWords.forEach(responseWord => {
          if (
            (responseWord.includes(userWord) || userWord.includes(responseWord)) &&
            !matchedWords.has(responseWord)
          ) {
            matchScore++;
            matchedWords.add(responseWord);
          }
        });
      });

      return {
        text: response,
        score: matchScore
      };
    });

    // Sort by score in descending order
    scoredResponses.sort((a, b) => b.score - a.score);

    // If no good matches found
    if (scoredResponses[0].score === 0) {
      return ["I don't have enough information about that topic. Could you try different terms?"];
    }

    // Get the highest score
    const highestScore = scoredResponses[0].score;

    // Return all responses that have the highest score
    const bestMatches = scoredResponses
      .filter(response => response.score === highestScore)
      .map(response => response.text);

    return bestMatches;
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };

    const botResponses = findBestMatches(input);
    const newMessages: Message[] = [userMessage];

    botResponses.forEach((response, index) => {
      newMessages.push({
        id: Date.now() + index + 1,
        text: response,
        isUser: false,
      });
    });

    setMessages(prev => [...prev, ...newMessages]);
    setInput('');
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        text: "Hi! I'm focused on technical topics. Try asking about programming, databases, or technology!",
        isUser: false,
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-[9999]"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-black rounded-lg shadow-xl z-[9999]">
          <div className="h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 p-3 rounded-lg max-w-[85%] ${message.isUser ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  {message.text}
                  {!message.isUser && messages.filter(m => !m.isUser).length > 1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Match {messages.filter(m => !m.isUser).indexOf(message) + 1}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartChatBot;
