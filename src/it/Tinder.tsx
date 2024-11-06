import { useState } from 'react';

import Draggable from 'react-draggable';
// Image imports
import profile1 from './music/espresso.jpg';
import profile2 from './music/espresso.jpg';
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

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(null); // reset the emoji indicator
    if (direction === 'right') {
      setLikedProfiles([...likedProfiles, profiles[currentIndex].id]);
    } else {
      setDislikedProfiles([...dislikedProfiles, profiles[currentIndex].id]);
    }
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No more profiles!</h2>
          <p className="text-gray-600">Check back later for more matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-20 relative">
      <div className="w-full max-w-md relative flex-grow" style={{ height: '500px' }}>
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={profile.image}
                    alt={`${profile.name}'s profile`}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <h2 className="text-2xl font-bold">
                      {profile.name}, {profile.age}
                    </h2>
                    <p className="text-sm mb-2">{profile.distance} miles away</p>
                    <p>{profile.bio}</p>
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
        </div>
      </div>

    </div>
  );
};

export default TinderClone;
