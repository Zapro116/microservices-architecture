const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 4002;
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

const handleEvents = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		console.log(post);

		post.comments.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		const comment = post.comments.find((comment) => comment.id === id);
		comment.status = status;
		comment.content = content;
	}
};

app.post('/events', (req, res) => {
	try {
		const { type, data } = req.body;

		handleEvents(type, data);

		console.log(posts);

		res.send({});
	} catch (err) {
		console.log('er', err);
	}
});

app.listen(port, async () => {
	console.log(`Listiening on port : ${port}`);
	const res = await axios.get('http://localhost:4005/events');
	console.log('res');

	for (let event of res.data) {
		console.log('processing event', event.type);
		handleEvents(event.type, event.data);
	}
});
