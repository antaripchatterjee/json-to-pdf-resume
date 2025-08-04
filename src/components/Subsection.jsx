import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import ChartRenderer from './ChartRenderer';

const styles = StyleSheet.create({
  subsection: {
    padding: 4,
    margin: 0,
  },
  item: {
    fontSize: 10,
    marginBottom: 4,
  }
});

function Subsection({ subsection }) {
  const { 'subsection-name': name, 'subsection-items': items, 'subsection-chart': chart } = subsection;

  return (
    <View style={styles.subsection}>
      <Text>{name}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <Text>{item.subject} @ {item.organisation}</Text>
          <Text>{item.description}</Text>
        </View>
      ))}
      {chart?.visible !== false && <ChartRenderer chart={chart} items={items} />}
    </View>
  );
}

export default Subsection;
