import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Password hashing and comparison utility.
 * 
 * This class provides methods to hash a password and compare a supplied password
 * with a stored hashed password using the scrypt algorithm.
 */
export class Password {
  // Hash a password using scrypt algorithm
  // The password is salted with a random value to enhance security
  // The salt is stored along with the hashed password for later comparison
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    // The hashed password is stored as a hex string, concatenated with the salt
    return `${buffer.toString('hex')}.${salt}`;
  }

  // Compare a supplied password with a stored hashed password
  // The supplied password is hashed with the same salt and compared with the 
  // stored hashed password
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buffer.toString('hex') === hashedPassword;
  }
}
