import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importar pantallas
import ProfileScreen from './src/screens/ProfileScreen';
import FoodScreen from './src/screens/FoodScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';

// Inicializar base de datos
import { initDatabase } from './src/database/db';

const Tab = createBottomTabNavigator();

// Tema personalizado
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#2196F3',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
  },
};

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Inicializar la base de datos al cargar la app
    const initializeDB = async () => {
      await initDatabase();
      setDbInitialized(true);
    };
    initializeDB();
  }, []);

  if (!dbInitialized) {
    return null; // O un componente de carga
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Perfil') {
                  iconName = 'account';
                } else if (route.name === 'Alimentos') {
                  iconName = 'food-apple';
                } else if (route.name === 'Ejercicios') {
                  iconName = 'run';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4CAF50',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Perfil" component={ProfileScreen} />
            <Tab.Screen name="Alimentos" component={FoodScreen} />
            <Tab.Screen name="Ejercicios" component={ExerciseScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});