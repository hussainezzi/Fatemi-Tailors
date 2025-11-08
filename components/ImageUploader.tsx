
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imagePreviewUrl ? (
        <div className="w-full h-full relative group">
          <img src={imagePreviewUrl} alt="User upload preview" className="w-full h-full object-contain rounded-md" />
          <button
            onClick={handleClick}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
          >
            Change Photo
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-gray-600 font-semibold">Upload Your Photo</span>
          <span className="text-sm text-gray-500 mt-1">PNG, JPG, or WEBP</span>
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
