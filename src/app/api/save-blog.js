// pages/api/save-blog.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const blogData = req.body;

    // Define the path for the data.json file
    const filePath = path.join(process.cwd(), "data.json");

    // Read existing data
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath);
      existingData = JSON.parse(jsonData);
    }

    // Append new blog data
    existingData.push(blogData);

    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ message: "Blog data saved successfully!" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
