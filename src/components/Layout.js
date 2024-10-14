// components/Layout.js
import Head from "next/head";

const Layout = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{title || "My Blog"}</title>
        <meta
          name="description"
          content={description || "Default description for my blog"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default Layout;
