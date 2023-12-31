const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const port = 4001;
const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app
	.route('/posts/:id/comments')
	.get((req, res) => {
		res.send(commentsByPostId[req.params.id] || []);
	})
	.post(async (req, res) => {
		const commentId = randomBytes(4).toString('hex');
		const { content } = req.body;

		const comments = commentsByPostId[req.params.id] || [];
		comments.push({ id: commentId, content, status: 'pending' });
		commentsByPostId[req.params.id] = comments;

		await axios.post('http://localhost:4005/events', {
			type: 'CommentCreated',
			data: {
				id: commentId,
				content,
				postId: req.params.id,
				status: 'pending',
			},
		});

		res.status(201).send(comments);
	});

app.post('/events', async (req, res) => {
	console.log('Recieved event', req.body.type);

	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		const { postId, id, status, content } = data;

		const comments = commentsByPostId[postId];
		const comment = comments.find((comment) => comment.id === id);
		comment.status = status;
		console.log('CommentModerated', {
			postId,
			id,
			status,
			content,
			comment,
		});

		await axios
			.post('http://localhost:4005/events', {
				type: 'CommentUpdated',
				data: {
					id,
					status,
					postId,
					content,
				},
			})
			.catch((err) => console.log('err', err));
	}
});

app.listen(port, () => console.log(`Listiening on port : ${port}`));
