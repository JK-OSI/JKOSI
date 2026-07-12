/**
 * JKOSI password hashing utility.
 *
 * Usage:
 *   node scripts/hash-password.mjs <password>
 *
 * Outputs a salt:hash string you can use in a D1 UPDATE query:
 *   npx wrangler d1 execute jkosi-db --remote --command="UPDATE users SET password_hash = '<hash>' WHERE email = 'admin@jkosi.org';"
 */

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}

const encoder = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);

const toHex = (b) => Array.from(b).map(n => n.toString(16).padStart(2, '0')).join('');
const hash = `${toHex(salt)}:${toHex(new Uint8Array(bits))}`;

console.log(`Hash: ${hash}`);
console.log('');
console.log('Run this to update the admin password:');
console.log(`npx wrangler d1 execute jkosi-db --remote --command="UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@jkosi.org';"`);
