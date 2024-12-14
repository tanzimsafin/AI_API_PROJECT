import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Chat from './Chat';
const NewsBlog = () => {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const fetchNews = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://eodhd.com/api/news?s=AAPL.US&offset=${page * 10}&limit=10&api_token=6759801b8958c6.45217070&fmt=json`
            );
            setNews((prevNews) => [...prevNews, ...response.data]);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNews(page);
    }, [page]);

    const lastNewsElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    return (
        
        <div className="bg-gray-900 text-white p-6 min-h-screen">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center text-green-600">Latest News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article, index) => (
                    <div
                        key={index}
                        ref={index === news.length - 1 ? lastNewsElementRef : null}
                        className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold mb-2 text-green-600">{article.title}</h2>
                        <p className="text-gray-400 mb-2">{new Date(article.date).toLocaleDateString()}</p>
                        <p className="mb-4">{article.content}</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            Read more
                        </a>
                    </div>
                ))}
            </div>
            {loading && <p className="text-center mt-4">Loading...</p>}
            <Chat />
        </div>
    );
};

export default NewsBlog;
