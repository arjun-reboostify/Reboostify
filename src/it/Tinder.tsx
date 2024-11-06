import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Link } from 'react-router-dom';
// Image imports
import profile1 from './img/yellow bikini.jpeg';
import profile2 from './music/espresso.jpg';
import { Layout } from '../components/layout/Layout/Layout';
import profile3 from './music/espresso.jpg';

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  distance: number;
  image: string;
}

const TinderClone = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [dislikedProfiles, setDislikedProfiles] = useState<number[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  const profiles: Profile[] = [
    {
      id: 1,
      name: "Alex",
      age: 28,
      bio: "Adventure seeker. Coffee enthusiast. Dog lover 🐕",
      distance: 3,
      image: profile1,
    },
    {
      id: 2,
      name: "Jordan",
      age: 25,
      bio: "Photographer 📸 | Traveler ✈️ | Foodie 🍜",
      distance: 5,
      image: profile2,
    },
    {
      id: 3,
      name: "Sam",
      age: 30,
      bio: "Tech geek by day, musician by night 🎸",
      distance: 2,
      image: profile3,
    },
  ];

  useEffect(() => {
    // Create a scrolling effect that continuously scrolls down
    const scrollInterval = setInterval(() => {
      window.scrollBy(0, 1); // Scroll down by 1 pixel
    }, 10); // Every 10 milliseconds

    // Clear the interval when component unmounts
    return () => clearInterval(scrollInterval);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(null); // reset the emoji indicator
    if (direction === 'right') {
      setLikedProfiles([...likedProfiles, profiles[currentIndex].id]);
    } else {
      setDislikedProfiles([...dislikedProfiles, profiles[currentIndex].id]);
    }
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <Layout title='Tinder'>
      <div className="w-full h-screen max-w-md relative flex-grow">
        {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
          <Draggable
            key={profile.id}
            axis="x"
            onDrag={(e, data) => {
              if (data.x > 50) setSwipeDirection('right');
              else if (data.x < -50) setSwipeDirection('left');
              else setSwipeDirection(null);
            }}
            onStop={(e, data) => {
              if (data.x > 100) handleSwipe('right');
              else if (data.x < -100) handleSwipe('left');
              else setSwipeDirection(null);
            }}
          >
            <div
              className={`absolute inset-0 p-4 transition-transform duration-300 ${
                index === 0 ? "z-20" : "z-10"
              }`}
              style={{
                transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
              }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full w-full">
                <div className="relative h-full w-full">
                  <img
                    src={profile.image}
                    alt={`${profile.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <h2 className="text-2xl font-bold">
                      {profile.name}, {profile.age}
                    </h2>
                    <p className="text-sm mb-2">{profile.distance} miles away</p>
                    <p>{profile.bio}</p>
                    <p>Available 🟢</p>
                    <p>Swipe left or right for next match</p>
                  </div>
                  {swipeDirection === 'right' && (
                    <div className="absolute top-4 left-4 text-5xl">❤️</div>
                  )}
                  {swipeDirection === 'left' && (
                    <div className="absolute top-4 right-4 text-5xl">❌</div>
                  )}
                </div>
              </div>
            </div>
          </Draggable>
        ))}
        <div className="mt-8">
          <p className="text-center text-gray-600">
            Liked: {likedProfiles.length} | Passed: {dislikedProfiles.length}
          </p>
          <h1 className="text-center text-gray-600">workhard please</h1>
        </div>
      </div>
      <div>
        <Link to='/Make' className="font-bold text-white border-2 border-blue-500 bg-transparent hover:bg-blue-600 px-4 py-2 rounded inline-block">
          Tap here to send her message anonymously
        </Link>
      </div>
    </Layout>
  );
};

export default TinderClone;
