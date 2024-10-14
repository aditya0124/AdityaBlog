// app/components/CategoryRail.jsx
"use client";

import Link from "next/link";

const categories = [
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

// const CategoryRail = () => {
//   return (
//     <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-100 rounded-lg">
//       {categories.map((category) => (
//         <Link
//           key={category}
//           href={`/category/${category}`}
//           className="text-blue-600 hover:underline"
//         >
//           <div className="p-2 bg-white rounded-md shadow hover:bg-blue-50">
//             {category}
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

/*const CategoryRail = () => {
  return (
    <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-200 rounded-lg scrollbar-thin scrollbar-thumb-gray-400">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/category/${category}`}
          className="flex-shrink-0"
        >
          <div className="p-3 bg-gray-100 rounded-md shadow hover:bg-gray-300 transition-colors duration-200">
            {category}
          </div>
        </Link>
      ))}
    </div>
  );
};*/

const CategoryRail = () => {
  return (
    <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-200 rounded-lg my-4 scrollbar-hidden">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/category/${category}`}
          className="flex-shrink-0"
        >
          <div className="p-3 bg-white rounded-md shadow-md hover:bg-gray-300 transition-colors duration-200">
            {category}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryRail;
