import ArticlesPage from "@/components/BlogCard/ArticlesPage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase"; // Import your Firestore config

const fetchArticles = async () => {
  const articles = [];
  try {
    const articlesCollection = collection(db, "blogs");
    const articleDocs = await getDocs(articlesCollection);
    articleDocs.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        author: data.author,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt ? data.createdAt.seconds * 1000 : null,
      });
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
  return articles;
};

// Use `generateMetadata` for SEO
export const metadata = {
  title: "RightHome Articles",
  description: "Explore a collection of insightful articles on various topics.",
};

// Use the new approach for SSG
const Page = async () => {
  const articles = await fetchArticles(); // Fetch articles

  return (
    <div>
      <ArticlesPage articles={articles} />
    </div>
  );
};

export default Page;
