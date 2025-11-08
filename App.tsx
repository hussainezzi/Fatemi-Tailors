import React, { useState, useCallback } from 'react';
import { CustomizationOptions } from './types';
import { COLLAR_DESIGNS, FITS, COLORS, FABRICS } from './constants';
import { generateTryOnImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import CustomizationForm from './components/CustomizationForm';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const initialOptions: CustomizationOptions = {
    fit: FITS[0],
    color: COLORS[0],
    fabric: FABRICS[0],
    collar: COLLAR_DESIGNS[0],
  };

  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>(initialOptions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setUserImageFile(file);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(URL.createObjectURL(file));
  }, [imagePreviewUrl]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/...;base64,
        resolve(result.split(',')[1]);
      };
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async () => {
    if (!userImageFile) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const base64Image = await fileToBase64(userImageFile);
      const generatedImageBase64 = await generateTryOnImage(base64Image, userImageFile.type, customizationOptions);
      setResultImageUrl(`data:image/png;base64,${generatedImageBase64}`);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "An unexpected error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setUserImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setCustomizationOptions(initialOptions);
    setIsLoading(false);
    setResultImageUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <img 
            src="https://res.cloudinary.com/de0cllasz/image/upload/v1762578517/361196398_295628872845003_5447401992509938827_n_u8iwan.jpg" 
            alt="Fatemi Tailors Logo"
            className="h-24 w-auto mx-auto mb-4 rounded-full"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">Fatemi Tailors</h1>
          <p className="mt-2 text-lg text-blue-600 font-semibold">Virtual Saya-Kurta Fitter</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6">
            <div className="aspect-w-1 aspect-h-1 h-[300px] md:h-[400px]">
                <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imagePreviewUrl} />
            </div>
            <CustomizationForm
              options={customizationOptions}
              setOptions={setCustomizationOptions}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isImageUploaded={!!userImageFile}
            />
          </div>

          {/* Right Column: Result */}
          <div className="flex flex-col">
            <div className="flex-grow min-h-[400px] lg:min-h-0">
                <ResultDisplay
                    isLoading={isLoading}
                    resultImageUrl={resultImageUrl}
                    error={error}
                />
            </div>
            {(resultImageUrl || error) && (
              <button
                onClick={handleStartOver}
                className="mt-4 w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-gray-800 transition-all"
              >
                Start Over
              </button>
            )}
          </div>
        </main>
        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Fatemi Tailors. All Rights Reserved.</p>
            <p>Powered by Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
