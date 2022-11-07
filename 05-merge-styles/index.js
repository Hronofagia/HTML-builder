const fs = require('node:fs');
const { constants } = require('fs');
const { copyFile } = require('fs/promises');
const { mkdir } = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join('05-merge-styles/project-dist/bundle.css'), {encoding: 'utf8', flag: {open: 'r+'}})

readdir(path.join('05-merge-styles/styles'), {withFileTypes: true})
.then(result => {
  result.filter(item => {
    return path.extname(item.name) === '.css'
  }).forEach(file => {
    const stream = fs.createReadStream(path.join(`05-merge-styles/styles/${file.name}`), 'utf8');
    stream.on('data', (data) => {
      writeStream.write(`${data}\n`)
    });
  })
}).catch(e => {
  console.log('error: ', e);
})