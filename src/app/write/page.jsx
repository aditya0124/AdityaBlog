"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { db, storage } from "@/utils/firebase"; // Ensure correct path
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import ImageUpload from "@/components/ImageUpload"; // Your ImageUpload component

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// Import Jodit CSS
import "jodit/es2015/jodit.min.css"; // Import Jodit CSS

export default function WriteBlog() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [featureImage, setFeatureImage] = useState(null);
  const [content, setContent] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);
  // categories Section
  const [categories, setCategories] = useState([]);
  const availableCategories = [
    "Buying Guides",
    "Market Trends",
    "Property Investment",
    "Home Valuation",
    "Renting Tips",
    "Neighborhood Insights",
    "Mortgage & Finance",
    "Real Estate News",
    "Moving Tips",
    "Home Improvement",
    "Green Homes",
    "Tech in Real Estate",
  ];
  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  // category Faqs
  const handleCategoryChange = (category) => {
    setCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category) // Remove category if already selected
          : [...prev, category] // Add category if not selected
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     let featureImageUrl = "";

  //     // If there is a feature image, upload it
  //     if (featureImage) {
  //       const featureImageRef = ref(
  //         storage,
  //         `blogImages/${slug}/featureImage.jpg`
  //       );
  //       await uploadBytes(featureImageRef, featureImage);
  //       featureImageUrl = await getDownloadURL(featureImageRef);
  //     }

  //     const blogData = {
  //       title,
  //       slug,
  //       content,
  //       featureImage: featureImageUrl,
  //       faqs,
  //       categories, // Add selected categories
  //       createdAt: new Date().toISOString(),
  //     };

  //     await addDoc(collection(db, "blogs"), blogData);
  //     alert("Blog created successfully!");
  //   } catch (error) {
  //     console.error("Error saving blog:", error.message);
  //     alert("Error saving blog. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let featureImageUrl = "";

        // If there is a feature image, upload it
        if (featureImage) {
            const featureImageRef = ref(
                storage,
                `blogImages/${slug}/featureImage.jpg`
            );
            await uploadBytes(featureImageRef, featureImage);
            featureImageUrl = await getDownloadURL(featureImageRef);
        }

        // Calculate reading time
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const readingTime = Math.ceil(wordCount / 200); // assuming 200 words per minute

        // Extract keywords (basic example)
        const propertyKeywords = ["property", "real estate", "investment", "home", "market"];
        const generalKeywords = content.match(/\b\w+\b/g).filter(word => word.length > 3); // words longer than 3 characters
        const keywords = [...new Set([...generalKeywords, ...propertyKeywords])]; // combine and remove duplicates

        // Generate slug
        const slugFromTitle = title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        // Create excerpt (first 150 characters or the first two sentences)
        const ArticleExcerpt = content
            .substring(0, 150) // Get the first 150 characters
            .trim()
            .replace(/\s+/g, ' ') + '...'; // Add ellipsis

        const blogData = {
            title,
            slug: slugFromTitle,
            content,
            featureImage: featureImageUrl,
            faqs,
            categories,
            createdAt: new Date().toISOString(),
            readingTime, // Add reading time
            keywords, // Add extracted keywords
            ArticleExcerpt, // Add excerpt
        };

        await addDoc(collection(db, "blogs"), blogData);
        alert("Blog created successfully!");
    } catch (error) {
        console.error("Error saving blog:", error.message);
        alert("Error saving blog. Please try again.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Write a New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blog Title */}
        <div>
          <label className="block text-lg mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        {/* Blog Slug
        <div>
          <label className="block text-lg mb-2">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div> */}

        {/* Feature Image Upload */}
        <div>
          <label className="block text-lg mb-2">Feature Image</label>
          <ImageUpload setImage={setFeatureImage} />
        </div>

        {/* Blog Content */}
        <div>
          <label className="block text-lg mb-2">Content</label>
          <JoditEditor
            value={content}
            onChange={setContent}
            className="border rounded-md"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-lg mb-2">Categories</label>
          {availableCategories.map((category) => (
            <div key={category} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              <span>{category}</span>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div>
          <label className="block text-lg mb-2">FAQs</label>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={faq.question}
                onChange={(e) =>
                  handleFaqChange(index, "question", e.target.value)
                }
                placeholder="Question"
                className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="text"
                value={faq.answer}
                onChange={(e) =>
                  handleFaqChange(index, "answer", e.target.value)
                }
                placeholder="Answer"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFaq}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add FAQ
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Blog"}
        </button>
      </form>
    </div>
  );
}
