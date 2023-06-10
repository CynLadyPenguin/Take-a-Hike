const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Stories, saveStory } = require('../models/stories.js');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getStory = async (word) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Topic: ${word}. Add a Title followed by a colon, then write a horror story that is exactly two paragraphs:`,
    temperature: 0.8,
    max_tokens: 250,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });
  return response.data;
}

// router.post('/:id', async (req, res) => {
//   const { title, story } = req.body;
//   const { id } = req.params;
//   try {
//     await saveStory(title, story.join(''), id);
//     res.sendStatus(201);
//   } catch (err) {
//     console.error('Failed to SAVE story to DB at server:', err);
//     res.sendStatus(500);
//   }
// });

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  try {
    const story = await getStory(prompt);
    res.status(201).send(story);
  } catch (err) {
    console.error('Failed to POST prompt to API at server:', err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const stories = await Stories.findAll({ where: { user_id: id } });
    console.log(stories)
    res.status(200).send(stories);
  } catch (err) {
    console.error('Failed to GET stories from DB:', err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  const { title, story } = req.body;
  const { id } = req.params;
  try {
    const storyDB = await Stories.findOne({ where: {user_id: id, title}});
    if (storyDB) {
      storyDB.update({ story: story.join('') });
      res.sendStatus(204);
    } else {
      await saveStory(title, story.join(''), id);
      res.sendStatus(201);
    }
  } catch (err) {
    console.error('Failed to UPDATE story to DB at server:', err);
    res.sendStatus(500);
  }
});

router.delete('/:id/:title', async (req, res) => {
  const { id, title } = req.params;
  console.log(title);
  try {
    const storyDB = await Stories.findOne({ where: {user_id: id, title}});
    if (storyDB) {
      await storyDB.destroy();
      res.sendStatus(200);
    } else {
      console.error('Failed to find user story at DB');
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Failed to DELETE story to DB at server:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
