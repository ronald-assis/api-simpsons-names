const fs = require('fs/promises');
const { networkInterfaces } = require('os');

const getSimpsons = async () => {
  const readFile = await fs.readFile('./simpsons.json', 'utf-8');
  const fileContent = await JSON.parse(readFile);

  return fileContent;
}

const setSimpsons = (newSimpson) => {
  return fs.writeFile('./simpsons.json', JSON.parse(newSimpson));
}

module.exports = {getSimpsons, setSimpsons}