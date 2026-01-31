import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../context';
import { Trophy, Flame } from 'lucide-react-native';
import BlurHeader from '../components/BlurHeader';

export default function Leaderboard() {
  const { getAllTimeLeaderboard } = useAppStore();
  const leaderboard = getAllTimeLeaderboard();

  return (
    <View className="flex-1 bg-[#020617]">
      <BlurHeader title="Leaderboard" />
      <ScrollView contentContainerStyle={{ paddingTop: 72 }}>
        <View className="max-w-4xl mx-auto w-full p-4 space-y-6 pb-20">
          <View className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <Trophy color="#f59e0b" size={28} />
            <Text className="text-xl font-bold text-white mt-2">All-Time Champions</Text>
            <Text className="text-slate-400 text-sm mt-1">Top players by total XP and wins.</Text>
          </View>

          <View className="space-y-3">
            {leaderboard.map((player, idx) => (
              <TouchableOpacity activeOpacity={0.85} key={idx} className={`flex-row items-center p-4 rounded-3xl border transition-all shadow-2xl ${idx < 3 ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
                <View className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' : idx === 1 ? 'bg-slate-400/20 text-slate-300' : idx === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Text>#{idx + 1}</Text>
                </View>

                {player.avatarUrl && (
                  <Image source={{ uri: player.avatarUrl }} className="w-10 h-10 rounded-full mr-3" />
                )}

                <View className="flex-1">
                  <Text className="font-bold text-white">{player.name}</Text>
                  <Text className="text-xs text-slate-500">Level {player.level}</Text>
                </View>

                <View className="flex-row items-center space-x-4">
                  <View className="flex items-center">
                    <Text className="font-mono font-bold text-emerald-400">{player.xp}</Text>
                    <Text className="text-[10px] text-slate-500">XP</Text>
                  </View>
                  {player.wins > 0 && (
                    <View className="flex items-center">
                      <Flame color="#ef4444" size={14} />
                      <Text className="font-mono font-bold text-red-500 ml-1">{player.wins}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
