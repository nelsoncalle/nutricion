import * as SQLite from 'expo-sqlite';

// Variable para la base de datos
let db = null;

// Función para abrir la base de datos de forma segura
const openDatabase = () => {
  try {
    if (!db) {
      console.log('Abriendo base de datos...');
      db = SQLite.openDatabase('nutriapp.db');
    }
    return db;
  } catch (error) {
    console.error('Error abriendo base de datos:', error);
    return null;
  }
};

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    
    if (!database) {
      console.warn('SQLite no disponible, usando modo simulación');
      resolve(); // Resolvemos igual para que la app continúe
      return;
    }

    database.transaction(tx => {
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
      // No rechazamos, solo resolvemos para que la app continúe
      resolve();
    });
  });
};

// Operaciones CRUD para Perfiles con verificación
export const addWeight = (date, weight, notes = '') => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, simulando operación');
      resolve({ insertId: Date.now() });
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO profiles (date, weight, notes) VALUES (?, ?, ?);',
        [date, weight, notes],
        (_, result) => resolve(result),
        (_, error) => {
          console.error('Error añadiendo peso:', error);
          resolve({ insertId: Date.now() }); // Simulamos éxito
        }
      );
    });
  });
};

export const getWeights = () => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, retornando array vacío');
      resolve([]);
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM profiles ORDER BY date DESC;',
        [],
        (_, { rows }) => resolve(rows._array || []),
        (_, error) => {
          console.error('Error obteniendo pesos:', error);
          resolve([]); // Retornamos array vacío en caso de error
        }
      );
    });
  });
};

export const deleteWeight = (id) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, simulando eliminación');
      resolve();
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM profiles WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => {
          console.error('Error eliminando peso:', error);
          resolve(); // Simulamos éxito
        }
      );
    });
  });
};

// Operaciones CRUD para Alimentos con verificación
export const addFood = (food) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, simulando operación');
      resolve({ insertId: Date.now() });
      return;
    }

    database.transaction(tx => {
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
        (_, error) => {
          console.error('Error añadiendo alimento:', error);
          resolve({ insertId: Date.now() });
        }
      );
    });
  });
};

export const getFoods = (date = null) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, retornando array vacío');
      resolve([]);
      return;
    }

    database.transaction(tx => {
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
        (_, { rows }) => resolve(rows._array || []),
        (_, error) => {
          console.error('Error obteniendo alimentos:', error);
          resolve([]);
        }
      );
    });
  });
};

export const deleteFood = (id) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, simulando eliminación');
      resolve();
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM foods WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => {
          console.error('Error eliminando alimento:', error);
          resolve();
        }
      );
    });
  });
};

export const getDailyCalories = (date) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, retornando 0');
      resolve(0);
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(calories * quantity) as total FROM foods WHERE date = ?;',
        [date],
        (_, { rows }) => resolve(rows._array[0]?.total || 0),
        (_, error) => {
          console.error('Error obteniendo calorías:', error);
          resolve(0);
        }
      );
    });
  });
};

// Operaciones CRUD para Ejercicios con verificación
export const addExercise = (exercise) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, simulando operación');
      resolve({ insertId: Date.now() });
      return;
    }

    database.transaction(tx => {
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
        (_, error) => {
          console.error('Error añadiendo ejercicio:', error);
          resolve({ insertId: Date.now() });
        }
      );
    });
  });
};

export const getExercises = (date = null) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, retornando array vacío');
      resolve([]);
      return;
    }

    database.transaction(tx => {
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
        (_, { rows }) => resolve(rows._array || []),
        (_, error) => {
          console.error('Error obteniendo ejercicios:', error);
          resolve([]);
        }
      );
    });
  });
};

export const deleteExercise = (id) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, simulando eliminación');
      resolve();
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM exercises WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => {
          console.error('Error eliminando ejercicio:', error);
          resolve();
        }
      );
    });
  });
};

export const getDailyExerciseCalories = (date) => {
  return new Promise((resolve, reject) => {
    const database = openDatabase();
    if (!database) {
      console.warn('Base de datos no disponible, retornando 0');
      resolve(0);
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'SELECT SUM(calories_burned) as total FROM exercises WHERE date = ?;',
        [date],
        (_, { rows }) => resolve(rows._array[0]?.total || 0),
        (_, error) => {
          console.error('Error obteniendo calorías quemadas:', error);
          resolve(0);
        }
      );
    });
  });
};