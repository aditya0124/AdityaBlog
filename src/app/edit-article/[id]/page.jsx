/*
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { db, storage } from "@/utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ImageUpload from "@/components/ImageUpload"; // Your ImageUpload component

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// Import Jodit CSS
import "jodit/es2015/jodit.min.css";

export default function EditBlog() {
  const { slug } = useParams(); // Get the blog slug from the URL
  const [title, setTitle] = useState("");
  const [featureImage, setFeatureImage] = useState(null);
  const [content, setContent] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [categories, setCategories] = useState([]);
  const availableCategories = [
    "Tech",
    "Lifestyle",
    "Finance",
    "Travel",
    "Health",
  ];
  const [loading, setLoading] = useState(false);

  // Fetch existing blog data
  const fetchBlogData = async () => {
    try {
      const docRef = doc(db, "blogs", slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const blogData = docSnap.data();
        setTitle(blogData.title);
        setContent(blogData.content);
        setFeatureImage(blogData.featureImage);
        setFaqs(blogData.faqs || [{ question: "", answer: "" }]);
        setCategories(blogData.categories || []);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching blog:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleCategoryChange = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let featureImageUrl = featureImage;

      // If the user uploaded a new feature image, upload it
      if (featureImage instanceof File) {
        const featureImageRef = ref(
          storage,
          `blogImages/${slug}/featureImage.jpg`
        );
        await uploadBytes(featureImageRef, featureImage);
        featureImageUrl = await getDownloadURL(featureImageRef);
      }

      // Prepare the updated blog data
      const updatedBlogData = {
        title,
        content,
        featureImage: featureImageUrl,
        faqs,
        categories,
        updatedAt: new Date().toISOString(), // Add updated timestamp
      };

      // Update the blog document in Firestore
      const docRef = doc(db, "blogs", slug);
      await updateDoc(docRef, updatedBlogData);
      alert("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error.message);
      alert("Error updating blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blog Title }
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

        {/* Feature Image Upload }
        <div>
          <label className="block text-lg mb-2">Feature Image</label>
          <ImageUpload
            setImage={setFeatureImage}
            existingImage={featureImage}
          />
        </div>

        // {/* Blog Content }
        <div>
          <label className="block text-lg mb-2">Content</label>
          <JoditEditor
            value={content}
            onChange={setContent}
            className="border rounded-md"
          />
        </div>

        // {/* Categories }
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

        // {/* FAQs }
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

        // {/* Submit }
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}*/

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { db, storage } from "@/utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ImageUpload from "@/components/ImageUpload"; // Your ImageUpload component

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// Import Jodit CSS
import "jodit/es2015/jodit.min.css";

export default function EditBlog() {
  const { id } = useParams(); // Get the blog ID from the URL
  const [title, setTitle] = useState("");
  const [featureImage, setFeatureImage] = useState(null);
  const [content, setContent] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
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
  const [loading, setLoading] = useState(false);

  // Fetch existing blog data
  const fetchBlogData = async () => {
    try {
      const docRef = doc(db, "blogs", id); // Use ID to fetch the document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const blogData = docSnap.data();
        setTitle(blogData.title);
        setContent(blogData.content);
        setFeatureImage(blogData.featureImage);
        setFaqs(blogData.faqs || [{ question: "", answer: "" }]);
        setCategories(blogData.categories || []);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching blog:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]); // Fetch blog data whenever the ID changes

  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][key] = value;
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleCategoryChange = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let featureImageUrl = featureImage;

      // If the user uploaded a new feature image, upload it
      if (featureImage instanceof File) {
        const featureImageRef = ref(
          storage,
          `blogImages/${id}/featureImage.jpg`
        );
        await uploadBytes(featureImageRef, featureImage);
        featureImageUrl = await getDownloadURL(featureImageRef);
      }

      // Prepare the updated blog data
      const updatedBlogData = {
        title,
        content,
        featureImage: featureImageUrl,
        faqs,
        categories,
        updatedAt: new Date().toISOString(), // Add updated timestamp
      };

      // Update the blog document in Firestore
      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, updatedBlogData);
      alert("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error.message);
      alert("Error updating blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
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

        {/* Feature Image Upload */}
        <div>
          <label className="block text-lg mb-2">Feature Image</label>
          <ImageUpload
            setImage={setFeatureImage}
            existingImage={featureImage}
          />
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
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
