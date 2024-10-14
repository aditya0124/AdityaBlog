
import React from "react";

const ImageUpload = ({ setImage }) => {
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]); // Set the first selected file
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="p-2 border rounded"
      required
    />
  );
};

export default ImageUpload;
