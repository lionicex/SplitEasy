import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useStore from '@/store/useStore';
import Header from '@/components/Header';
import GroupCard from '@/components/GroupCard';
import EmptyState from '@/components/EmptyState';

export default function GroupsScreen() {
  const router = useRouter();
  const { currentUser, users, groups } = useStore();
  
  if (!currentUser) return null;
  
  const handleAddGroup = () => {
    router.push('/add-group');
  };
  
  const renderGroupItem = ({ item }) => (
    <GroupCard
      group={item}
      users={users}
      onPress={() => router.push(`/group/${item.id}`)}
    />
  );
  
  const renderEmptyState = () => (
    <EmptyState
      title="No groups yet"
      description="Create a group to start tracking shared expenses with friends, roommates, or travel buddies."
      buttonTitle="Create Group"
      onButtonPress={handleAddGroup}
      icon={<Users size={64} color={Colors.primary} />}
    />
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Groups" 
        showAddButton 
        onAddPress={handleAddGroup}
      />
      
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.id}
        contentContainerStyle={groups.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
});