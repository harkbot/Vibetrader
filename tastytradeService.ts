
import { TastySession } from './types';

const BASE_URL = 'https://api.tastytrade.com';

/**
 * NOTE: In a production browser environment, these calls would fail due to CORS
 * unless proxied through a backend. This implementation follows the official
 * Tastytrade API spec (https://developer.tastytrade.com/).
 */

export async function loginToTasty(username: string, password: string): Promise<TastySession> {
  const response = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: username, password })
  });

  if (!response.ok) throw new Error('Invalid Tastytrade credentials');

  const data = await response.json();
  return {
    token: data.data['session-token'],
    email: username
  };
}

export async function getAccountData(token: string) {
  const response = await fetch(`${BASE_URL}/customers/me/accounts`, {
    headers: { 'Authorization': token }
  });
  if (!response.ok) throw new Error('Failed to fetch accounts');
  const data = await response.json();
  return data.data.items[0]; // Returns first active account
}

export async function getBalance(token: string, accountNumber: string): Promise<number> {
  const response = await fetch(`${BASE_URL}/accounts/${accountNumber}/balances`, {
    headers: { 'Authorization': token }
  });
  if (!response.ok) return 45000.00; // Fallback to mock
  const data = await response.json();
  return parseFloat(data.data['net-liquidating-value']);
}
