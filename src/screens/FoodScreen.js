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
  SegmentedButtons,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { 
  getFoods, 
  addFood, 
  deleteFood, 
  getDailyCalories 
} from '../database/db';

const FoodScreen = () => {
  const [foods, setFoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState('desayuno');
  const [quantity, setQuantity] = useState('1');
  const [dailyCalories, setDailyCalories] = useState(0);

  useEffect(() => {
    loadFoods();
    loadDailyCalories();
  }, []);

  const loadFoods = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await getFoods(today);
      setFoods(data);
    } catch (error) {
      console.error('Error cargando alimentos:', error);
    }
  };

  const loadDailyCalories = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const total = await getDailyCalories(today);
      setDailyCalories(total);
    } catch (error) {
      console.error('Error cargando calorías:', error);
    }
  };

  const handleAddFood = async () => {
    if (!foodName || !calories) {
      Alert.alert('Error', 'Por favor ingresa nombre y calorías');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const foodData = {
      name: foodName,
      calories: parseInt(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      date: today,
      meal_type: mealType,
      quantity: parseInt(quantity) || 1,
    };

    try {
      await addFood(foodData);
      resetForm();
      setModalVisible(false);
      loadFoods();
      loadDailyCalories();
    } catch (error) {
      console.error('Error añadiendo alimento:', error);
      Alert.alert('Error', 'No se pudo guardar el alimento');
    }
  };

  const resetForm = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setMealType('desayuno');
    setQuantity('1');
  };

  const handleDeleteFood = (id) => {
    Alert.alert(
      'Eliminar alimento',
      '¿Estás seguro de que quieres eliminar este alimento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFood(id);
              loadFoods();
              loadDailyCalories();
            } catch (error) {
              console.error('Error eliminando alimento:', error);
            }
          },
        },
      ]
    );
  };

  const getFoodsByMeal = (type) => {
    return foods.filter(food => food.meal_type === type);
  };

  const renderFoodItem = (item) => (
    <List.Item
      key={item.id}
      title={`${item.quantity}x ${item.name}`}
      description={`${item.calories * item.quantity} cal | P: ${item.protein}g C: ${item.carbs}g G: ${item.fat}g`}
      left={props => <List.Icon {...props} icon="food" />}
      right={props => (
        <Button 
          mode="text" 
          onPress={() => handleDeleteFood(item.id)}
          icon="delete"
        />
      )}
    />
  );

  const mealTypes = [
    { label: 'Desayuno', value: 'desayuno' },
    { label: 'Almuerzo', value: 'almuerzo' },
    { label: 'Cena', value: 'cena' },
    { label: 'Snack', value: 'snack' },
  ];

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header title="Alimentos" />
        
        <ScrollView style={styles.content}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Calorías de Hoy</Title>
              <View style={styles.caloriesContainer}>
                <Icon name="fire" size={40} color="#FF5722" />
                <Text style={styles.caloriesText}>{dailyCalories} cal</Text>
              </View>
              <Text style={styles.caloriesSubtitle}>
                Total de calorías consumidas hoy
              </Text>
            </Card.Content>
          </Card>

          {mealTypes.map(meal => {
            const mealFoods = getFoodsByMeal(meal.value);
            if (mealFoods.length === 0) return null;

            return (
              <Card key={meal.value} style={styles.mealCard}>
                <Card.Content>
                  <Title>{meal.label}</Title>
                  <List.Section>
                    {mealFoods.map(renderFoodItem)}
                  </List.Section>
                </Card.Content>
              </Card>
            );
          })}

          {foods.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  No hay alimentos registrados hoy. ¡Agrega tu primer alimento!
                </Text>
              </Card.Content>
            </Card>
          )}
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
                <Title>Agregar Alimento</Title>
                
                <SegmentedButtons
                  value={mealType}
                  onValueChange={setMealType}
                  buttons={mealTypes}
                  style={styles.segmentedButtons}
                />

                <TextInput
                  label="Nombre del alimento"
                  value={foodName}
                  onChangeText={setFoodName}
                  mode="outlined"
                  style={styles.input}
                />

                <View style={styles.row}>
                  <TextInput
                    label="Cantidad"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                  <TextInput
                    label="Calorías"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                </View>

                <Title style={styles.subtitle}>Nutrientes (opcional)</Title>
                <View style={styles.row}>
                  <TextInput
                    label="Proteína (g)"
                    value={protein}
                    onChangeText={setProtein}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                  <TextInput
                    label="Carbos (g)"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                  <TextInput
                    label="Grasas (g)"
                    value={fat}
                    onChangeText={setFat}
                    keyboardType="numeric"
                    mode="outlined"
                    style={[styles.input, styles.smallInput]}
                  />
                </View>

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
                    onPress={handleAddFood}
                    style={styles.button}
                  >
                    Agregar
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
  mealCard: {
    marginBottom: 16,
    elevation: 2,
  },
  emptyCard: {
    marginTop: 20,
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
  segmentedButtons: {
    marginBottom: 16,
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
  subtitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
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

export default FoodScreen;