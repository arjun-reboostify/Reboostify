import React, { useState, useEffect, useRef } from "react";
import { Layout } from '../components/layout/Layout/Layout';
import { db } from "../contexts/config";
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Link, Trash2, Globe, ExternalLink, Search } from 'lucide-react';

interface UrlEntry {
    id: string;
    data: {
        url: string;
        timestamp: Date;
    };
}

const UrlCollector: React.FC = () => {
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [input, setInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const urlEndRef = useRef<HTMLDivElement | null>(null);

    // Initialize Firestore subscriptions
    useEffect(() => {
        const q = query(collection(db, "urls"), orderBy("timestamp", "desc")); // Changed to desc
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUrls(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: {
                        url: doc.data().url,
                        timestamp: doc.data().timestamp.toDate(),
                    }
                }))
            );
        });
        return () => unsubscribe();
    }, []);

    // Auto-scroll to the bottom when a new URL is added
    useEffect(() => {
        if (urlEndRef.current && isAdding) {
            urlEndRef.current.scrollIntoView({ behavior: "smooth" });
            setIsAdding(false);
        }
    }, [urls, isAdding]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const addUrl = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            setIsAdding(true);
            const formattedUrl = input.startsWith("http://") || input.startsWith("https://")
                ? input
                : `https://${input}`;

            await addDoc(collection(db, "urls"), {
                url: formattedUrl,
                timestamp: new Date(),
            });
            setInput("");
        }
    };

    const deleteUrl = async (id: string) => {
        const urlDoc = doc(db, "urls", id);
        await deleteDoc(urlDoc);
    };

    const filteredUrls = urls.filter(url => 
        url.data.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDomainFromUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url;
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Layout title='URL Collector'>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-8">
                        <Globe className="w-8 h-8 text-green-500" />
                        <h1 className="text-white text-2xl sm:text-3xl font-bold">URL Collector</h1>
                    </div>

                    {/* Add URL Form */}
                    <form onSubmit={addUrl} className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-grow relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Enter website URL..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <span>Add URL</span>
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search URLs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* URL List */}
                    <div className="space-y-4 overflow-y-auto">
                        {filteredUrls.map(({ id, data }) => (
                            <div 
                                key={id} 
                                className="group p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-grow">
                                        <div className="flex items-center space-x-2">
                                            <img 
                                                src={`https://www.google.com/s2/favicons?domain=${getDomainFromUrl(data.url)}`}
                                                alt="favicon"
                                                className="w-4 h-4"
                                            />
                                            <a
                                                href={data.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-500 hover:text-green-400 font-medium truncate"
                                            >
                                                {getDomainFromUrl(data.url)}
                                            </a>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Added on {formatDate(data.timestamp)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteUrl(id)}
                                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        aria-label="Delete URL"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div ref={urlEndRef} />
                    </div>

                    {/* Empty State */}
                    {filteredUrls.length === 0 && (
                        <div className="text-center py-12">
                            <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">
                                {searchTerm ? "No URLs found matching your search" : "Start adding URLs to your collection"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default UrlCollector;