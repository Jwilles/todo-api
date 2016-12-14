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
	var query = req.query
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === "true") {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === "false") {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = { $like: '%' + query.q + '%'};
	}
	
	db.todo.findAll({where: where}).then(function (todos) {
		if (!todos) {
			return res.status(404).send();
		}	
		return res.json(todos);	
	}, function (e) {
		res.status(500).send();
	});	

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
	
	db.todo.destroy({
		where: {
			id: parseInt(req.params.id, 10)
		}	

	}).then(function (rowsDeleted) {
		
		if (rowsDeleted === 0) {
			 res.status(404).send();
		} else {
			res.status(204).send();
		}

	}, function (error) {
		res.status(500).send();
	});
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};


	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();	
	} 

	db.todo.findById(parseInt(req.params.id, 10)).then(function (todo) {
		if (todo) {
			todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).json(e);
			});		
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	})
});

//POST /users

app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).send(e);
	});


});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Server started on port: ' + PORT);
	});
});

