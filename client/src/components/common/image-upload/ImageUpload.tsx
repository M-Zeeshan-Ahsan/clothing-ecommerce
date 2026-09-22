import { useEffect, useRef, useState } from "react";
import "./ImageUpload.scss";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log("Selected Image File:", file);

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="image-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        hidden
      />

      {preview ? (
        <div className="image-upload__preview">
          <img src={preview} alt="Product preview" />

          <button
            type="button"
            className="image-upload__remove"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="image-upload__box"
          onClick={handleUploadClick}
        >
          <span className="image-upload__icon">↑</span>

          <strong>Upload Product Image</strong>

          <span>Click to select an image</span>

          <small>JPG, PNG or WEBP</small>
        </button>
      )}

      {preview && (
        <button
          type="button"
          className="image-upload__change"
          onClick={handleUploadClick}
        >
          Change Image
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
