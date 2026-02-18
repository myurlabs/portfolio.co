import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (url: string) => void;
  label?: string;
  className?: string;
  shape?: 'circle' | 'square';
}

export default function ImageUpload({ 
  currentImage, 
  onImageUpload, 
  label = "Upload Image",
  className = "",
  shape = "circle"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      // Check if Cloudinary is configured
      if (CLOUDINARY_CLOUD_NAME === 'demo' || !CLOUDINARY_UPLOAD_PRESET) {
        // Use local preview URL (for testing without Cloudinary)
        // Convert to base64 for persistence
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setPreview(base64);
          onImageUpload(base64);
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      setPreview(cloudinaryUrl);
      onImageUpload(cloudinaryUrl);
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageUpload(base64);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div
        className={`relative ${
          shape === 'circle' ? 'w-40 h-40' : 'w-full h-48'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className={`relative w-full h-full group ${
            shape === 'circle' ? 'rounded-full' : 'rounded-xl'
          } overflow-hidden`}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 ${
              shape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                disabled={uploading}
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                disabled={uploading}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Uploading spinner */}
            {uploading && (
              <div className={`absolute inset-0 bg-black/50 flex items-center justify-center ${
                shape === 'circle' ? 'rounded-full' : 'rounded-xl'
              }`}>
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-full border-2 border-dashed ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            } ${
              shape === 'circle' ? 'rounded-full' : 'rounded-xl'
            } flex flex-col items-center justify-center gap-2 transition-colors bg-gray-50 dark:bg-gray-800`}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <ImageIcon className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center px-2">
                  {dragActive ? 'Drop here!' : 'Click or drag to upload'}
                </span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        JPG, PNG, GIF, WebP • Max 5MB
      </p>
    </div>
  );
}
