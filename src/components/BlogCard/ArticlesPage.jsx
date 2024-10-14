"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/utils/firebase"; // Import your Firestore config
import { collection, getDocs } from "firebase/firestore";
import CategoryRail from "../CategoryRail/CategoryRail";

const ArticlesPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6); // Start with 6
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleScroll = () => {
    const heroHeight = window.innerHeight;
    setIsScrolled(window.scrollY > heroHeight);
  };

  const loadMore = () => {
    const newCount = Math.min(articles.length, visibleCount + 3); // Load 3 more or remaining cards
    setVisibleCount(newCount);
  };

  const fetchArticles = async () => {
    try {
      const articlesCollection = collection(db, "blogs");
      const articleDocs = await getDocs(articlesCollection);
      const articlesData = articleDocs.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Untitled",
          author: data.author || "RightHomeAI",
          content: data.content || "",
          featureImage: data.featureImage || null,
          createdAt: data.createdAt || null,
          categories: data.categories || [], // Make sure categories are included
        };
      });

      const articlesWithExcerpt = articlesData.map((article) => ({
        ...article,
        excerpt: extractExcerpt(article.content),
        imageUrl: article.featureImage || "https://via.placeholder.com/400x300",
      }));

      setArticles(articlesWithExcerpt);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractExcerpt = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const paragraphs = doc.querySelectorAll("p");
    let excerpt = "";

    for (let p of paragraphs) {
      const text = p.innerText.trim();
      if (text.length > 0) {
        excerpt += text + " ";
        if (excerpt.length >= 70) break; // Limit to 70 characters
      }
    }

    return excerpt.length > 70
      ? excerpt.slice(0, 70).trim() + "..."
      : excerpt || "Lorem ipsum dolor sit amet.";
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    fetchArticles();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center p-4 transition duration-300 ${
          isScrolled ? "bg-white" : "bg-transparent"
        } z-10`}
      >
        <div className="text-lg font-bold">LOG</div>
        <Link href="/article/all-article">
          <button className="ml-4 border border-black px-4 py-2">LOGIN</button>
        </Link>
      </header>

      <div className="relative h-screen flex flex-col justify-center items-start p-8 text-white">
        <Image
          src="/images/pngtree-building-city-illustration-with-sunsets-scenery-picture-image_1491622.png"
          alt="Cartoon City"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">WELCOME TO</h1>
          <h2 className="text-4xl font-extrabold mt-2">RIGHTHOME ARTICLES</h2>
          <p className="mt-4 text-lg max-w-md">
            Introducing a new era of knowledge collection and curation. There is
            always more to learn: get started today.
          </p>
        </div>
      </div>

      <CategoryRail />

      {/* Blog Cards Section */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 h-48 rounded-lg animate-pulse" // Restored height
              ></div>
            ))
          : articles.slice(0, visibleCount).map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-50 transition duration-200 cursor-pointer flex flex-col h-full">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={`Blog Image ${article.id}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="mt-4 flex-grow">
                    <p className="text-sm text-gray-500">@{article.author}</p>
                    <p className="mt-2 text-lg font-semibold">
                      {article.title}
                    </p>
                    <p className="mt-2 text-gray-700">{article.excerpt}</p>
                  </div>
                  {/* Categories Section */}
                  {article.categories.length > 0 && (
                    <div className="mt-2 overflow-x-auto whitespace-nowrap scrollbar-hidden">
                      {article.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
      </div>

      {/* Load More Button */}
      {visibleCount < articles.length && !loading && (
        <div className="flex justify-center p-8">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
