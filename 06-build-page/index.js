const fs = require('node:fs');
const { constants } = require('fs');
const path = require('path');
const { readdir, mkdir, copyFile } = require('fs/promises');
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

async function deepCopy(src,dest) {
    const entries = await readdir(src, {withFileTypes: true});
    await mkdir(dest, { recursive: true });
    for(let file of entries) {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        file.isDirectory() ? (await deepCopy(srcPath, destPath)) : (await copyFile(srcPath, destPath));
    }
}

deepCopy('06-build-page/assets', '06-build-page/project-dist/assets')
