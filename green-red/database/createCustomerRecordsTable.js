import * as SQLite from 'expo-sqlite';

export const createCustomerRecordsTable = async () => {
    const db = SQLite.openDatabaseSync('green-red.db')
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS customer__records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                amount REAL NOT NULL,
                transaction_type TEXT NOT NULL,
                currency TEXT NOT NULL,
                transaction_at DATETIME NOT NULL,
                transaction_updated_at DATETIME NOT NULL
            )
        `;
        console.log("creating customer__records table")
        await db.execAsync(query);
        console.log("Table created successfully--- customer__records");
    } catch (error) {
        console.error("Error while creating customer__records table:", error.message);
        showToast("Error while creating customer__records table");
    }
}
