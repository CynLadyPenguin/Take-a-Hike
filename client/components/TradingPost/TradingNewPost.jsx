import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TradingNewPost = () => {

  const [postImg, setPostImg] = useState(null);

  const [postTexts, setPostTexts]
  = useState({ title: '', location: '', description: '', price: '' });

  const handlePostInput = (e) => {
    const { name, value } = e.target;
    setPostTexts((postTexts) => {
      return { ...postTexts, [name]: value, };
    });
    console.log(postTexts)
  };

  const handlePostSubmit = () => {
    //Need to get the user data
  }


  return (
    <div className="new-trading-post">
      <form className="box" onSubmit={ () => console.log('Submitted') }>

        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input
              type="text"
              placeholder="Title"
              className="card"
              value={ postTexts.title }
              onChange={ handlePostInput }
              name="title"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Meetup Location</label>
          <div className="control">
            <input
              type="text"
              placeholder="Meetup Location"
              className="card"
              value={ postTexts.location }
              onChange={ handlePostInput }
              name="location"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Price</label>
          <div className="control">
            <h8>$ </h8>
            <input
              type="text"
              placeholder="Price"
              className="card"
              value={ postTexts.price }
              onChange={ handlePostInput }
              name="price"
            />
          </div>
        </div>

        <div className="field">
  <label className="label">Description</label>
  <div className="control">
    <div style={{ display: "flex" }}>
      <input
        type="image"
        // src=""
        width="80"
        height="60"
        style={{ marginRight: "8px" }}
      />
      <input
        type="text"
        placeholder="Describe Your Goods"
        className="card"
        value={ postTexts.description }
        onChange={ handlePostInput }
        name="description"
        style={{ height: "80px", width: "200px" }}
      />
    </div>
  </div>
</div>


        <input
          type="submit"
          value="Send New Post"
          className="button black-button"
        />
      </form>
    </div>
  );

}

export default TradingNewPost;