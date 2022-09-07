const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({error: "Customer not found"});
  }

  request.user = user;
  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui

  const {name, username} = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({error: "Customer already exists!"})
  }

  users.push({id: uuidv4(), name, username, todos: []})

  return response.status(201).send();
});

app.get('/users', (request, response) => {
  return response.json(users)
})

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {title, deadline} = request.body;
  const {user} = request;

  user.todos.push({id: uuidv4(), title, done: false, deadline: new Date(deadline), created_at: new Date()});

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const {id} = request.params;
  const {user} = request;

  if (!id) {
    return response.status(400).json({error: 'You need to specify an ID'})
  }

  const validId = user.todos.find((todo) => todo.id === id);

  if (!validId) {
    return response.status(400).json({error: 'Invalid ID'})
  }

  user.todos.map((todo) => {
    if (todo.id === id) {
      todo.title = title,
      todo.deadline = deadline
    }
  })

  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {id} = request.params;
  const {user} = request;

  if (!id) {
    return response.status(400).json({error: 'You need to specify an ID'})
  }

  const validId = user.todos.find((todo) => todo.id === id);

  if (!validId) {
    return response.status(400).json({error: 'Invalid ID'})
  }

  user.todos.map((todo) => {
    if (todo.id === id) {
      todo.done = true
    }
  })

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {id} = request.params;
  const {user} = request;

  if (!id) {
    return response.status(400).json({error: 'You need to specify an ID'})
  }

  const validId = user.todos.find((todo) => todo.id === id);

  if (!validId) {
    return response.status(400).json({error: 'Invalid ID'})
  }

  user.todos.splice(id, 1);

  return response.status(204).json(user.todos);
});

module.exports = app;