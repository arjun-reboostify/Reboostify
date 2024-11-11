import { useState } from 'react';
//styles
import styles from './Home.module.scss'
//components
import { Login } from './Login'
import { Register } from './Register'

import Hope from '../../it/hope'
import Ch from '../../it/chance'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleAuthorize} from '../../contexts/config';
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";




export const Home = () => {
  const navigate = useNavigate();
    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isBlogOpen, setIsBlogOpen] = useState(false);
    const [user, loading] = useAuthState(auth)
    const [isBlgOpen, setIsBlgOpen] = useState(false);
    useEffect(() => {
      if (loading) return;
      if (user) {
          navigate("/");  // First, navigate to the desired route
          window.location.reload();  // Then, reload the page
      }
  }, [user, loading]);
  
  

    const handleClosingForms = () => {
        setIsSignupOpen(false)
        setIsLoginOpen(false)
        setIsBlogOpen(false)
        setIsBlgOpen(false)
    }
    const features = [
        {
          emoji: "🚀",
          title: "Lightning Fast",
          description: "Optimized performance that loads in milliseconds"
        },
        {
          emoji: "🛡️",
          title: "Enterprise Security",
          description: "Bank-grade encryption and security protocols"
        },
        {
          emoji: "🎨",
          title: "Beautiful Design",
          description: "Modern, clean interfaces that delight users"
        },
        {
          emoji: "🔄",
          title: "Seamless Integration",
          description: "Works with your existing tools and workflows"
        },
        {
          emoji: "📱",
          title: "Mobile First",
          description: "Responsive design that works on all devices"
        },
        {
          emoji: "🤝",
          title: "24/7 Support",
          description: "Round-the-clock expert assistance"
        }
      ];

    return (
        <div className={styles.container}>
            <section>
                <h1>Task<br />Manager</h1>
                {!isSignupOpen && !isLoginOpen && <>
                    <p>
                        <span className={styles.subtitle}>Track your tasks and progress towards your goals.</span>
                        Manage your tasks in a to-do list
                    </p>
                    <button className={styles.signupBtn} onClick={() => { setIsSignupOpen(true); setIsBlogOpen(true); }}>Sign Up</button>
                    <button className={styles.loginBtn} onClick={() => { setIsLoginOpen(true); setIsBlgOpen(true); }}>Log In</button>
                    <button
                    type="button"
                    className="bg-b-tertiary text-black drop-shadow-md py-2 rounded-md flex flex-row justify-center items-center"
                    onClick={() => googleAuthorize()}
                >
                    
                    <p>Register with Google</p>
                </button>
                </>}
                {isSignupOpen &&
                    <Register handleClosingForms={handleClosingForms} />
                }
                {isLoginOpen &&
                    <Login handleClosingForms={handleClosingForms} />
                }
                {isBlogOpen && <Hope />}
                {isBlgOpen && <Ch />}
                
            </section >
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us? 🤔
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started? 🚀
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who have transformed their workflow
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
              Try it Free 🎉
            </button>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              Contact Sales 💬
            </button>
          </div>
        </div>
      </section>
    </div>
        </div >
        
    );
}