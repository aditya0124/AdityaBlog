import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/utils/firebase"; // Adjust the import path if necessary
import FullBlogPage from "@/components/FullBlog/FullBlogPage"; // Correct the import path

const BlogPage = async ({ params }) => {
  const blogSlug = params.slug;

  // Fetch blog data
  const docRef = doc(db, "blogs", blogSlug);
  const docSnap = await getDoc(docRef);
  const blogData = docSnap.exists() ? docSnap.data() : null;

  // Handle the case where no blog is found
  if (!blogData) {
    return <div>No blog found.</div>;
  }

  // Fetch all recommendations
  const recommendationsSnapshot = await getDocs(
    collection(db, "recommendations")
  );
  const allRecommendations = recommendationsSnapshot.docs.map((doc) =>
    doc.data()
  );

  // Shuffle recommendations and select 6 random ones
  const shuffledRecommendations = allRecommendations.sort(
    () => 0.5 - Math.random()
  );
  const recommendations = shuffledRecommendations.slice(0, 6);

  // Return the FullBlogPage component with blog data and recommendations
  return <FullBlogPage blogData={blogData} recommendations={recommendations} />;
};

// Generate static paths for SSG
export async function generateStaticParams() {
  const blogsSnapshot = await getDocs(collection(db, "blogs"));
  const blogs = blogsSnapshot.docs.map((doc) => ({
    slug: doc.id,
  }));

  // Return an array of paths for all blogs
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// Generate dynamic metadata for each blog
export async function generateMetadata({ params }) {
  const blogSlug = params.slug;

  // Fetch blog data for metadata
  const docRef = doc(db, "blogs", blogSlug);
  const docSnap = await getDoc(docRef);
  const blogData = docSnap.exists() ? docSnap.data() : null;

  if (blogData) {
    const keywords =
      blogData.keywords || "property, real estate, investment, home, market"; // Example keywords
    const description =
      blogData.ArticleExcerpt || blogData.content.slice(0, 150); // Use excerpt or first 150 characters of content

    return {
      title: `${blogData.title} | RightHomeAI Blog`,
      description: description,
      keywords: keywords,
      openGraph: {
        type: "article",
        url: `https://your-site.com/article/${blogSlug}`,
        title: blogData.title,
        description: description,
        site_name: "RightHomeAI Blog",
        images: [blogData.featureImage || "/default-image.jpg"],
      },
      twitter: {
        site: "@yourTwitterHandle",
        creator: "@yourTwitterHandle",
        title: blogData.title,
        description: description,
        card: "summary_large_image",
        images: [blogData.featureImage || "/default-image.jpg"],
      },
      "last-updated": new Date().toISOString(),
      robots: "max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      "theme-color": "#ffffff",
      viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
    };
  }

  // Fallback metadata in case blog data isn't found
  return {
    title: "Blog Not Found",
    description: "The requested blog could not be found.",
    openGraph: {
      type: "website",
      url: "https://your-site.com",
      title: "Blog Not Found",
      description: "The requested blog could not be found.",
      site_name: "RightHomeAI Blog",
      images: ["/default-image.jpg"], // Default image for fallback
    },
    twitter: {
      site: "@yourTwitterHandle",
      creator: "@yourTwitterHandle",
      title: "Blog Not Found",
      description: "The requested blog could not be found.",
      card: "summary_large_image",
      images: ["/default-image.jpg"],
    },
  };
}

export default BlogPage;
