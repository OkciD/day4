'use strict';

// Подключаем модули
let express = require('express');
let app = express();
let pg = require('pg');

// Разрешаем междоменные запросы
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Описываем функцию создания нового клиента для подключения к БД
function createNewClient() {
	return new pg.Client({
		user: 'postgres',
		host: '10.0.0.83',
		database: 'my_database',
		password: '12345',
		port: 5432
	});
}

// Описываем функцию отправки запроса в БД и получения ответа от неё
function makeQuery(query, resultObj, callback) {
	const client = createNewClient();
	client.connect();

	client.query(query, (err, res) => {
		resultObj.arr = res.rows;
		client.end();
		callback();
	});
}

// Создаем таблицу med_params
makeQuery('CREATE TABLE IF NOT EXISTS med_params (med_param_id BIGSERIAL PRIMARY KEY, med_param TEXT, med_param_value FLOAT);', {}, () => {
	console.log('table medParametrs was created')
});

// HELLO NODE API
app.get('/', (request, response) => {
	response.end('Team02 server');
});

// Описываем функцию для мед парамера и его значения в БД
app.post('/data', (request, response) => {
	console.log('POST ONE RECORD');

	let bigString = '';
	request.on('error', (err) => {
		console.error(err);
	}).on('data', (data) => {
		bigString += data;
	}).on('end', () => {
		response.on('error', (err) => {
			console.error(err);
		});

		const dataObj = JSON.parse(bigString);

		const medParam = dataObj.parameter;
		const value = dataObj.value;

		if (['pulse', 'calories', 'meditation', 'distance'].indexOf(medParam) === -1) {
			const errorAnswer = {
				message: 'parameter must belong to enum'
			};
			response.statusCode = 400;
			response.end(JSON.stringify(errorAnswer));
		}

		makeQuery("INSERT INTO med_params (med_param, med_param_value) VALUES ('" + medParam + "', " + value + ");", {}, () => {
			const answer = {
				message: 'ADDING_SUCCESS'
			};
			response.end(JSON.stringify(answer));
		});
	});
});

app.get('/data', (request, response) => {
	const offset = +request.query.offset || 0;
	const limit = +request.query.limit || 2;

	let queryResult = {};
	makeQuery('SELECT (med_param, med_param_value) FROM med_params OFFSET ' + offset + ' LIMIT ' + limit, queryResult, () => {
		response.end(JSON.stringify(queryResult.arr));
	});
});

// Запускаем сервер
const port = 80;
app.listen(port);
console.log(`Server works on port ${port}`);

