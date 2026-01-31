// components/ProductCard.tsx (Web)
import React from 'react';

interface ProductCardProps {
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  onAddToCart: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  price,
  imageUrl,
  description,
  onAddToCart,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 p-4 flex flex-col">
      <img className="w-full h-48 object-cover mb-4" src={imageUrl} alt={productName} />
      <div className="px-6 py-4 flex-grow">
        <div className="font-bold text-xl mb-2 text-gray-800">{productName}</div>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</span>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            onClick={() => onAddToCart(productName)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
// components/ProductCard.tsx (React Native)
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native'; // Import React Native components

interface ProductCardProps {
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  onAddToCart: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  price,
  imageUrl,
  description,
  onAddToCart,
}) => {
  return (
    <View className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 p-4 flex flex-col">
      <Image
        className="w-full h-48 object-cover mb-4" // NativeWind handles object-cover -> resizeMode: 'cover'
        source={{ uri: imageUrl }} // Use source prop for images
        accessibilityLabel={productName} // Good practice for accessibility
      />
      <View className="px-6 py-4 flex-grow">
        <Text className="font-bold text-xl mb-2 text-gray-800">{productName}</Text>
        <Text className="text-gray-700 text-base mb-4">{description}</Text>
        <View className="flex items-baseline justify-between mt-auto">
          <Text className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</Text>
          <Pressable // Use Pressable for clickable elements
            className="bg-indigo-500 active:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full" // active: for hover effect in RN
            onPress={() => onAddToCart(productName)} // onClick becomes onPress
          >
            <Text className="text-white font-bold">Add to Cart</Text> {/* Text inside Pressable */}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
npm install nativewind
# or
yarn add nativewind
npm install -D tailwindcss
# or
yarn add -D tailwindcss
npx tailwindcss init
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"], // Adjust paths to your components
  theme: {
    extend: {},
  },
  plugins: [],
};
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['nativewind/babel'], // Add this line
};
// App.tsx
import './global.css'; // Or wherever your global styles are
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import ProductCard from './components/ProductCard'; // Your new component

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <ProductCard
        productName="Wireless Headphones"
        price={99.99}
        imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        description="Experience immersive sound with these comfortable and stylish wireless headphones."
        onAddToCart={(name) => console.log(`Added ${name} to cart!`)}
      />
      <StatusBar style="auto" />
    </View>
  );
}

import React from 'react';
import { useAppStore } from '../context';
import { Bell, Check, Info, Swords, UserPlus, Gift } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const { notifications, markNotificationRead } = useAppStore();
  
  // Sort by newest
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return <Swords className="w-5 h-5 text-red-400" />;
      case 'invite': return <UserPlus className="w-5 h-5 text-blue-400" />;
      case 'reward': return <Gift className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-violet-400" />;
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Bell className="w-6 h-6 mr-3 text-violet-500" /> Notifications
        </h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-sm text-slate-400 hover:text-white flex items-center transition-colors"
          >
            <Check className="w-4 h-4 mr-1" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sortedNotifications.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-xl">
            <Bell className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No notifications yet.</p>
          </div>
        ) : (
          sortedNotifications.map((n, index) => (
            <div 
              key={n.id} 
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => !n.read && markNotificationRead(n.id)}
              className={`
                relative p-4 rounded-xl border transition-all duration-200 cursor-pointer animate-slide-in-right
                ${n.read 
                  ? 'bg-slate-900/50 border-slate-800 opacity-70 hover:opacity-100' 
                  : 'bg-slate-900 border-violet-500/30 shadow-lg shadow-violet-900/10'
                }
              `}
            >
              {!n.read && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              )}
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>{n.title}</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
