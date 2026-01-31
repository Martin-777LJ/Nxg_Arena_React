import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../context';
import { Wallet as WalletIcon, TrendingUp, CreditCard, Gift } from 'lucide-react-native';
import BlurHeader from '../components/BlurHeader';

export default function Wallet() {
  const { user } = useAppStore();

  return (
    <View className="flex-1 bg-[#020617]">
      <BlurHeader title="Wallet" />
      <ScrollView contentContainerStyle={{ paddingTop: 72 }}>
        <View className="max-w-2xl mx-auto w-full p-4 space-y-6 pb-20">
          <View className="bg-[#1e293b] rounded-3xl p-8 border border-[#334155] mb-8 shadow-2xl">
            <WalletIcon color="#8b5cf6" size={32} />
            <Text className="text-4xl font-bold text-white mt-4 font-mono">${user.walletBalance.toFixed(2)}</Text>
            <Text className="text-slate-400 mt-2 text-xs uppercase tracking-widest font-bold">Available Balance</Text>
          </View>

          <View className="space-y-4">
            <Text className="text-lg font-bold text-white uppercase tracking-widest font-['Rajdhani']">Quick Actions</Text>
            <TouchableOpacity activeOpacity={0.85} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex-row items-center shadow-2xl">
              <CreditCard color="#7c3aed" size={24} />
              <Text className="flex-1 text-white font-bold ml-4">Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex-row items-center shadow-2xl">
              <Gift color="#f59e0b" size={24} />
              <Text className="flex-1 text-white font-bold ml-4">Redeem Code</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4 mt-8">
            <Text className="text-lg font-bold text-white uppercase tracking-widest font-['Rajdhani']">Transaction History</Text>
            <View className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-center">
              <Text className="text-slate-500 text-sm">No transactions yet.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
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
