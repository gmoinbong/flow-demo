/**
 * JWT utilities for decoding tokens (without verification)
 * Used for extracting user data from tokens
 */

export interface JWTPayload {
  sub: string;
  email?: string;
  type?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Decode JWT token without verification
 * Returns null if token is invalid or cannot be decoded
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * Extract userId from JWT token
 */
export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeJWT(token);
  return decoded?.sub || null;
}

