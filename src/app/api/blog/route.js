import { db, storage } from "@/utils/firebase"; // Import Firebase configuration
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage methods
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import nextConnect from "next-connect";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory before uploading to Firebase
});

const apiRoute = nextConnect({
  onError: (err, req, res) => {
    res.status(501).json({ error: `Something went wrong! ${err.message}` });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("featureImage")); // Handle feature image upload

apiRoute.post(async (req, res) => {
  try {
    const { title, slug, content, faqs } = req.body;

    // Upload the feature image to Firebase Storage
    const featureImageRef = ref(storage, `blogImages/${slug}/featureImage.jpg`);
    const featureImageBuffer = req.file.buffer;

    // Upload the image to Firebase Storage and get the download URL
    await uploadBytes(featureImageRef, featureImageBuffer);
    const featureImageUrl = await getDownloadURL(featureImageRef);

    // Save blog content to Firestore
    const blogData = {
      title,
      slug,
      content,
      featureImage: featureImageUrl, // Store URL of the uploaded image
      faqs: JSON.parse(faqs), // Parse the FAQs from string to JSON
      createdAt: new Date().toISOString(),
    };

    const blogCollectionRef = collection(db, "blogs"); // Reference to Firestore collection
    await addDoc(blogCollectionRef, blogData); // Add the blog data to Firestore

    res.status(200).json({ message: "Blog created successfully!" });
  } catch (error) {
    res.status(500).json({ error: `Error saving blog: ${error.message}` });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Multer handles file upload, so disable bodyParser
  },
};
