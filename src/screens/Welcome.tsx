import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../navigation/types';

export default function Welcome() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  useEffect(() => {
    const t = setTimeout(() => {
      // Replace the welcome route with the main Home stack
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#020617] p-6">
      <View className="mb-6 items-center">
        <View className="w-24 h-24 rounded-3xl bg-violet-600 items-center justify-center mb-4">
          <Text className="text-white font-black text-3xl">NXG</Text>
        </View>
        <Text className="text-white font-black text-2xl">Welcome to Nexgen Arena</Text>
      </View>
      <Text className="text-slate-400 text-sm">Loading the arena...</Text>
    </View>
  );
}
