const path = require('path');
const fs = require('fs');

console.log('🔍 SWASTHYA SATHI - SERVER DIAGNOSTIC TOOL\n');

// Check 1: .env file exists
console.log('1️⃣  Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasMongoURL = envContent.includes('MONGO_URL');
  const hasJWTSecret = envContent.includes('JWT_SECRET');
  const hasGroqKey = envContent.includes('GROQ_API_KEY');
  
  console.log(`   ✅ MONGO_URL: ${hasMongoURL ? 'Set' : 'Missing'}`);
  console.log(`   ✅ JWT_SECRET: ${hasJWTSecret ? 'Set' : 'Missing'}`);
  console.log(`   ✅ GROQ_API_KEY: ${hasGroqKey ? 'Set' : 'Missing'}`);
} else {
  console.log('   ❌ .env file not found');
}

// Check 2: node_modules exists
console.log('\n2️⃣  Checking node_modules...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules found');
} else {
  console.log('   ❌ node_modules not found - Run: npm install');
}

// Check 3: Required directories exist
console.log('\n3️⃣  Checking required directories...');
const dirs = ['config', 'controllers', 'routes', 'models', 'middlewares'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  const exists = fs.existsSync(dirPath);
  console.log(`   ${exists ? '✅' : '❌'} ${dir}/`);
});

// Check 4: Key configuration files exist
console.log('\n4️⃣  Checking key files...');
const files = ['config/db.js', 'server.js', 'package.json'];
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check 5: Try to load dependencies
console.log('\n5️⃣  Checking dependencies...');
const dependencies = ['express', 'mongoose', 'dotenv', 'cors', 'axios'];
dependencies.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`   ✅ ${dep} installed`);
  } catch (e) {
    console.log(`   ❌ ${dep} not found - Run: npm install`);
  }
});

console.log('\n📋 DIAGNOSTIC SUMMARY');
console.log('═══════════════════════════════════════');
console.log('\nTo start the server, run:');
console.log('  npm run server     (development with nodemon)');
console.log('  npm start          (production)');
console.log('\nOr directly:');
console.log('  node server.js\n');

