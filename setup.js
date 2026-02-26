const fs = require('fs');
const path = require('path');

// Copy logo to frontend public folder
const logoSource = path.join(__dirname, 'logo.png');
const logoDest = path.join(__dirname, 'frontend', 'public', 'logo.png');

if (fs.existsSync(logoSource)) {
  if (!fs.existsSync(path.dirname(logoDest))) {
    fs.mkdirSync(path.dirname(logoDest), { recursive: true });
  }
  fs.copyFileSync(logoSource, logoDest);
  console.log('✅ Logo copied to frontend/public/logo.png');
} else {
  console.log('⚠️  logo.png not found in root directory. Please add it manually.');
}

console.log('\n✅ Setup complete!');
console.log('\nNext steps:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Set up environment variables (see README.md)');
console.log('3. Start MongoDB');
console.log('4. Run: npm run dev');

