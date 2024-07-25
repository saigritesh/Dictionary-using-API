const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/define', async (req, res) => {
    const word = req.query.word;
    if (!word) {
        res.redirect('/');
        return;
    }
    const apiKey = 'YOUR_API_KEY';  // Replace with your dictionary API key
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await axios.get(url);
        const definition = response.data[0].meanings[0].definitions[0].definition;
        res.send(`
            <html>
                <head>
                    <title>Dictionary</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <nav>
                        <a href="/">Home</a>
                        <a href="#suggestions">Suggestions</a>
                    </nav>
                    <h1>Dictionary</h1>
                    <form action="/define" method="post">
                        <input type="text" name="word" placeholder="Enter a word" required>
                        <button type="submit">Search</button>
                    </form>
                    <div class="result">
                        <h2>Definition of ${word}:</h2>
                        <p>${definition}</p>
                    </div>
                    <div class="suggestions" id="suggestions">
                        <h3>Try these words:</h3>
                        <ul>
                            <li><a href="/define?word=example">example</a></li>
                            <li><a href="/define?word=education">education</a></li>
                            <li><a href="/define?word=technology">technology</a></li>
                            <li><a href="/define?word=innovation">innovation</a></li>
                            <li><a href="/define?word=creativity">creativity</a></li>
                        </ul>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        res.send(`
            <html>
                <head>
                    <title>Dictionary</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <nav>
                        <a href="/">Home</a>
                        <a href="#suggestions">Suggestions</a>
                    </nav>
                    <h1>Dictionary</h1>
                    <form action="/define" method="post">
                        <input type="text" name="word" placeholder="Enter a word" required>
                        <button type="submit">Search</button>
                    </form>
                    <div class="result">
                        <h2>Word not found</h2>
                    </div>
                    <div class="suggestions" id="suggestions">
                        <h3>Try these words:</h3>
                        <ul>
                            <li><a href="/define?word=example">example</a></li>
                            <li><a href="/define?word=education">education</a></li>
                            <li><a href="/define?word=technology">technology</a></li>
                            <li><a href="/define?word=innovation">innovation</a></li>
                            <li><a href="/define?word=creativity">creativity</a></li>
                        </ul>
                    </div>
                </body>
            </html>
        `);
    }
});

app.post('/define', (req, res) => {
    const word = req.body.word;
    res.redirect(`/define?word=${word}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
