import * as SQLite from 'expo-sqlite';

class Database {
    static instance = null;
    
    static getInstance() {
        if (Database.instance === null) {
            Database.instance = SQLite.openDatabaseSync('green-red.db');
            console.log('Database connection initialized');
        }
        return Database.instance;
    }
}

export const getDatabase = () => Database.getInstance(); 