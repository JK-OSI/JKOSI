import { createInterface } from 'readline'

const email = process.env.ADMIN_EMAIL || 'admin@jkosi.org'

async function getPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD
  const rl = createInterface({ input: process.stdin, output: process.stderr })
  return new Promise(resolve => {
    rl.question('Admin password: ', answer => {
      rl.close()
      resolve(answer)
    })
  })
}

const password = await getPassword()
if (!password) {
  console.error('Password is required')
  process.exit(1)
}

const encoder = new TextEncoder()
const salt = crypto.getRandomValues(new Uint8Array(16))
const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)

const toHex = (b) => Array.from(b).map(n => n.toString(16).padStart(2, '0')).join('')
const hash = `${toHex(salt)}:${toHex(new Uint8Array(bits))}`

const sql = `INSERT OR REPLACE INTO users (id, email, password_hash, role)
VALUES ('seed-admin', '${email.replace(/'/g, "''")}', '${hash.replace(/'/g, "''")}', 'admin');`

console.log(sql)
