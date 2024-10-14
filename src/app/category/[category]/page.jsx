// // app/pages/category/[category].jsx
// "use client";
// import { useParams } from "next/navigation";

// const CategoryPage = () => {
//   const params = useParams();
//   const { category } = params.category;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">{category} Articles</h1>
//       {/* Here you can fetch and display articles related to the category */}
//       <p>Articles related to {category} will be displayed here.</p>
//     </div>
//   );
// };

// export default CategoryPage;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { db } from "@/utils/firebase"; // Import your Firestore config
// import { collection, getDocs, query, where } from "firebase/firestore";
// import Image from "next/image";
// import Link from "next/link";

// const CategoryPage = () => {
//   const { category } = useParams(); // Directly destructure category from params

//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchArticlesByCategory = async () => {
//     try {
//       const articlesCollection = collection(db, "blogs");
//       const q = query(
//         articlesCollection,
//         where("categories", "array-contains", category)
//       );
//       const articleDocs = await getDocs(q);
//       const articlesData = articleDocs.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setArticles(articlesData);
//     } catch (error) {
//       console.error("Error fetching articles:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchArticlesByCategory();
//   }, [category]);

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">{category} Articles</h1>
//       {loading ? (
//         <p>Loading articles...</p>
//       ) : articles.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
//           {articles.map((article) => (
//             <Link key={article.id} href={`/article/${article.id}`}>
//               <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-50 transition duration-200 cursor-pointer flex flex-col h-full">
//                 <div className="relative w-full h-48 overflow-hidden">
//                   <Image
//                     src={
//                       article.featureImage ||
//                       "https://via.placeholder.com/400x300"
//                     }
//                     alt={`Blog Image ${article.id}`}
//                     layout="fill"
//                     objectFit="cover"
//                     className="rounded-t-lg"
//                   />
//                 </div>
//                 <div className="mt-4 flex-grow">
//                   <p className="text-sm text-gray-500">@{article.author}</p>
//                   <p className="mt-2 text-lg font-semibold">{article.title}</p>
//                   <p className="mt-2 text-gray-700">{article.excerpt}</p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         <p>No articles found in this category.</p>
//       )}
//     </div>
//   );
// };

// export default CategoryPage;
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Decoding the % when we have space
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/firebase"; // Import your Firestore config
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

const CategoryPage = () => {
  const { category } = useParams(); // Get category from params

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticlesByCategory = async () => {
    try {
      const articlesCollection = collection(db, "blogs");
      const q = query(
        articlesCollection,
        where("categories", "array-contains", decodeURIComponent(category))
      ); // Decode the category
      const articleDocs = await getDocs(q);
      const articlesData = articleDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(articlesData);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticlesByCategory();
  }, [category]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        {decodeURIComponent(category)} Articles
      </h1>
      {loading ? (
        <p>Loading articles...</p>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-50 transition duration-200 cursor-pointer flex flex-col h-full">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={
                      article.featureImage ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={`Blog Image ${article.id}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="mt-4 flex-grow">
                  <p className="text-sm text-gray-500">@{article.author}</p>
                  <p className="mt-2 text-lg font-semibold">{article.title}</p>
                  <p className="mt-2 text-gray-700">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No articles found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
