import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('nutriapp.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Tabla de perfiles (pesos)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          weight REAL NOT NULL,
          notes TEXT
        );`
      );

      // Tabla de alimentos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS foods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          calories INTEGER NOT NULL,
          protein REAL,
          carbs REAL,
          fat REAL,
          date TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          quantity INTEGER DEFAULT 1
        );`
      );

      // Tabla de ejercicios
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          duration INTEGER NOT NULL,
          calories_burned INTEGER NOT NULL,
          date TEXT NOT NULL,
          notes TEXT
        );`
      );

      console.log('Base de datos inicializada correctamente');
      resolve();
    }, (error) => {
      console.log('Error al inicializar la base de datos:', error);
      reject(error);
    });
  });
};

// Operaciones CRUD para Perfiles
export const addWeight = (date, weight, notes = '') => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO profiles (date, weight, notes) VALUES (?, ?, ?);',
        [date, weight, notes],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getWeights = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM profiles ORDER BY date DESC;',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteWeight = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM profiles WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

// Operaciones CRUD para Alimentos
export const addFood = (food) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO foods (name, calories, protein, carbs, fat, date, meal_type, quantity) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          food.name,
          food.calories,
          food.protein || 0,
          food.carbs || 0,
          food.fat || 0,
          food.date,
          food.meal_type,
          food.quantity || 1
        ],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getFoods = (date = null) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let query = 'SELECT * FROM foods';
      let params = [];
      
      if (date) {
        query += ' WHERE date = ?';
        params.push(date);
      }
      
      query += ' ORDER BY date DESC, id DESC;';
      
      tx.executeSql(
        query,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteFood = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM foods WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getDailyCalories = (date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(calories * quantity) as total FROM foods WHERE date = ?;',
        [date],
        (_, { rows }) => resolve(rows._array[0]?.total || 0),
        (_, error) => reject(error)
      );
    });
  });
};

// Operaciones CRUD para Ejercicios
export const addExercise = (exercise) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO exercises (name, duration, calories_burned, date, notes) 
         VALUES (?, ?, ?, ?, ?);`,
        [
          exercise.name,
          exercise.duration,
          exercise.calories_burned,
          exercise.date,
          exercise.notes || ''
        ],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getExercises = (date = null) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let query = 'SELECT * FROM exercises';
      let params = [];
      
      if (date) {
        query += ' WHERE date = ?';
        params.push(date);
      }
      
      query += ' ORDER BY date DESC, id DESC;';
      
      tx.executeSql(
        query,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteExercise = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM exercises WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getDailyExerciseCalories = (date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(calories_burned) as total FROM exercises WHERE date = ?;',
        [date],
        (_, { rows }) => resolve(rows._array[0]?.total || 0),
        (_, error) => reject(error)
      );
    });
  });
};