const fs = require('node:fs');
const { constants } = require('fs');
const { copyFile } = require('fs/promises');
const { mkdir } = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const readline = require('readline');
const { resourceLimits } = require('node:worker_threads');

mkdir('06-build-page/project-dist', { recursive: true }, (err) => {
  if (err) throw err;
});

let html 
const stream = fs.createReadStream(path.join('06-build-page/template.html'), 'utf8');
let re = /{{\w+}}/gi
stream.on('data', (data) => {
  html = data
  let fileName = data.match(re).map(el => el.slice(2, el.length - 2))
  fileName.forEach((el) => {
    const internalReadStream = fs.createReadStream(path.join(`06-build-page/components/${el}.html`), 'utf8')
    internalReadStream.on('data', (dataInfo) => {
      html = html.replace(`{{${el}}}`, dataInfo)
      const createHTML = fs.createWriteStream(path.join('06-build-page/project-dist/index.html'), {encoding: 'utf8', flag: {open: 'r'}})
      createHTML.write(html)
    }) 
  })
});

const writeStream = fs.createWriteStream(path.join('06-build-page/project-dist/style.css'), {encoding: 'utf8', flag: {open: 'r+'}})

readdir(path.join('06-build-page/styles'), {withFileTypes: true})
.then(result => {
  result.filter(item => {
    return path.extname(item.name) === '.css'
  }).forEach(file => {
    const style = fs.createReadStream(path.join(`06-build-page/styles/${file.name}`), 'utf8');
    style.on('data', (data) => {
      writeStream.write(`${data}\n`)
    });
  })
}).catch(e => {
  console.log('error: ', e);
})


mkdir('06-build-page/project-dist/assets', { recursive: true }, (err) => {
  if (err) throw err;
});
mkdir('06-build-page/project-dist/assets/fonts', { recursive: true }, (err) => {
  if (err) throw err;
});
mkdir('06-build-page/project-dist/assets/img', { recursive: true }, (err) => {
  if (err) throw err;
});
mkdir('06-build-page/project-dist/assets/svg', { recursive: true }, (err) => {
  if (err) throw err;
});

readdir(path.join('06-build-page/project-dist/assets/fonts'))
.then(result => {
  result.forEach(file => {
    copyFile(path.join(`06-build-page/assets/fonts/${file}`), path.join(`06-build-page/project-dist/assets/fonts/${file}`));
  })
}).catch(e => {
  console.log('error: ', e);
})