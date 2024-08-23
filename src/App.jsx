import { useEffect } from 'react'
import { useState } from 'react'
import uniqid from 'uniqid';
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [updatedTitle, setUpdatedTitle] = useState("")
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const data = await fetch("https://jsonplaceholder.typicode.com/posts");
    const json = await data.json();
    setData(json)
  }

  const handlePostAdd =  () => {
    // console.log("data add")
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({ title: newTitle, id: uniqid() }),
      headers: { "Content-type": "application/json", },
    })
    .then((response) => response.json())
    .then((data) => {
      setData((title) => [...title, data]);
    })
    .catch((error) => console.log(error));
    // const json = await newData.json()
    // setData([json,...data ])
    // setNewTitle("")
    // console.log(json, "new title")
  }

  const handleDeleteClick = async (id) => {
    // console.log(id, "id click")
    const deletedData = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    })
    setData(data.filter(elem => elem.id !== id))
  }

  const handleUpdateClick = async (id) => {
    setFlag(true)
    // console.log(id, "updated id")
    const title = data.find(el => el.id === id)
    console.log(title, "updated title")
    const newData = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json", },
      body: JSON.stringify({ title: updatedTitle })
    })
  }
  // console.log(data, "all data")

  return (
    <>
      <ul>
        <input type="text" value={newTitle} onChange={(e) => {
          setNewTitle(e.target.value)
        }} />
        <button onClick={handlePostAdd}>Add data</button>
        {data?.map((elem, id) => (
          <ul className='main' key={elem.id}>
            <li>{elem.title}</li>
            <button onClick={() => handleUpdateClick(elem.id)}>Update</button>
            <button onClick={() => handleDeleteClick(elem.id)}>Delete</button>
            {flag ? <>
              <input type="text" placeholder='updated text' value={elem.title} onChange={(e) => {
                setUpdatedTitle(e.target.value)
              }} />
              <button onClick={() => setFlag(false)}>Done</button>
            </> : ""}
          </ul>
        )
        )}
      </ul>
    </>
  )
}

export default App
