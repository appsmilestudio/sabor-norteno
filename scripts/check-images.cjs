const fs = require('fs');
const path = require('path');

const uploadDir = 'C:\\Users\\anghe\\.gemini\\antigravity\\brain\\e39b6c82-bbc0-4e22-a029-09a8cca842d1\\.user_uploaded';
const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.jpg'));

console.log("Uploaded files:", files);
