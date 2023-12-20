const express = require('express');
const axios = require('axios');

const app = express();
const port = 4005;
app.use(express.json());

const events = [];

app.get('/events', (req, res) => {
	console.log('events', events);

	res.send(events);
});

app.post('/events', (req, res) => {
	try {
		const event = req.body;

		events.push(event);

		axios
			.post('http://localhost:4000/events', event)
			.catch((err) => console.log('Event bus error ' + port, err));
		axios
			.post('http://localhost:4001/events', event)
			.catch((err) => console.log('Event bus error ' + port, err));

		axios
			.post('http://localhost:4002/events', event)
			.catch((err) => console.log('Event bus error ' + port, err));

		axios
			.post('http://localhost:4003/events', event)
			.catch((err) => console.log('Event bus error ' + port, err));

		res.send({ status: 'Ok' });
	} catch (err) {
		console.log(err);
	}
});

app.listen(port, () => console.log(`Listiening on port : ${port}`));
