import express from 'express';
import bodyParser from 'body-parser';

const articlesInfo = {
    'learn-react': {
        upvotes: 0,
        comments: []
    },
    'learn-node': {
        upvotes: 0,
        comments: []
    },
    'learn-angular': {
        upvotes: 0,
        comments: []
    }
}

const app = express();

app.use(bodyParser.json());

app.get('/hello', (req, res) => res.send('Hello!'));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}!`));

app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}`));

app.post('/api/articles/:name/upvotes', (req, res) => {
    const articleName = req.params.name;

    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`);
})

app.post('/api/articles/:name/addComment', (req, res) => {
    const {username, comment} = req.body;
    const articleName = req.params.name;
    console.log('art: ', articleName);
    articlesInfo[articleName].comments.push({username, comment});

    res.status(200).send(articlesInfo[articleName]);
})

app.listen(8000, () => console.log('Listening on port 8000'));