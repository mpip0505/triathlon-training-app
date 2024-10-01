import fs from 'fs';
import { User, getData, setData } from './dataStore';
import { createHash } from 'crypto';
import { genUserToken, getHash } from './other';
import * as EmailValidator from 'email-validator';

// Define a type for the User object
interface UserReturn {
    userId: number;
    email: string;
    password: string; // Ensure the password field is included
    nameFirst: string;
    nameLast: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
    usedPasswords: string[];
} 

/**
 * Given a set of properties, update those properties of this logged in admin user.
 * @param {string} token
 * @param {string} email
 * @param {string} nameFirst
 * @param {string} nameLast
 * @returns {empty}
 */
export const createUser = (email: string, password: string, nameFirst: string, nameLast: string): { token?: string, error?: string } => {
    const data = getData();
  
    // Check if the email is valid using validator library
    if (!EmailValidator.validate(email)) {
      return {
        error: 'Email is invalid'
      };
    }
  
    // Check if the email is already taken
    for (const user of data.users) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return {
          error: 'Email is taken'
        };
      }
    }
  
    // Validate first name length and characters
    if (nameFirst.length < 2 || nameFirst.length > 20) {
      return {
        error: 'First name should be more than 2 characters and less than 20 characters'
      };
    }
    if (!/^[a-zA-Z'\- ]+$/.test(nameFirst)) {
      return {
        error: 'Invalid characters in first name'
      };
    }
  
    // Validate last name length and characters
    if (nameLast.length < 2 || nameLast.length > 20) {
      return {
        error: `Last name should be more than ${2} characters and less than ${20} characters`
      };
    }
    if (!/^[a-zA-Z'\- ]+$/.test(nameLast)) {
      return {
        error: 'Invalid characters in last name'
      };
    }
  
    // Validate password length and complexity
    if (password.length < 8) {
      return {
        error: 'Password must be at least 8 characters'
      };
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return {
        error: 'Password must contain at least one number and one letter'
      };
    }
  
    // Generate a new user ID based on the current number of users
    const userId = data.users.length > 0 ? data.users[data.users.length - 1].userId + 1 : 1;
  
    // Generate a unique token for the new user
    const token = genUserToken();
  
    // Hash the password before storing it
    const passwordHash = getHash(password);
  
    // Create a new user object and add it to the data store
    data.users.push({
      userId,
      email,
      password: passwordHash,
      nameFirst,
      nameLast,
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
      usedPasswords: [passwordHash]
    });
  
    // Create a session for the user and add it to the data store
    data.sessions.push({
      userId,
      token,
      loggedIn: true
    });
  
    // Update the data store with the new user and session
    setData(data);
  
    // Return the token for successful user creation
    return {
      token
    };
  };