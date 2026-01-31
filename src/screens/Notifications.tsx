import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../context';
import { Bell, Check, Info, Swords, UserPlus, Gift } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import BlurHeader from '../components/BlurHeader';

export default function Notifications() {
  const { notifications, markNotificationRead } = useAppStore();
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return <Swords color="#ef4444" size={18} />;
      case 'invite': return <UserPlus color="#3b82f6" size={18} />;
      case 'reward': return <Gift color="#f59e0b" size={18} />;
      default: return <Info color="#7c3aed" size={18} />;
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <View className="flex-1 bg-[#020617] p-4">
      <BlurHeader title="Notifications" right={sortedNotifications.some(n => !n.read) ? (
        <TouchableOpacity activeOpacity={0.85} onPress={handleMarkAllRead}><Text style={{color:'#94a3b8'}}>Mark all</Text></TouchableOpacity>
      ) : undefined} />

      <ScrollView contentContainerStyle={{ paddingTop: 72 }}>
        <View className="space-y-3">
          {sortedNotifications.length === 0 ? (
            <View className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl">
              <Bell color="#94a3b8" size={36} />
              <Text className="text-slate-500 mt-3">No notifications yet.</Text>
            </View>
          ) : (
            sortedNotifications.map((n, index) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => !n.read && markNotificationRead(n.id)}
                activeOpacity={0.85}
                className={`relative p-4 rounded-3xl border transition-all duration-200 ${n.read ? 'bg-slate-900/50 border-slate-800 opacity-70' : 'bg-slate-900 border-violet-500/30 shadow-2xl'}`}
                style={{ marginTop: index === 0 ? 0 : 8 }}
              >
                {!n.read && <View className="absolute top-4 right-4 w-2 h-2 bg-violet-500 rounded-full" />}
                <View className="flex-row items-start space-x-4">
                  <View className="p-2 rounded-lg bg-slate-800 border border-slate-700">{getIcon(n.type)}</View>
                  <View className="flex-1">
                    <Text className={`${n.read ? 'text-slate-300' : 'text-white'} text-sm font-bold`}>{n.title}</Text>
                    <Text className="text-sm text-slate-400 mt-1 leading-relaxed">{n.message}</Text>
                    <Text className="text-xs text-slate-600 mt-2">{formatDistanceToNow(new Date(n.date), { addSuffix: true })}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
