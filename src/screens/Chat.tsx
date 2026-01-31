import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Search, Users, User, Circle } from 'lucide-react-native';

const ChatRooms = ({ navigation }: any) => {
  // Use your real chatRooms from AppStore context here
  const rooms = [
    { id: 'global', name: 'Global Feed', type: 'global', lastMessage: 'Match starting soon...' },
    { id: 'clan', name: 'Alpha Squad', type: 'group', lastMessage: 'Check the schedule.' }
  ];

  return (
    <View className="flex-1 bg-[#020617] p-4">
      <Text className="text-2xl font-bold text-white mb-6 tracking-widest uppercase">Communications</Text>
      
      {/* Native Search Bar */}
      <View className="bg-[#0f172a] border border-[#1e293b] rounded-2xl flex-row items-center px-4 mb-6">
        <Search size={18} color="#64748b" />
        <TextInput 
          placeholder="Search channels..." 
          placeholderTextColor="#64748b"
          className="text-white flex-1 p-3 text-sm"
        />
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Chat', { roomId: item.id })}
            className="flex-row items-center p-4 bg-[#0f172a] rounded-2xl mb-3 border border-[#1e293b]"
          >
            <View className="w-12 h-12 bg-violet-600/20 rounded-xl items-center justify-center">
              {item.type === 'global' ? <Users color="#8b5cf6" /> : <User color="#8b5cf6" />}
            </View>
            <View className="ml-4 flex-1">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">{item.name}</Text>
                <View className="flex-row items-center">
                  <Circle size={8} fill="#10b981" color="#10b981" />
                  <Text className="text-emerald-400 text-[10px] ml-1 font-bold">LIVE</Text>
                </View>
              </View>
              <Text className="text-slate-500 text-xs truncate mt-1">{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatRooms;
