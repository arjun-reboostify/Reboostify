import React, { useState, useEffect, useRef } from "react";
import { db } from "../contexts/config";
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Layout } from '../components/layout/Layout/Layout'

// Define the Message interface for the structure of each message
interface Message {
    id: string;
    data: {
        text: string;
        uid: string;
        displayName: string;
        timestamp: Date;
    };
}

const Chat: React.FC = () => {
    // Mock user object for testing
    const user = { uid: 'some-uid', displayName: 'Arjun' };
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Initialize Firestore subscriptions
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: {
                        text: doc.data().text,
                        uid: doc.data().uid,
                        displayName: doc.data().displayName,
                        timestamp: doc.data().timestamp.toDate(), // Convert to Date
                    }
                }))
            );
        });
        return () => unsubscribe();
    }, []);

    // Auto-scroll to the bottom when a new message is added
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Send a message to the Firestore
    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            await addDoc(collection(db, "messages"), {
                text: input,
                timestamp: new Date(),
                uid: user.uid,
                displayName: user.displayName,
            });
            setInput("");
        }
    };

    // Delete a message from Firestore
    const deleteMessage = async (id: string) => {
        const messageDoc = doc(db, "messages", id);
        await deleteDoc(messageDoc);
        // Remove the deleted message from the state
        setMessages(messages.filter((message) => message.id !== id));
    };

    // Generate a random color for the message background
    const getRandomColor = () => {
        const colors = ["bg-red-200", "bg-green-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Layout title='Chat'>
    
            
                <h3 className="text-white font-semibold mb-4">____Discussion/Hangout Room</h3>
                <main className="flex-grow overflow-y-auto mb-4" style={{ maxHeight: "60vh" }}>
                    {user && (
                        <>
                            {messages.map(({ id, data }) => (
                                <div
                                    key={id}
                                    className={`mb-2 p-2 rounded-lg ${data.uid === user.uid ? "self-end" : "self-start"} ${getRandomColor()}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">
                                            {data.displayName === user.displayName ? 'Anonymous' : data.displayName}:
                                        </span>
                                        {data.uid === user.uid && (
                                            <button
                                                onClick={() => deleteMessage(id)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <span className="ml-2">{data.text}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </>
                    )}
                </main>
                {user && (
                    <footer className="mt-4">
                        <form onSubmit={sendMessage} className="flex items-center">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                type="text"
                                className="flex-grow rounded-l-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Type your message..."
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-black px-4 py-2 rounded-r-lg hover:bg-green-600 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </footer>
                )}
           
            </Layout>
     
    );
}

export default Chat;
