/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { ImageIcon, XIcon } from 'lucide-react';

interface ImageInputProps {
  src?: string;
  label: string;
  desc: string;
  onChange: (file: File, src: string) => void;
  onDelete?: () => void;
}

export const ImageInput = ({
  src,
  label,
  desc,
  onChange,
  onDelete,
}: ImageInputProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple: false,
    onDrop(acceptedFiles, fileRejections) {
      if (fileRejections.length > 0) {
        console.error('File rejected:', fileRejections);
        return;
      }

      const file = acceptedFiles[0];

      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const dataUrl = reader.result;
        onChange(file, dataUrl as string);
      };
      reader.readAsDataURL(file);
    },
  });

  React.useEffect(() => {
    if (!src) return;
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => URL.revokeObjectURL(src);
  }, [src]);

  return (
    <div className="space-y-3">
      <div>
        <FormLabel>{label}</FormLabel>
        <FormDescription>{desc}</FormDescription>
        <div {...getRootProps()} className="w-max">
          <input {...getInputProps()} />
          <Button type="button" variant="outline" size="sm" className="mt-2">
            <ImageIcon /> {src ? 'Update Image' : 'Browse Image'}
          </Button>
        </div>
      </div>

      {src ? (
        <div className="relative flex w-[80px] h-[120px] border">
          <img
            src={src}
            alt={acceptedFiles[0]?.name}
            className="absolute inset-0 size-full object-contain object-center"
          />
          {onDelete ? (
            <Button
              type="button"
              size="iconSm"
              aria-label="delete file"
              className="absolute size-7 rounded-full top-0 right-0 z-10 bg-red-500 text-white hover:bg-red-400"
              onClick={() => {
                onDelete();
              }}
            >
              <XIcon />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
