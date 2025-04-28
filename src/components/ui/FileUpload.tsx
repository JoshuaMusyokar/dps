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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      // Clear the input value so the same file can be selected again if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {acceptedFormats && (
        <p className="text-xs text-gray-500 mb-2">
          Accepted formats: {acceptedFormats}
        </p>
      )}

      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}

      <div className="space-y-3">
        {/* File input button */}
        <div className="flex items-center">
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
            Browse files...
          </Button>

          {file && (
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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

              {typeof progress === "number" && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional files list */}
        {multiple && additionalFiles.length > 0 && (
          <div className="space-y-2">
            {additionalFiles.map((additionalFile) => (
              <div
                key={additionalFile.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {additionalFile.file.name}
                </span>
                <button
                  type="button"
                  onClick={additionalFile.onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
