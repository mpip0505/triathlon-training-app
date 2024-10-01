import { createUser } from '../modules/user';  // Import the createUser function from user.ts
import { getData, setData } from '../modules/dataStore'; // Import data management functions
import { clearDataStore } from '../modules/other'; // Import the clearDataStore utility function

// Initialize testing constants for reuse
const validEmail = 'test@example.com';
const validPassword = 'Password123';
const firstName = 'John';
const lastName = 'Doe';
const invalidEmail = 'invalid-email';
const shortPassword = 'short';
const nameWithInvalidChars = 'John@Doe';

// Run this before each test to clear the data store and ensure a clean state
beforeEach(() => {
  clearDataStore();
});

// Group tests for the createUser function
describe('createUser Function Tests', () => {
  test('should create a new user successfully with valid inputs', () => {
    const result = createUser(validEmail, validPassword, firstName, lastName);

    // Check that the token is returned, indicating success
    expect(result).toHaveProperty('token');

    // Verify that the user was added to the data store
    const data = getData();
    expect(data.users.length).toBe(1);
    expect(data.users[0].email).toBe(validEmail);
    expect(data.users[0].nameFirst).toBe(firstName);
    expect(data.users[0].nameLast).toBe(lastName);
  });

  test('should not create a user with an invalid email', () => {
    const result = createUser(invalidEmail, validPassword, firstName, lastName);

    // Expect an error message indicating the email is invalid
    expect(result).toEqual({ error: 'Email is invalid' });

    // Verify that no user was added to the data store
    const data = getData();
    expect(data.users.length).toBe(0);
  });

  test('should not create a user with an email that is already taken', () => {
    // Create the first user
    createUser(validEmail, validPassword, firstName, lastName);

    // Attempt to create another user with the same email
    const result = createUser(validEmail, validPassword, 'Jane', 'Smith');

    // Expect an error message indicating the email is taken
    expect(result).toEqual({ error: 'Email is taken' });

    // Verify that no additional user was added to the data store
    const data = getData();
    expect(data.users.length).toBe(1);
  });

  test('should not create a user with a password shorter than the minimum length', () => {
    const result = createUser(validEmail, shortPassword, firstName, lastName);

    // Expect an error message indicating the password length requirement
    expect(result).toEqual({ error: 'Password must be at least 8 characters' });

    // Verify that no user was added to the data store
    const data = getData();
    expect(data.users.length).toBe(0);
  });

  test('should not create a user with a first name containing invalid characters', () => {
    const result = createUser(validEmail, validPassword, nameWithInvalidChars, lastName);

    // Expect an error message indicating invalid characters in the first name
    expect(result).toEqual({ error: 'Invalid characters in first name' });

    // Verify that no user was added to the data store
    const data = getData();
    expect(data.users.length).toBe(0);
  });

  test('should create a session when a new user is created', () => {
    const result = createUser(validEmail, validPassword, firstName, lastName);

    // Check that the token is returned
    expect(result).toHaveProperty('token');

    // Verify that the session was added to the data store
    const data = getData();
    expect(data.sessions.length).toBe(1);
    expect(data.sessions[0].userId).toBe(data.users[0].userId);
    expect(data.sessions[0].loggedIn).toBe(true);
  });

  test('should store the hashed password instead of the plaintext password', () => {
    const result = createUser(validEmail, validPassword, firstName, lastName);

    // Check that the token is returned
    expect(result).toHaveProperty('token');

    // Verify that the stored password is hashed
    const data = getData();
    expect(data.users[0].password).not.toBe(validPassword); // Should not store plaintext password
  });
});