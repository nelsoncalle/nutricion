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
import { getWeights, addWeight, deleteWeight } from '../database/db';

const ProfileScreen = () => {
  const [weights, setWeights] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadWeights();
  }, []);

  const loadWeights = async () => {
    try {
      const data = await getWeights();
      setWeights(data);
    } catch (error) {
      console.error('Error cargando pesos:', error);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(newWeight)) {
      Alert.alert('Error', 'Por favor ingresa un peso válido');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    try {
      await addWeight(today, parseFloat(newWeight), notes);
      setNewWeight('');
      setNotes('');
      setModalVisible(false);
      loadWeights();
    } catch (error) {
      console.error('Error añadiendo peso:', error);
      Alert.alert('Error', 'No se pudo guardar el peso');
    }
  };

  const handleDeleteWeight = (id) => {
    Alert.alert(
      'Eliminar registro',
      '¿Estás seguro de que quieres eliminar este registro de peso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWeight(id);
              loadWeights();
            } catch (error) {
              console.error('Error eliminando peso:', error);
            }
          },
        },
      ]
    );
  };

  const getCurrentWeight = () => {
    if (weights.length > 0) {
      return weights[0].weight;
    }
    return 'N/A';
  };

  const calculateBMI = (weight, height = 1.7) => {
    const bmi = weight / (height * height);
    return bmi.toFixed(1);
  };

  const renderWeightItem = (item) => (
    <List.Item
      key={item.id}
      title={`${item.weight} kg`}
      description={`Fecha: ${item.date} ${item.notes ? `- ${item.notes}` : ''}`}
      left={props => <List.Icon {...props} icon="scale" />}
      right={props => (
        <Button 
          mode="text" 
          onPress={() => handleDeleteWeight(item.id)}
          icon="delete"
        />
      )}
    />
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header title="Mi Perfil" />
        
        <ScrollView style={styles.content}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Resumen Actual</Title>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Icon name="scale" size={24} color="#4CAF50" />
                  <Text style={styles.summaryValue}>{getCurrentWeight()} kg</Text>
                  <Text style={styles.summaryLabel}>Peso Actual</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Icon name="chart-line" size={24} color="#2196F3" />
                  <Text style={styles.summaryValue}>
                    {getCurrentWeight() !== 'N/A' 
                      ? calculateBMI(getCurrentWeight()) 
                      : 'N/A'}
                  </Text>
                  <Text style={styles.summaryLabel}>IMC</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.historyCard}>
            <Card.Content>
              <Title>Historial de Pesos</Title>
              {weights.length === 0 ? (
                <Text style={styles.emptyText}>
                  No hay registros de peso. Agrega tu primer registro.
                </Text>
              ) : (
                <List.Section>
                  {weights.map(renderWeightItem)}
                </List.Section>
              )}
            </Card.Content>
          </Card>
        </ScrollView>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Card>
              <Card.Content>
                <Title>Registrar Nuevo Peso</Title>
                <TextInput
                  label="Peso (kg)"
                  value={newWeight}
                  onChangeText={setNewWeight}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                />
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
                    onPress={() => setModalVisible(false)}
                    style={styles.button}
                  >
                    Cancelar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleAddWeight}
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
  historyCard: {
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
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
  input: {
    marginBottom: 12,
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

export default ProfileScreen;