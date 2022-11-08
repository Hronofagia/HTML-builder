const fs = require('node:fs');
const { constants } = require('fs');
const path = require('path');
const { readdir, mkdir, copyFile } = require('fs/promises');
const readline = require('readline');
const { resourceLimits } = require('node:worker_threads');
const { promisify } = require('util');
const rmdir = promisify(fs.rmdir);
const unlink = promisify(fs.unlink);
 

rmdirs('06-build-page/project-dist')
.then(() => mkdir('06-build-page/project-dist', { recursive: true }))
.then(() => {
  deepCopy('06-build-page/assets', '06-build-page/project-dist/assets')
})
.then(() => {
  mergeHtml()
})
.then(() => {
  mergeCSS()
})


function mergeHtml() {
  let html 
  const stream = fs.createReadStream(path.join('06-build-page/template.html'), 'utf8');
  let re = /{{\w+}}/gi
  stream.on('data', async (data) => {
  
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
}


 function mergeCSS() {
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
  })})
  .catch(e => {
    console.log('error: ', e);
  })
}

async function rmdirs(dir) {
  let entries = []
  try {
    entries= await readdir(dir, { withFileTypes: true });
  } catch(e) {
    console.log('no file');
  }
    
  await Promise.all(entries.map(entry => {
    let fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? rmdirs(fullPath) : unlink(fullPath);
  }));
  try {
    await rmdir(dir);
  } catch(e) {
    console.log('no dir');
  }
};


async function deepCopy(src,dest) {
    const entries = await readdir(src, {withFileTypes: true});
    await mkdir(dest, { recursive: true });
    for(let file of entries) {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        file.isDirectory() ? (await deepCopy(srcPath, destPath)) : (await copyFile(srcPath, destPath));
    }
}