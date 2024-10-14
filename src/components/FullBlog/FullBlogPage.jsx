"use client";

import { useEffect, useState, useRef } from "react";
import Head from "next/head";

const FullBlogPage = ({ blogData, recommendations }) => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isTocSticky, setIsTocSticky] = useState(false);
  const featureImageRef = useRef(null);
  const tocRef = useRef(null);

  const extractTOCAndModifyContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = Array.from(doc.querySelectorAll("h2, h3"));
    const tocItems = headings.map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.innerText,
        level: heading.tagName.toLowerCase(),
      };
    });
    return { tocItems, content: doc.body.innerHTML };
  };

  const { tocItems, content } = extractTOCAndModifyContent(blogData.content);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const featureImageHeight = featureImageRef.current?.clientHeight || 0;
      setIsTocSticky(scrollY > featureImageHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      {/* Dynamic Head Section */}
      <Head>
        <title>{blogData.title} | My Blog</title>
        <meta
          name="description"
          content={blogData.excerpt || blogData.content.slice(0, 150)}
        />
        <meta property="og:title" content={blogData.title} />
        <meta
          property="og:description"
          content={blogData.excerpt || blogData.content.slice(0, 150)}
        />
        <meta
          property="og:image"
          content={blogData.featureImage || "/default-image.jpg"}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://my-site.com/blog/${blogData.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogData.title} />
        <meta
          name="twitter:description"
          content={blogData.excerpt || blogData.content.slice(0, 150)}
        />
        <meta
          name="twitter:image"
          content={blogData.featureImage || "/default-image.jpg"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>

      {/* Feature Image Section */}
      <div ref={featureImageRef} className="feature-image mb-6">
        <img
          src={blogData.featureImage}
          alt="Feature Image"
          className="w-full h-[400px] object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="flex gap-8">
        {/* Main Content Section */}
        <div className="w-[80%] p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-5xl font-bold mb-4">{blogData.title}</h1>
          <div className="text-gray-600 mb-4">
            <span>
              By <strong>{blogData.author || "RightHomeAI"}</strong>
            </span>{" "}
            |{" "}
            <span>
              Published on:{" "}
              <strong>
                {new Date(blogData.createdAt).toLocaleDateString()}
              </strong>
            </span>{" "}
            |{" "}
            <span>
              Read time: <strong>{blogData.readingTime || "2 "} min</strong>
            </span>
          </div>

          {/* Blog Content */}
          <div
            className="text-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* FAQ Section */}
          {blogData.faqs && blogData.faqs.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-4">FAQs</h2>
              {blogData.faqs.map((faq, index) => (
                <div key={index} className="py-4 border-b border-gray-200">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <span className="text-2xl">
                      {openFAQ === index ? "-" : "+"}
                    </span>
                  </div>
                  {openFAQ === index && (
                    <div className="mt-2">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-4">FAQs</h2>
              <p className="text-gray-600">No FAQs available for this blog.</p>
            </div>
          )}
        </div>

        {/* Table of Contents Section */}
        <div className="toc-container w-1/3 p-4 transition-all duration-300">
          <div
            ref={tocRef}
            className={`transition-all duration-300 ${
              isTocSticky ? "sticky top-16" : ""
            }`}
            style={{
              height: tocItems.length ? "auto" : "0",
              overflow: tocItems.length ? "visible" : "hidden",
            }}
          >
            {tocItems.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Table of Contents
                </h2>
                <ul className="list-disc ml-4 space-y-2">
                  {tocItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={`#${item.id}`}
                        className={`text-blue-600 hover:underline ${
                          item.level === "h1" ? "font-bold" : ""
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section mt-6 p-4">
        <h2 className="text-2xl font-semibold mb-2">Recommended Blogs</h2>
        <div className="flex overflow-x-auto gap-5">
          {recommendations.map((blog) => (
            <div
              key={blog.id}
              className="border rounded-lg overflow-hidden w-[2.5cm] h-[2.5cm] flex flex-col items-center justify-center"
            >
              <a
                href={`/article/${blog.id}`}
                className="flex flex-col items-center"
              >
                <img
                  src={blog.featureImage}
                  alt={blog.title}
                  className="w-full h-[70%] object-cover"
                />
                <h3 className="text-sm font-bold text-center mt-1">
                  {blog.title.length > 6
                    ? blog.title.slice(0, 6) + "..."
                    : blog.title}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullBlogPage;
