import fs from 'fs';
import { setData, saveData } from './dataStore';  // Import setData and saveData functions from datastore module
import { createHash } from 'crypto';

// Define the initial state of the data store
const initialData = {
  users: [],
  sessions: [],
};

// Function to clear the data store
const clearDataStore = (): void => {
    const initialData = {
        users: [],      // Clear all users
        sessions: []    // Clear all sessions
      };
    setData(initialData);    
};

// Function to hash a password using SHA-256
const getHash = (password: string): string => {
    return createHash('sha256').update(password).digest('hex');
  };
  
  // Function to generate a random token (example)
  const genUserToken = (): string => {
    return Math.random().toString(36).substring(2); // Generates a random alphanumeric string
  };
// Clear specific parts of the data store (Optional)
const clearSpecificData = (dataType: keyof typeof initialData): void => {
  const currentData = JSON.parse(String(fs.readFileSync('./datastore.json')));
  currentData[dataType] = [];
  
  setData(currentData);
  saveData();

  console.log(`${dataType} data has been cleared.`);
};

export { clearDataStore, clearSpecificData, genUserToken, getHash };

  