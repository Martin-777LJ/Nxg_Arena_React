import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { ShieldCheck, Clock, Trophy, Users, TrendingUp, Search, Plus, Edit3 } from 'lucide-react-native';
import { useAppStore } from '../context/AppContextProvider';

const AdminTerminal = ({ navigation }: any) => {
  const { user, organizerRequests, tournaments, allUsers, refreshAdminData } = useAppStore();
  const [activeTab, setActiveTab] = useState<'requests' | 'tournaments' | 'users' | 'metrics'>('requests');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-refresh data on entry - mirroring your web logic
  useEffect(() => {
    if (user?.isAdmin) refreshAdminData();
  }, [user?.isAdmin]);

  // Filtered lists for the native FlatList
  const filteredTournaments = useMemo(() => 
    tournaments.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [tournaments, searchQuery]
  );

  return (
    <View className="flex-1 bg-[#020617] p-4">
      {/* Header - Native Gaming Theme */}
      <View className="mb-6">
        <View className="flex-row items-center mb-1">
          <ShieldCheck color="#8b5cf6" size={24} />
          <Text className="text-white text-2xl font-bold ml-2">System Control</Text>
        </View>
        <Text className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          Secure Link Active • 2026-01-31
        </Text>
      </View>

      {/* Admin Tab Bar - Mobile Optimized */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-6">
        {[
          { id: 'requests', label: 'Apps', icon: Clock, count: organizerRequests.length },
          { id: 'tournaments', label: 'Events', icon: Trophy },
          { id: 'users', label: 'Citizens', icon: Users },
          { id: 'metrics', label: 'Intel', icon: TrendingUp }
        ].map(tab => (
          <TouchableOpacity 
            key={tab.id}
            onPress={() => setActiveTab(tab.id as any)}
            className={`mr-3 px-4 py-2 rounded-xl flex-row items-center ${activeTab === tab.id ? 'bg-violet-600' : 'bg-slate-900 border border-slate-800'}`}
          >
            <tab.icon color={activeTab === tab.id ? 'white' : '#64748b'} size={14} />
            <Text className={`ml-2 text-xs font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
              {tab.label} {tab.count ? `(${tab.count})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content Area */}
      {activeTab === 'tournaments' && (
        <View className="flex-1">
          <View className="flex-row items-center mb-6">
            <View className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex-row items-center px-4">
              <Search size={18} color="#64748b" />
              <TextInput 
                placeholder="Search database..." 
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="text-white p-3 text-sm flex-1"
              />
            </View>
            <TouchableOpacity className="ml-4 bg-violet-600 p-4 rounded-2xl shadow-lg">
              <Plus color="white" size={20} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredTournaments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] mb-4">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-white font-bold text-lg uppercase tracking-tight">{item.title}</Text>
                    <Text className="text-violet-400 text-[10px] font-bold uppercase mt-1">{item.status}</Text>
                  </View>
                  <Text className="text-emerald-400 font-mono font-bold">{item.prizePool}</Text>
                </View>
                <View className="flex-row justify-end gap-2 pt-4 border-t border-slate-800/50">
                  <TouchableOpacity className="p-2 bg-slate-800 rounded-lg"><Edit3 color="#94a3b8" size={16} /></TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('TournamentDetails', { id: item.id })}
                    className="p-2 bg-slate-800 rounded-lg"
                  >
                    <TrendingUp color="#94a3b8" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default AdminTerminal;
