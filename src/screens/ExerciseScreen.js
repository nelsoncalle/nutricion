import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  List,
  FAB,
  Modal,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { 
  getExercises, 
  addExercise, 
  deleteExercise, 
  getDailyExerciseCalories 
} from '../database/db';

const ExerciseScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [notes, setNotes] = useState('');
  const [dailyBurned, setDailyBurned] = useState(0);

  useEffect(() => {
    loadExercises();
    loadDailyBurned();
  }, []);

  const loadExercises = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await getExercises(today);
      setExercises(data);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
    }
  };

  const loadDailyBurned = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const total = await getDailyExerciseCalories(today);
      setDailyBurned(total);
    } catch (error) {
      console.error('Error cargando calorías quemadas:', error);
    }
  };

  const handleAddExercise = async () => {
    if (!exerciseName || !duration || !caloriesBurned) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const exerciseData = {
      name: exerciseName,
      duration: parseInt(duration),
      calories_burned: parseInt(caloriesBurned),
      date: today,
      notes: notes,
    };

    try {
      await addExercise(exerciseData);
      resetForm();
      setModalVisible(false);
      loadExercises();
      loadDailyBurned();
    } catch (error) {
      console.error('Error añadiendo ejercicio:', error);
      Alert.alert('Error', 'No se pudo guardar el ejercicio');
    }
  };

  const resetForm = () => {
    setExerciseName('');
    setDuration('');
    setCaloriesBurned('');
    setNotes('');
  };

  const handleDeleteExercise = (id) => {
    Alert.alert(
      'Eliminar ejercicio',
      '¿Estás seguro de que quieres eliminar este ejercicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExercise(id);
              loadExercises();
              loadDailyBurned();
            } catch (error) {
              console.error('Error eliminando ejercicio:', error);
            }
          },
        },
      ]
    );
  };

  const renderExerciseItem = (item) => (
    <List.Item
      key={item.id}
      title={item.name}
      description={`${item.duration} min | ${item.calories_burned} cal quemadas\n${item.notes || ''}`}
      left={props => <List.Icon {...props} icon="run" />}
      right={props => (
        <Button 
          mode="text" 
          onPress={() => handleDeleteExercise(item.id)}
          icon="delete"
        />
      )}
    />
  );

  const exerciseSuggestions = [
    { name: 'Caminata', duration: 30, calories: 150 },
    { name: 'Correr', duration: 30, calories: 300 },
    { name: 'Bicicleta', duration: 30, calories: 250 },
    { name: 'Natación', duration: 30, calories: 200 },
  ];

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header title="Ejercicios" />
        
        <ScrollView style={styles.content}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Ejercicio de Hoy</Title>
              <View style={styles.caloriesContainer}>
                <Icon name="fire" size={40} color="#FF5722" />
                <Text style={styles.caloriesText}>{dailyBurned} cal</Text>
              </View>
              <Text style={styles.caloriesSubtitle}>
                Total de calorías quemadas hoy
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.suggestionsCard}>
            <Card.Content>
              <Title>Ejercicios Sugeridos</Title>
              <View style={styles.suggestionsContainer}>
                {exerciseSuggestions.map((ex, index) => (
                  <Card 
                    key={index} 
                    style={styles.suggestionCard}
                    onPress={() => {
                      setExerciseName(ex.name);
                      setDuration(ex.duration.toString());
                      setCaloriesBurned(ex.calories.toString());
                      setModalVisible(true);
                    }}
                  >
                    <Card.Content style={styles.suggestionContent}>
                      <Icon name="run" size={24} color="#4CAF50" />
                      <Text style={styles.suggestionName}>{ex.name}</Text>
                      <Text style={styles.suggestionDetails}>
                        {ex.duration} min - {ex.calories} cal
                      </Text>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.historyCard}>
            <Card.Content>
              <Title>Historial de Hoy</Title>
              {exercises.length === 0 ? (
                <Text style={styles.emptyText}>
                  No hay ejercicios registrados hoy. ¡Agrega tu primer ejercicio!
                </Text>
              ) : (
                <List.Section>
                  {exercises.map(renderExerciseItem)}
                </List.Section>
              )}
            </Card.Content>
          </Card>
        </ScrollView>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
              resetForm();
            }}
            contentContainerStyle={styles.modalContainer}
          >
            <Card>
              <Card.Content>
                <Title>Agregar Ejercicio</Title>
                
                <TextInput
                  label="Nombre del ejercicio"
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  mode="outlined"
                  style={styles.input}
                />

                <View style={styles.row}>
                  <TextInput
                    label="Duración (min)"
                    value={duration}
                    onChangeText={setDuration}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                  <TextInput
                    label="Calorías quemadas"
                    value={caloriesBurned}
                    onChangeText={setCaloriesBurned}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                </View>

                <TextInput
                  label="Notas (opcional)"
                  value={notes}
                  onChangeText={setNotes}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />

                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                    style={styles.button}
                  >
                    Cancelar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleAddExercise}
                    style={styles.button}
                  >
                    Guardar
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  suggestionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  historyCard: {
    elevation: 2,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  caloriesText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  caloriesSubtitle: {
    textAlign: 'center',
    color: '#666',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  suggestionCard: {
    width: '48%',
    marginBottom: 8,
    elevation: 1,
  },
  suggestionContent: {
    alignItems: 'center',
    padding: 8,
  },
  suggestionName: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  suggestionDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  modalContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 12,
  },
  smallInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ExerciseScreen;