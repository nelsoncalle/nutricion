import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

const Header = ({ title, subtitle }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('es-ES', options);
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content
        title={
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{getCurrentDate()}</Text>
          </View>
        }
      />
      <Appbar.Action icon="bell" onPress={() => {}} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4CAF50',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Header;