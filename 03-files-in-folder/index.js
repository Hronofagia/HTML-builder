const fs = require('node:fs');
const path = require('path');
const { readdir } = require('fs/promises');

  const files = readdir(path.join('03-files-in-folder/secret-folder'), {withFileTypes: true})
  .then(result => {
    result.forEach(file => {
      fs.stat(path.join('03-files-in-folder/secret-folder', file.name), (err, stats) => {
        if (file.isFile()) {
          const ext = path.extname(file.name)
          const size = stats.size
          const name = path.basename(file.name, ext)
          console.log(`${name} - ${ext.slice(1)} - ${size}b`);
        }
      })
    })
  })