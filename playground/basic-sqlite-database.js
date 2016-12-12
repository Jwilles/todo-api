var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
//	force: true
}).then(function () {
	console.log('Everything is synced');
	
	Todo.findById(2).then(function (todo) {
		if (todo) {
			return	console.log(todo.toJSON());
		}
		return console.log('no todo found');
	}, function (error) {
		console.log(error);
	});
	

	
//	Todo.create({
//		description: "walk the dog",
//	}).then(function () {
//		return  Todo.create({
//			 description: 'get the mail'
//		});
//	}).then(function() {
//		return Todo.findAll({
//			where: {
//				description: {
//					$like: '%Mail%'
//				}
//			}	
//		})
//	}).then(function(todos) {
//		if (todos) {
//			todos.forEach(function (todo) {
//				console.log(todo.toJSON());
//			});
//		} else {
//			console.log('no todo found');
//		}
//	}).catch(function(e){
//		console.log(e);
//	});

});	
