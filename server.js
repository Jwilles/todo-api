var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app =express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	var queryParams =req.query;
	var filteredTodos = todos;
	
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos  = _.where(todos, { completed: true})
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
			filteredTodos  = _.where(todos, { completed: false})
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos  = _.filter(todos, function (todo) {
				return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}


	if (!filteredTodos) {
		return res.status(400).send();
	} 

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	
	db.todo.findById(parseInt(req.params.id, 10)).then(function(todo) {
		if (!todo) {
			return res.status(404).send();
		}
			return res.json(todo.toJSON());
	}, function (error) {
		res.status(500).send();
	});
});

//POST /todos
app.post('/todos', function (req,res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (error) {
		res.status(400).json(error);
	});
	
});

//DELETE /todos/:id
app.delete('/todos/:id', function (req,res) {
	var matchedTodo = _.findWhere(todos,{ id: parseInt(req.params.id, 10)});
	if (!matchedTodo) {
		return res.status(400).send();
	}
	todos.splice(todos.indexOf(matchedTodo), 1);

	res.send(matchedTodo);		
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id, 10) });	
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}
	
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();	
	}

	if (body.hasOwnProperty('description') && _.isString(body.completed) && !body.description.trim().length === 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();	
	} 
	
	 _.extend(matchedTodo, validAttributes);
//	todos[todos.indexOf(matchedTodo)] = updatedTodo;
	res.json(body); 

});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Server started on port: ' + PORT);
	});
});

