import React, { useState, useEffect, useRef } from "react";
import { db } from "../contexts/config";
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query, setDoc } from "firebase/firestore";
import { Layout } from '../components/layout/Layout/Layout';
import { Smile } from 'lucide-react';

interface Message {
    id: string;
    data: {
        text: string;
        uid: string;
        displayName: string;
        timestamp: Date;
        reactions?: { [key: string]: string[] };
    };
}

interface TypingUser {
    uid: string;
    displayName: string;
    timestamp: number;
}

const Chat: React.FC = () => {
    const user = { uid: 'some-uid', displayName: 'Arjun' };
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout>();
    const chatEndRef = useRef<HTMLDivElement | null>(null);

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
                        timestamp: doc.data().timestamp.toDate(),
                        reactions: doc.data().reactions || {},
                    }
                }))
            );
        });

        const typingRef = collection(db, "typing");
        const typingUnsubscribe = onSnapshot(typingRef, (snapshot) => {
            const now = Date.now();
            const activeTypers = snapshot.docs
                .map(doc => ({ ...doc.data() as TypingUser, uid: doc.id }))
                .filter(typer => now - typer.timestamp < 3000 && typer.uid !== user.uid);
            setTypingUsers(activeTypers);
        });

        return () => {
            unsubscribe();
            typingUnsubscribe();
            // Cleanup typing status when component unmounts
            if (user.uid) {
                const typingDoc = doc(db, "typing", user.uid);
                deleteDoc(typingDoc).catch(() => {});
            }
        };
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        handleTypingIndicator();
    };

    const handleTypingIndicator = () => {
        if (!isTyping) {
            setIsTyping(true);
            updateTypingStatus(true);
        }

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
            updateTypingStatus(false);
        }, 2000);
    };

    const updateTypingStatus = async (typing: boolean) => {
        try {
            const typingRef = doc(db, "typing", user.uid);
            if (typing) {
                // Use setDoc instead of updateDoc to ensure the document exists
                await setDoc(typingRef, {
                    displayName: user.displayName,
                    timestamp: Date.now(),
                });
            } else {
                await deleteDoc(typingRef);
            }
        } catch (error) {
            console.error("Error updating typing status:", error);
        }
    };

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            try {
                await addDoc(collection(db, "messages"), {
                    text: input,
                    timestamp: new Date(),
                    uid: user.uid,
                    displayName: user.displayName,
                    reactions: {},
                });
                setInput("");
                updateTypingStatus(false);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const messageDoc = doc(db, "messages", id);
            await deleteDoc(messageDoc);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const addReaction = async (messageId: string, emoji: string) => {
        try {
            const messageRef = doc(db, "messages", messageId);
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            const reactions = message.data.reactions || {};
            const userReactions = reactions[emoji] || [];

            if (userReactions.includes(user.uid)) {
                // Remove reaction
                await setDoc(messageRef, {
                    ...message.data,
                    reactions: {
                        ...reactions,
                        [emoji]: userReactions.filter(uid => uid !== user.uid)
                    }
                }, { merge: true });
            } else {
                // Add reaction
                await setDoc(messageRef, {
                    ...message.data,
                    reactions: {
                        ...reactions,
                        [emoji]: [...userReactions, user.uid]
                    }
                }, { merge: true });
            }
            setShowEmojiPicker(null);
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    const getRandomColor = () => {
        const colors = ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const commonEmojis = ["👍", "❤️", "😄", "😮", "👏", "🎉"];

    return (
        <Layout title='Chat'>
            <h3 className="text-white font-semibold mb-4">Discussion/Hangout Room</h3>
            <main className="flex-grow overflow-y-auto mb-4" style={{ maxHeight: "60vh" }}>
                {user && (
                    <>
                        {messages.map(({ id, data }) => (
                            <div key={id} className={`mb-2 p-2 rounded-lg ${data.uid === user.uid ? "self-end" : "self-start"} ${getRandomColor()}`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">
                                        {data.displayName === user.displayName ? 'Anonymous' : data.displayName}:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowEmojiPicker(showEmojiPicker === id ? null : id)}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            <Smile className="w-4 h-4" />
                                        </button>
                                        {data.uid === user.uid && (
                                            <button
                                                onClick={() => deleteMessage(id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <span className="ml-2">{data.text}</span>
                                
                                {showEmojiPicker === id && (
                                    <div className="mt-2 flex gap-2">
                                        {commonEmojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => addReaction(id, emoji)}
                                                className="hover:scale-125 transition-transform"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {data.reactions && Object.entries(data.reactions).map(([emoji, uids]) => (
                                    uids.length > 0 && (
                                        <button
                                            key={emoji}
                                            onClick={() => addReaction(id, emoji)}
                                            className={`mr-1 px-2 py-1 text-sm rounded-full ${
                                                uids.includes(user.uid) ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}
                                        >
                                            {emoji} {uids.length}
                                        </button>
                                    )
                                ))}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </>
                )}
            </main>
            
            {typingUsers.length > 0 && (
                <div className="text-sm text-gray-500 italic mb-2">
                    {typingUsers.map(typer => typer.displayName).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                </div>
            )}
            
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