import { useState, useEffect, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Link, useNavigate } from 'react-router-dom';
// Image imports
import profile1 from './img/yellow bikini.jpeg';
import profile2 from './music/espresso.jpg';
import profile3 from './img/29644363.webp';
import { Layout } from '../components/layout/Layout/Layout';

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  distance: number;
  image: string;
  verified: boolean;
  interests: string[];
  instagram?: string;
  spotify?: {
    anthem: string;
    artist: string;
  };
  lastActive: string;
  prompts: {
    question: string;
    answer: string;
  }[];
}

// Custom Button Component
const CustomButton = ({ onClick, disabled, className, children }: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-full transition-all duration-200 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:brightness-90'
    } ${className}`}
  >
    {children}
  </button>
);

// Custom Badge Component
const CustomBadge = ({ children, color = 'bg-gray-200' }: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span className={`px-2 py-1 rounded-full text-sm ${color} text-white`}>
    {children}
  </span>
);

const SWIPE_THRESHOLD = 100;
const MAX_ROTATION = 15;

const TinderClone = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [dislikedProfiles, setDislikedProfiles] = useState<number[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [superLikes, setSuperLikes] = useState(1);
  const [rewinds, setRewinds] = useState(1);
  const [boosts, setBoosts] = useState(1);

  const profiles: Profile[] = useMemo(() => [
    {
      id: 1,
      name: "Alex",
      age: 28,
      bio: "Adventure seeker. Coffee enthusiast. Dog lover 🐕",
      distance: 3,
      image: profile1,
      verified: true,
      interests: ["Hiking", "Photography", "Coffee", "Dogs", "Travel"],
      instagram: "@alex_adventures",
      spotify: {
        anthem: "Sweet Child O' Mine",
        artist: "Guns N' Roses"
      },
      lastActive: "Just now",
      prompts: [
        {
          question: "A life goal of mine",
          answer: "Visit every national park in the US 🏞️"
        }
      ]
    },
    {
      id: 2,
      name: "Jordan",
      age: 25,
      bio: "Photographer 📸 | Traveler ✈️ | Foodie 🍜",
      distance: 5,
      image: profile2,
      verified: false,
      interests: ["Photography", "Travel", "Cooking", "Art", "Music"],
      lastActive: "2 hours ago",
      prompts: [
        {
          question: "My perfect Sunday",
          answer: "Brunch, photography walk, and jazz music 🎷"
        }
      ]
    },
    {
      id: 3,
      name: "Sam",
      age: 30,
      bio: "Tech geek by day, musician by night 🎸",
      distance: 2,
      image: profile3,
      verified: true,
      interests: ["Music", "Technology", "Gaming", "Coding", "Guitar"],
      lastActive: "3 hours ago",
      prompts: [
        {
          question: "What I'm looking for",
          answer: "Someone to jam with and share coding projects 💻"
        }
      ]
    },
    {
      id: 1,
      name: "Alex",
      age: 28,
      bio: "Adventure seeker. Coffee enthusiast. Dog lover 🐕",
      distance: 3,
      image: profile1,
      verified: true,
      interests: ["Hiking", "Photography", "Coffee", "Dogs", "Travel"],
      instagram: "@alex_adventures",
      spotify: {
        anthem: "Sweet Child O' Mine",
        artist: "Guns N' Roses"
      },
      lastActive: "Just now",
      prompts: [
        {
          question: "A life goal of mine",
          answer: "Visit every national park in the US 🏞️"
        }
      ]
    },
  ], []);

  useEffect(() => {
    const scrollLimit = window.innerHeight * 0.2;
    const scrollInterval = setInterval(() => {
      if (window.scrollY < scrollLimit) {
        window.scrollBy(0, 1);
      } else {
        clearInterval(scrollInterval);
      }
    }, 200);

    return () => clearInterval(scrollInterval);
  }, []);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    setSwipeDirection(direction);

    if (direction === 'right') {
      setLikedProfiles(prev => [...prev, profiles[currentIndex].id]);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } else if (direction === 'left') {
      setDislikedProfiles(prev => [...prev, profiles[currentIndex].id]);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } else if (direction === 'up' && superLikes > 0) {
      setSuperLikes(prev => prev - 1);
      setLikedProfiles(prev => [...prev, profiles[currentIndex].id]);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }

    setTimeout(() => setSwipeDirection(null), 200);
  }, [currentIndex, profiles, superLikes]);

  const handleUndo = useCallback(() => {
    if (currentIndex > 0 && rewinds > 0) {
      setCurrentIndex(prev => prev - 1);
      setRewinds(prev => prev - 1);
      const lastProfile = profiles[currentIndex - 1].id;
      setLikedProfiles(prev => prev.filter(id => id !== lastProfile));
      setDislikedProfiles(prev => prev.filter(id => id !== lastProfile));
    }
  }, [currentIndex, profiles, rewinds]);

  return (
    <Layout title='Tinder'>
      <div className="w-full h-screen max-w-md mx-auto relative">
        {/* Profile Cards */}
        <div className="h-[calc(100%-120px)] relative">
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
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
                        {profile.verified && (
                          <CustomBadge color="bg-blue-500">
                            🛡️ Verified
                          </CustomBadge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-2">{profile.distance} miles away</p>
                      
                      {!showDetails ? (
                        <button
                          className="mt-2 px-4 py-2 text-white rounded-lg hover:bg-white/20 transition-colors"
                          onClick={() => setShowDetails(true)}
                        >
                          Show more ⌄
                        </button>
                      ) : (
                        <div className="mt-4 space-y-4">
                          <p>{profile.bio}</p>
                          <div>
                            <h3 className="font-semibold mb-2">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map(interest => (
                                <CustomBadge key={interest} color="bg-white/20">
                                  {interest}
                                </CustomBadge>
                              ))}
                            </div>
                          </div>
                          {profile.spotify && (
                            <div className="flex items-center gap-2">
                              <CustomBadge color="bg-green-500">
                                🎵 Spotify Anthem
                              </CustomBadge>
                              <span>{profile.spotify.anthem} - {profile.spotify.artist}</span>
                            </div>
                          )}
                        </div>
                      )}
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
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
          <CustomButton
            onClick={handleUndo}
            disabled={currentIndex === 0 || rewinds === 0}
            className="w-12 h-12 bg-white shadow-lg"
          >
            ↩️
          </CustomButton>

          <CustomButton
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-white shadow-lg"
          >
            ❌
          </CustomButton>

          <CustomButton
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-white shadow-lg"
          >
            💚
          </CustomButton>

          <CustomButton
            onClick={() => navigate('/Chat')}
            className="w-12 h-12 bg-white shadow-lg"
          >
            💬
          </CustomButton>
        </div>

        {/* Stats Bar */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <CustomBadge color="bg-pink-500">
                  ⭐ Premium
                </CustomBadge>
                <span className="text-sm text-gray-600">
                  Super Likes: {superLikes} | Rewinds: {rewinds} | Boosts: {boosts}
                </span>
              </div>
              <span className="cursor-pointer">
                📤
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 transition-all duration-300" 
                style={{ width: '33%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TinderClone;