const fs = require('fs');
const files = [
  'src/App.jsx', 
  'src/components/Header.jsx', 
  'src/views/DashboardView.jsx', 
  'src/views/ConsortiumView.jsx', 
  'src/views/ClientProfileView.jsx', 
  'src/services/exportService.js', 
  'src/index.css',
  'src/components/Sidebar.jsx'
];

let changedFiles = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const before = content;
    const pattern = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [a-f0-9a-zA-Z]+[^\r\n]*(?:\r?\n|$)/g;
    content = content.replace(pattern, '$1');
    if (content !== before) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log('Fixed ' + file);
    }
  }
});
console.log('Total files fixed: ' + changedFiles);
