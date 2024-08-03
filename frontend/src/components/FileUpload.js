import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024 && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
      setFile(selectedFile);

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const fileUrl = response.data.fileUrl;
        setMessage(`File uploaded successfully: ${selectedFile.name}`);
        onFileUpload({ name: selectedFile.name, url: fileUrl });
      } catch (error) {
        setMessage('File upload failed');
      }
    } else {
      setMessage('Please select a JPG or PNG file under 10MB');
    }
  };

  return (
    <div className="relative">
      <label htmlFor="file-upload" className="cursor-pointer absolute right-8 top-1/2 transform -translate-y-1/2">
        📁
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png"
      />
    </div>
  );
};

export default FileUpload;
