import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bulma/css/bulma.min.css';

const Story = ( { id }) => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState([]);
  const [editedStory, setEditedStory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [userStories, setUserStories] = useState([]);

  const getUserStories = async () => {
    try {
      const response = await axios.get(`/api/stories/${id}`);
      setUserStories(response.data);
    } catch (err) {
      console.error('Failed to GET stories from DB at client:', err);
    }
  };

  useEffect (() => {
    getUserStories();
  }, []);

  const handleInput = (e) => {
    const { value } = e.target;
    setPrompt(value);
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/stories', { prompt });
      const story = response.data.choices[0].text;
      setTitle(story.split(':')[0].trim());
      const paragraphs = story.split(':')[1].split('\n');
      setStory(paragraphs);
      setEditedStory(paragraphs);
    } catch (err) {
      console.error('Failed to POST story to API at client:', err);
    }
  }

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
    setStory(editedStory);
    setTitle(title);
  }

  const handleSaveToggle = () => {
    setIsEditing(prevState => !prevState);
    setStory(editedStory);
    setTitle(title);
    saveStory();
    getUserStories();
  }

  const saveStory = async () => {
    try {
      await axios.put(`/api/stories/${id}`, {story: editedStory, title});
    } catch (err) {
      console.error('Failed to SAVE story to DB at client:', err);
    }
  }

  const handleEdit = (e) => {
    const { value } = e.target;
    setEditedStory(value.split('\n'));
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/stories/${id}/${title}`);
      setTitle('');
      setStory([])
      getUserStories();
    } catch (err) {
      setTitle('');
      setStory([]);
      console.error('Failed to DELETE story at client:', err);
    }
  };

  const getStory = (e) => {
    const { innerText } = e.target;
    setTitle(innerText);
    const clickedStory = userStories.map(story => innerText === story.title ? story.story : null)
    setStory(clickedStory);
    setEditedStory(clickedStory);
  }

  return (
    <>
      <div className="split-screen" style={{ display: "flex", maxWidth: '800px' }}>
        <div className="block">
        <div className="left-panel"
          style={{
            flex: "0 0 40%",
            background: "#f1f1f1",
            padding: "20px",
          }}>
            {userStories.map((story, i) => (
            <p
            style={{
              cursor: "pointer",
              fontStyle: "italic"
             }}
            onClick={getStory}
            key={i}
            >
              {story.title}
            </p>
            ))}
            </div>
            <div className="block" style={{ display: "flex", alignItems: "center" }}>
              <input className="input is-small" type="text" placeholder="Enter a story prompt!" onChange={handleInput} />
              <button style={{marginLeft: '3px'}} className="button is-info is-small" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
        <div
          className="right-panel"
          style={{
            flex: "1",
            padding: "20px",
          }}
        >
          <p align="center">{title}</p>
          {isEditing ? (
          <div>
            <textarea
            className="textarea"
            value={editedStory.join('')}
            onChange={handleEdit}
            rows={10}
            cols={100}
            />
            <div style={{ textAlign: "right" }}>
              <button className="button is-primary is-small" onClick={handleSaveToggle} style={{ marginTop: '10px' }}>Save</button>
            </div>
          </div>
          ) : (
          <div>
            {story.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <div style={{ textAlign: "right" }}>
              {story.length > 0 ? <button className="button is-warning is-small" onClick={handleEditToggle}>Edit</button> : null}
              {story.length > 0 ? <button className="button is-danger is-small" onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button> : null}
            </div>
          </div>
           )}
        </div>
      </div>
    </>
  );
}

export default Story;
