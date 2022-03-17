const express = require('express');
const cors = require('cors');
const rescue = require('express-rescue');

const authMiddleware = require('./authMiddleware');
const simpsonsUtils = require('./fs-utils');

const app = express();
app.use(cors('*'));
app.use(express.json());
app.use(authMiddleware);

const APP_PORT = 3333;

app.get('/ping', (req, res) => res.json({message: 'pong'}))

app.post('/hello' , (req, res) => {
  const { name } = req.body;
  return res.status(200).json({message: `Hello, ${name}!`});
})

app.post('/greetings', (req,res) => {
  const {name, age} = req.body;

  if (age <= 17) return res.status(401).json({message: 'Unauthorized'});
  
  return res.status(200).json({name, age});
})

app.put('/userd/:name/:age', (req, res) => {
  const {name, age} = req.params;
  res.status(200).json({message: `Seu nome é ${name} e você tem ${age} anos de idade`})
})

app.get('/simpsons', rescue(async (req, res) => {
  const simpsons = await simpsonsUtils.getSimpsons();

  res.status(200).json(simpsons);
}))

app.get('/simpsons/:id', rescue(async (req, res) => {
  const simpsons = await simpsonsUtils.getSimpsons();
  const simpson = simpsons.find(({id}) => id === req.params.id)

  if (!simpson) return res.status(404).json({message: 'simpson not found'})

  return res.status(200).json(simpson)
}));

app.post('/simpsons', rescue(async (req, res) => {
  const { id, name} = req.body;
  const simpsons = await simpsonsUtils.getSimpsons();

  if (simpsons.map(({ id }) => id).includes(id)) {
    return res.status(409).json({message: 'id already exists'})
  }

  simpsons.push({id, name})

  await simpsonsUtils.setSimpsons(simpsons);

  res.status(204).end()
  
}))

app.use(function (err, req, res, next) {
  res.status(500).send(`Algo deu errado! Mensagem: ${err.message}`);
});

app.listen(APP_PORT, () => console.log(`Rodando na porta: ${APP_PORT}`))