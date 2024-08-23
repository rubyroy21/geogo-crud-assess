import React, { useState, useEffect } from "react";
import uniqid from "uniqid";

function App() {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setPosts(data.slice(0, 10)))
      .catch((error) => console.error("Error fetching posts:", error));
  };

  const handlePostAdd = () => {
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({ title: newTitle }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((data) => {
        const addedPost = { ...data, id: uniqid() };
        setPosts((prevPosts) => [...prevPosts, addedPost]);
        setNewTitle("");
      })
      .catch((error) => console.log(error.message));
  };

  const handleDeleteClick = (id) => {
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  const handleUpdateClick = (id, currentTitle) => {
    setEditingId(id);
    setUpdatedTitle(currentTitle);
  };

  const handleUpdateSubmit = (id) => {
    const updatedPost = { id, title: updatedTitle };

    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(updatedPost),
    })
      .then(() => {
        setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
        setEditingId(null);
        setUpdatedTitle("");
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple CRUD App</h1>

      {/* Create new post */}
      <div>
        <input
          type="text"
          placeholder="New post title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={handlePostAdd}>Add Post</button>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "10px" }}>
            {editingId === post.id ? (
              <>
                {/* Update post */}
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <button onClick={() => handleUpdateSubmit(post.id)}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {post.title}
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleUpdateClick(post.id, post.title)}
                >
                  Edit
                </button>
                {/* Delete Post */}
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleDeleteClick(post.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
