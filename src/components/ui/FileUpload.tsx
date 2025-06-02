// ui/FileUploader.tsx
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "./Button";

interface FileUploaderProps {
  id: string;
  label?: string;
  description?: string;
  acceptedFormats?: string;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  error?: string;
  file?: File;
  progress?: number;
  multiple?: boolean;
  additionalFiles?: {
    id: string;
    file: File;
    onRemove: () => void;
  }[];
}

export function FileUploader({
  id,
  label,
  description,
  acceptedFormats,
  onFileSelect,
  onRemove,
  error,
  file,
  progress,
  multiple = false,
  additionalFiles = [],
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="animate-fade-in-up">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
          {label}
        </label>
      )}

      {acceptedFormats && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
          Accepted formats: {acceptedFormats}
        </p>
      )}

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
          {description}
        </p>
      )}

      <div className="space-y-4">
        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center
            transition-all duration-300 ease-smooth
            ${
              isDragOver
                ? "border-primary-400 dark:border-dark-primary-400 bg-primary-50 dark:bg-dark-primary-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${
              error
                ? "border-error-400 dark:border-error-500 bg-error-50/50 dark:bg-error-900/20"
                : "bg-gray-50/50 dark:bg-gray-800/50"
            }
            backdrop-blur-sm
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />

          {/* Upload Icon */}
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
              isDragOver
                ? "bg-primary-200 dark:bg-dark-primary-800 text-primary-600 dark:text-dark-primary-300"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isDragOver ? "Drop file here" : "Drag & drop your file here"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">or</p>

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            }
          >
            Browse files
          </Button>
        </div>

        {/* Selected File Display */}
        {file && (
          <div className="glass dark:glass-dark rounded-xl p-4 animate-slide-in-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* File Type Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-dark-primary-900 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary-600 dark:text-dark-primary-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1.5 text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors duration-300 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {typeof progress === "number" && progress < 100 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 dark:from-dark-primary-600 dark:to-accent-600 h-2 rounded-full transition-all duration-300 ease-smooth"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Files */}
        {multiple && additionalFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Files ({additionalFiles.length})
            </p>
            {additionalFiles.map((additionalFile) => (
              <div
                key={additionalFile.id}
                className="glass dark:glass-dark rounded-lg p-3 flex items-center justify-between animate-slide-in-left"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {additionalFile.file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={additionalFile.onRemove}
                  className="p-1 text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors duration-300 rounded hover:bg-error-50 dark:hover:bg-error-900/20"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-center gap-1 animate-fade-in">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
