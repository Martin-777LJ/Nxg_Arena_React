// src/components/WebCard.tsx
import React from 'react';

interface WebCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const WebCard: React.FC<WebCardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      {imageUrl && (
        <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      )}
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <div className="px-6 pt-4 pb-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default WebCard;
// src/components/NativeCard.tsx
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native'; // Import React Native components

// Ensure NativeWind is set up in your project (e.g., tailwind.config.js)
// and that you've run `npx tailwindcss init -p` and configured it for React Native.

interface NativeCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const NativeCard: React.FC<NativeCardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
}) => {
  return (
    // Replaced div with View
    <View className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      {imageUrl && (
        // Replaced img with Image
        // src becomes source={{ uri: '...' }} for network images
        // For local images, it would be source={require('./path/to/image.png')}
        // alt becomes accessibilityLabel
        <Image
          className="w-full h-48 object-cover" // NativeWind handles object-cover (resizeMode)
          source={{ uri: imageUrl }}
          accessibilityLabel={title}
        />
      )}
      <View className="px-6 py-4">
        {/* Replaced h2 with Text */}
        <Text className="font-bold text-xl mb-2 text-gray-800">{title}</Text>
        {/* Replaced p with Text */}
        <Text className="text-gray-700 text-base">{description}</Text>
      </View>
      {buttonText && onButtonClick && (
        <View className="px-6 pt-4 pb-2">
          {/* Replaced button with Pressable */}
          {/* onClick becomes onPress */}
          {/* NativeWind handles hover/active states for Pressable */}
          <Pressable
            className="bg-blue-500 active:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onPress={onButtonClick}
          >
            {/* Button text also needs to be wrapped in Text */}
            <Text className="text-white font-bold">{buttonText}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default NativeCard;
