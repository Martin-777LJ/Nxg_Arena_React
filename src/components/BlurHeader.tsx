import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title?: string;
  right?: React.ReactNode;
};

export default function BlurHeader({ title, right }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: 'rgba(2,6,23,0.45)', // Transparent premium dark overlay
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    // shadow for elevated look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderBottomWidth: 0,
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#fff', fontWeight: '800', fontSize: 16 },
  right: { marginLeft: 12 },
});