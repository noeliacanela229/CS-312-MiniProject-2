const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const JOKE_API = 'https://v2.jokeapi.dev/joke';

app.get('/', (req, res) => {
  res.render('index', { error: null });
});

app.post('/joke', async (req, res) => {
  const name = req.body.name;
  const category = req.body.category || 'Any';
  
  if (!name) {
    return res.render('index', { error: 'Please enter your name!' });
  }

  try {
    const jokeResponse = await axios.get(`${JOKE_API}/${category}?safe-mode`);
    const jokeData = jokeResponse.data;

    let jokeText;
    let isPunchline = false;
    
    if (jokeData.type === 'twopart') {
      jokeText = jokeData.setup;
      isPunchline = true;
    } else {
      jokeText = jokeData.joke;
      isPunchline = false;
    }

    res.render('joke', {
      name: name,
      category: jokeData.category,
      jokeText: jokeText,
      punchline: isPunchline ? jokeData.delivery : null,
      error: null
    });

  } catch (error) {
    res.render('index', { error: 'Unable to fetch a joke. Please try again!' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});