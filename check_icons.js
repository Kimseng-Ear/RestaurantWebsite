
const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const srcDir = 'd:/D/Leisure_Lake_Website/client/src';

walk(srcDir, (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Just find ALL <CapitalWord and see if it's imported from lucide-react or others
  const jsxTags = [...content.matchAll(/<([A-Z][a-zA-Z0-9]*)/g)].map(m => m[1]);
  const uniqueTags = [...new Set(jsxTags)];
  
  const importsText = content.match(/import\s*\{([^}]*)\}\s*from\s*'lucide-react'/);
  const lucideImports = importsText ? importsText[1].split(',').map(s => s.trim().split(' as ').pop().trim()) : [];
  
  const otherImports = [...content.matchAll(/import\s+(?:\{([^}]*)\}|([A-Z][a-zA-Z0-9]*))/g)].flatMap(m => {
    if (m[1]) return m[1].split(',').map(s => s.trim().split(' as ').pop().trim());
    return [m[2]];
  });
  
  const allImports = new Set([...lucideImports, ...otherImports, 'React', 'motion', 'AnimatePresence', 'Route', 'Routes', 'Link', 'BrowserRouter', 'Router']);
  
  const internalComps = [...content.matchAll(/(?:const|function)\s+([A-Z][a-zA-Z0-9]*)\s*=/g)].map(m => m[1]);

  const missing = uniqueTags.filter(tag => !allImports.has(tag) && !internalComps.includes(tag) && tag !== 'AuthProvider' && tag !== 'AuthContext');
  
  if (missing.length > 0) {
    console.log(`${filePath}: ${missing.join(', ')}`);
  }
});
