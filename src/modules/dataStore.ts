import fs from 'fs';

export type TrainingType = 'swimming' | 'cycling' | 'running';

// Define the User interface to include personal details and training information
export interface User {
    userId: number;                            // Unique identifier for the user
    nameFirst: string;                         // User's first name
    nameLast: string;                          // User's last name
    email: string;                             // User's email address
    password: string;                          // Hashed password of the user
    numSuccessfulLogins: number;               // Number of successful logins
    numFailedPasswordsSinceLastLogin: number;  // Number of failed password attempts since the last login
    usedPasswords: string[];                   // History of used passwords (hashed)
  }

export interface Session {
    userId: number;
    token: string;
    loggedIn: boolean;
}
  
  
// Define the TrainingSession interface to represent each training session
export interface TrainingSession {
    sessionId: number;
    type: 'swimming' | 'cycling' | 'running'; // Type of training session
    date: string;                             // Date of the session in ISO format (e.g., '2024-09-30')
    distance: number;                         // Distance covered in kilometers
    duration: number;                         // Duration of the session in minutes
  }

export interface TrainingStats {
  userId: number;
  totalDistance: number;
  totalTime: number;
  averageSpeed: number; // distance / time
}

interface DataStore {
  users: User[];
  sessions: Session[];
}

// Initialize an empty datastore
let data: DataStore = {
  users: [],
  sessions: [],
};

// Check if the datastore exists. If it does, load data; otherwise, create a new one.
try {
  const dataStore = String(fs.readFileSync('./datastore.json'));
  if (dataStore !== '') {
    data = JSON.parse(dataStore);
  }
} catch {
  fs.writeFileSync('./datastore.json', JSON.stringify(data));
}

// Function to get the data from the datastore
const getData = (): DataStore => {
  return data;
};

// Function to set new data in the datastore
const setData = (newData: DataStore): void => {
  data = newData;
  saveData();
};

// Function to save the data to the JSON file
const saveData = (): void => {
  fs.writeFileSync('./datastore.json', JSON.stringify(data));
};

// Function to add a new user
const addUser = (newUser: User): void => {
  data.users.push(newUser);
  saveData();
};



export { getData, setData, saveData, addUser };