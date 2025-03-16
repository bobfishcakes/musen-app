import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';

interface GameTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const GameTabs = ({ activeTab, setActiveTab }: GameTabsProps) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable 
        style={[styles.tab, activeTab === 'game time' && styles.activeTab]} 
        onPress={() => setActiveTab('game time')}
      >
        <ThemedText style={styles.tabText}>Game Time</ThemedText>
      </Pressable>
      <Pressable 
        style={[styles.tab, activeTab === 'stats' && styles.activeTab]} 
        onPress={() => setActiveTab('stats')}
      >
        <ThemedText style={styles.tabText}>Stats</ThemedText>
      </Pressable>
      <Pressable 
        style={[styles.tab, activeTab === 'odds' && styles.activeTab]} 
        onPress={() => setActiveTab('odds')}
      >
        <ThemedText style={styles.tabText}>Odds</ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    padding: 4,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});