var express = require('express');
var app =express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1, 
	description: 'Meet mom for lunch',
	completed: false	
}, {
	id: 2,
	description: 'Go to the market',
	completed: false
}, {
	id: 3,
	description: 'Eat roast beef',
	completed: true
}];


app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var match;
	todos.forEach(function(todo) {
		if (todo.id === parseInt(req.params.id, 10)) {
			match = todo;
		}
	});
	if (!match) {
		res.status(404).send('404 page not found');
	} else {
		res.json(match);
	}
});


app.listen(PORT, function () {
	console.log('Server started on port: ' + PORT);
});
