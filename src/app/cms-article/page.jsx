"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const CMSPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const blogsCollection = collection(db, "blogs");
      const blogsSnapshot = await getDocs(blogsCollection);
      const blogsData = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        alert("Blog deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog:", error.message);
        alert("Error deleting blog. Please try again.");
      }
    }
  };

  // Render loading state
  if (loading) {
    return <div className="text-center">Loading blogs...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">CMS - Manage Blogs</h1>

      {/* Blog Table */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-b">
              {/* Blog Title */}
              <td className="py-2 px-4">{blog.title}</td>

              {/* Actions */}
              <td className="py-2 px-4 flex gap-2">
                {/* View Button */}
                <button
                  onClick={() => router.push(`/article/${blog.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => router.push(`/edit-article/${blog.id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CMSPage;
