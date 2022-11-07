const path = require('path')

const fs = require('node:fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const process = require('process');

const stream = fs.createWriteStream(path.join('02-write-file/text.txt'), 'utf8')

const rl = readline.createInterface({ input, output });

rl.question('Write something: ', (el) => {stream.write(`${el}\n`)});
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close()
    stream.end()
  } else {
    stream.write(`${input}\n`);
  }
});

process.on('exit', (code) =>
  console.log(`Done`)
  )
