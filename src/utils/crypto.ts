// Utility functions for encrypting and decrypting API keys
import CryptoJS from 'crypto-js';

export function encryptApiKeys(
  apiKey: string,
  secretKey: string,
  iv: Uint8Array,
  salt: Uint8Array
) {
  // Convert IV and salt to strings
  const ivString = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
  const saltString = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  // Create key from salt
  const key = CryptoJS.PBKDF2(saltString, saltString, {
    keySize: 256 / 32,
    iterations: 1000
  });

  // Encrypt API keys
  const encryptedApiKey = CryptoJS.AES.encrypt(apiKey, key.toString(), {
    iv: CryptoJS.enc.Hex.parse(ivString),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const encryptedSecretKey = CryptoJS.AES.encrypt(secretKey, key.toString(), {
    iv: CryptoJS.enc.Hex.parse(ivString),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    apiKey: encryptedApiKey.toString(),
    secretKey: encryptedSecretKey.toString()
  };
}

export function decryptApiKeys(
  encryptedApiKey: string,
  encryptedSecretKey: string,
  iv: number[],
  salt: number[]
) {
  // Convert IV and salt arrays back to strings
  const ivString = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
  const saltString = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  // Recreate the key
  const key = CryptoJS.PBKDF2(saltString, saltString, {
    keySize: 256 / 32,
    iterations: 1000
  });

  // Decrypt API keys
  const decryptedApiKey = CryptoJS.AES.decrypt(encryptedApiKey, key.toString(), {
    iv: CryptoJS.enc.Hex.parse(ivString),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const decryptedSecretKey = CryptoJS.AES.decrypt(encryptedSecretKey, key.toString(), {
    iv: CryptoJS.enc.Hex.parse(ivString),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    apiKey: decryptedApiKey.toString(CryptoJS.enc.Utf8),
    secretKey: decryptedSecretKey.toString(CryptoJS.enc.Utf8)
  };
}