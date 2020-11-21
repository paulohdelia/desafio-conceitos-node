const express = require('express');
const cors = require('cors');

const { v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  request.repositoryIndex = repositoryIndex;
  next();
}

app.use('/repositories/:id', validateRepositoryExists);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request;

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
