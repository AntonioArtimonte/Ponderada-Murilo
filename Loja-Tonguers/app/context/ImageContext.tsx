import { createContext, useContext, useState, ReactNode } from 'react';

type ImageContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: ReactNode }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  return (
    <ImageContext.Provider value={{ imageUri, setImageUri }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) throw new Error('useImage must be used within ImageProvider');
  return context;
}
