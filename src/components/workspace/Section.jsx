import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import Subsection from './Subsection';

const styles = StyleSheet.create({
  column: { flex: 1, padding: 4 },
  row: { flexDirection: 'row' }
});

function Section({ section }) {
  const layout = section.layout;
  const { subsections } = section;

  let currentIndex = 0;

  return (
    <View style={styles.row}>
      {layout.map((rows, colIndex) => {
        const colSubsections = subsections.slice(currentIndex, currentIndex + rows);
        currentIndex += rows;
        return (
          <View key={colIndex} style={styles.column}>
            {colSubsections.map((sub, idx) => (
              <Subsection key={idx} subsection={sub} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

export default Section;
