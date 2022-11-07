const fs = require('node:fs');
const { constants } = require('fs');
const { copyFile } = require('fs/promises');
const { mkdir } = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

mkdir('04-copy-directory/files-copy', { recursive: true }, (err) => {
  if (err) throw err;
});

readdir(path.join('04-copy-directory/files'))
.then(result => {
  result.forEach(file => {
    copyFile(path.join(`04-copy-directory/files/${file}`), path.join(`04-copy-directory/files-copy/${file}`));
  })
}).catch(e => {
  console.log('error: ', e);
})


