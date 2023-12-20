const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());

const posts = {};

app
	.route('/posts')
	.get((req, res) => {
		res.send(posts);
	})
	.post(async (req, res) => {
		try {
			const id = randomBytes(4).toString('hex');
			const { title } = req.body;

			posts[id] = { id, title };

			await axios.post('http://localhost:4005/events', {
				type: 'PostCreated',
				data: posts[id],
			});

			res.status(201).send(posts[id]);
		} catch (err) {
			console.log('Posts error', err);
		}
	});

app.post('/events', (req, res) => {
	console.log('Recieved event', req.body.type);

	res.send({});
});

app.listen(port, () => console.log(`Listiening on port : ${port}`));
