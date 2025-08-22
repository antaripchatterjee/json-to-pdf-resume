import React from 'react';
import { Document, Page, StyleSheet, View, Text , Font} from '@react-pdf/renderer';
import Section from './Section';

const styles = (fontFamily) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 0,
    margin: 0,
    fontFamily,
  },
  primaryInfo: {
    backgroundColor: 'customwhite',
    padding: 16,
    margin: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    margin: 16,
    padding: 0,
  }
});

function ResumeRenderer({ data, fontFamily }) {
  const dynamicStyles = styles(fontFamily || 'Noto Serif');
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={dynamicStyles.page}>
        <View style={dynamicStyles.primaryInfo}>
          <Text>{data['primary-info'].name}</Text>
        </View>
        {data.sections.map((section, i) => (
          <View key={i} style={dynamicStyles.sectionContainer}>
            <Section section={section} />
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default ResumeRenderer;
