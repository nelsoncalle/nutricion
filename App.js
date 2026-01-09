// App.js - VERSIÓN SIMPLIFICADA QUE FUNCIONA
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NutriApp 🍎</Text>
        <Text style={styles.subtitle}>Control de nutrición y ejercicio</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Mi Perfil</Text>
        <Text>Peso actual: 70 kg</Text>
        <Text>IMC: 24.2 (Normal)</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Registrar Peso</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🍎 Alimentos Hoy</Text>
        <Text>• Desayuno: 400 cal</Text>
        <Text>• Almuerzo: 650 cal</Text>
        <Text>• Cena: 550 cal</Text>
        <Text>Total: 1600 calorías</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Agregar Alimento</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏃 Ejercicio Hoy</Text>
        <Text>• Caminata: 30 min (150 cal)</Text>
        <Text>• Total quemado: 150 calorías</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Agregar Ejercicio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Desliza para ver más</Text>
        <Text style={styles.version}>Versión 1.0 • Hecho con React Native</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f0',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  version: {
    color: '#999',
    fontSize: 12,
    marginTop: 10,
  },
});