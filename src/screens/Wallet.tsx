// src/components/MyWebCard.tsx
import React from 'react';

interface MyWebCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const MyWebCard: React.FC<MyWebCardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
  isActive,
}) => {
  const containerClasses = `
    p-4 m-2 rounded-lg shadow-md
    ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}
    ${onClick ? 'cursor-pointer hover:bg-blue-600 active:bg-blue-700' : ''}
  `;

  const titleClasses = 'text-xl font-bold mb-1';
  const descriptionClasses = 'text-sm';
  const imageClasses = 'w-full h-32 object-cover rounded-t-lg mb-2';

  return (
    <div className={containerClasses} onClick={onClick}>
      {imageUrl && <img src={imageUrl} alt={title} className={imageClasses} />}
      <span className={titleClasses}>{title}</span>
      <span className={descriptionClasses}>{description}</span>
      {onClick && (
        <div className="mt-3 text-blue-700 font-semibold">
          <span>Learn More &rarr;</span>
        </div>
      )}
    </div>
  );
};

export default MyWebCard;
// src/components/MyReactNativeCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface MyReactNativeCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onPress?: () => void; // Renamed onClick to onPress for React Native convention
  isActive?: boolean;
}

const MyReactNativeCard: React.FC<MyReactNativeCardProps> = ({
  title,
  description,
  imageUrl,
  onPress,
  isActive,
}) => {
  // NativeWind classes are applied directly.
  // Note: 'cursor-pointer' and 'hover:' are web-specific and removed/replaced.
  // 'active:' is used for touch feedback in NativeWind.
  const containerClasses = `
    p-4 m-2 rounded-lg shadow-md
    ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}
    ${onPress ? 'active:bg-blue-600' : ''}
  `;

  const titleClasses = 'text-xl font-bold mb-1';
  const descriptionClasses = 'text-sm';
  const imageClasses = 'w-full h-32 object-cover rounded-t-lg mb-2';
  const learnMoreClasses = 'mt-3 text-blue-700 font-semibold';

  // Content to be rendered inside either View or TouchableOpacity
  const cardContent = (
    <>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} alt={title} className={imageClasses} />
      )}
      <Text className={titleClasses}>{title}</Text>
      <Text className={descriptionClasses}>{description}</Text>
      {onPress && (
        <View className={learnMoreClasses}>
          <Text>Learn More &rarr;</Text>
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity className={containerClasses} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  } else {
    return (
      <View className={containerClasses}>
        {cardContent}
      </View>
    );
  }
};

export default MyReactNativeCard;
npm install nativewind
# or
yarn add nativewind
npm install tailwindcss
# or
yarn add tailwindcss
npx tailwindcss init
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this covers your component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
npm install --save-dev babel-plugin-transform-inline-environment-variables
# or
yarn add --dev babel-plugin-transform-inline-environment-variables
// babel.config.js
    module.exports = {
  presets: ['module:metro-react-native-babel-preset'], // Correct for CLI
    plugins: [
      "nativewind/babel",
      "babel-plugin-transform-inline-environment-variables", // Add this
    ],
  };
};
// App.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import MyReactNativeCard from './src/components/MyReactNativeCard'; // Adjust path as needed

const App: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <MyReactNativeCard
          title="React Native Card 1"
          description="This is a description for the first card."
          imageUrl="https://picsum.photos/id/237/200/300"
          onPress={() => console.log('Card 1 pressed!')}
        />
        <MyReactNativeCard
          title="Active Card"
          description="This card is active and has a different background."
          isActive={true}
          onPress={() => console.log('Active Card pressed!')}
        />
        <MyReactNativeCard
          title="Non-Clickable Card"
          description="This card does not have an onPress handler."
          imageUrl="https://picsum.photos/id/238/200/300"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
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
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const WalletScreen = () => {
  const nxgBalance = 5000; // Example balance

  return (
    <ScrollView className="flex-1 bg-[#0f172a] p-6">
      {/* Balance Card */}
      <View className="bg-[#1e293b] rounded-3xl p-8 border border-[#334155] mb-8 shadow-2xl">
        <Text className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Available Balance</Text>
        <View className="flex-row items-baseline mt-2">
          <Text className="text-white text-5xl font-bold">{nxgBalance}</Text>
          <Text className="text-cyan-400 text-xl ml-2 font-medium">NXG</Text>
        </View>
        <Text className="text-gray-500 mt-1">≈ ₦{nxgBalance.toLocaleString()} NGN</Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between mb-8">
        <TouchableOpacity className="bg-cyan-500 flex-1 mr-2 p-4 rounded-2xl items-center shadow-lg">
          <Text className="text-[#0f172a] font-bold text-lg">Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#1e293b] border border-[#334155] flex-1 ml-2 p-4 rounded-2xl items-center">
          <Text className="text-white font-bold text-lg">Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <Text className="text-white text-xl font-bold mb-4">Activity History</Text>
      <View className="bg-[#1e293b] rounded-2xl p-4 border border-[#334155]">
        <View className="flex-row justify-between border-b border-[#334155] py-4">
          <View>
            <Text className="text-white font-semibold">Tournament Entry</Text>
            <Text className="text-gray-500 text-xs">Jan 30, 2026</Text>
          </View>
          <Text className="text-red-400 font-bold">- 500 NXG</Text>
        </View>
        <View className="flex-row justify-between py-4">
          <View>
            <Text className="text-white font-semibold">Paystack Deposit</Text>
            <Text className="text-gray-500 text-xs">Jan 28, 2026</Text>
          </View>
          <Text className="text-green-400 font-bold">+ 2,000 NXG</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default WalletScreen;
