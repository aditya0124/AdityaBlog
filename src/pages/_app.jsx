// src/pages/_app.jsx

// import "../styles/globals.css"; // Importing global CSS styles

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />; // Render the current page component with its props
// }

// export default MyApp;
// +++++++++++++++++++++++++++++
import { BlogProvider } from "@/context/BlogContext";

function MyApp({ Component, pageProps }) {
  return (
    <BlogProvider>
      <Component {...pageProps} />
    </BlogProvider>
  );
}

export default MyApp;
