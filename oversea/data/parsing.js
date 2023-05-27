const fs = require('fs');

const input = fs.readFileSync('./source/NAS', 'utf8').trim().split('\n');

fs.writeFileSync(
  './code',
  input
    .map((e) => e.split('\t'))
    .map((e) => [e[2], e[4], e[6]].join('\t'))
    .join('\n'),
  'utf8',
);
