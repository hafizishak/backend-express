import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();

const withDB = async (operations, res) => {
    try{
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true});
        const db = client.db('my-blog');

        await operations(db);

        client.close();        
    }catch(error){
        res.status(500).json({ message: 'Error connecting to db', error });
    }
}

app.use(bodyParser.json());

app.get('/hello', (req, res) => res.send('Hello!'));
app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}!`));

app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}`));

app.get('/api/articles/:name', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;

        const articleInfo = await db.collection('articles').findOne({name: articleName});
        res.status(200).json(articleInfo);        
    }, res) 
})

app.post('/api/articles/:name/upvotes', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName});

        await db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                upvotes: articleInfo.upvotes + 1,
            },
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName});
        
        res.status(200).json(updatedArticleInfo);
    }, res)
})

app.post('/api/articles/:name/addComment', async (req, res) => {
    withDB(async (db) => {
        const {username, comment} = req.body;
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName});

        await db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                comments: articleInfo.comments.concat({username, comment})
            },
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName});
        
        res.status(200).json(updatedArticleInfo);
    }, res)
})

app.listen(8000, () => console.log('Listening on port 8000'));