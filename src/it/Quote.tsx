import React, { useState } from 'react';
import soundFile from './click.mp3'; // Import the MP3 file for quote
import { Layout } from '../components/layout/Layout/Layout'

const QuoteBox = () => {
  const quotes = [
    "Mind is above all , Mind is everything, it interprets this immediate reality too ,it can also think the non existent",
    "It is not the man who has too little, but the man who craves more, that is poor",
    "The best revenge is to be unlike him who performed the injury",
    // Add more quotes as needed
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const showNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    const quoteAudio = new Audio(soundFile);
    quoteAudio.play();
  };

  return (
    <Layout title='Quote'>
   
      <p className="text-white mb-4 text-[5rem]">{quotes[currentQuoteIndex]}</p>

        <button
          className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={showNextQuote}
        >
          Show Next Quote
        </button>
      
    
    </Layout>
  );
};

export default QuoteBox;
