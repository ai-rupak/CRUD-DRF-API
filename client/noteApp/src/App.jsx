import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/books/");
      const data = await response.json();
      console.log(data);
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async () => {
    const bookData = {
      title: title,
      release_year: parseInt(releaseYear),
    };
    try {
      const response = await fetch("http://localhost:8000/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) => [...prev, data]);
      setTitle("");
      setReleaseYear("");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };
    try {
      const response = await fetch(
        `http://localhost:8000/api/book-edit/${pk}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        }
      );
      const data = await response.json();

      setBooks((prev) => prev.map((book) => (book.id === pk ? data : book)));
      setNewTitle("");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteBook = async (pk) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/book-edit/${pk}/`,
        {
          method: "DELETE",
        }
      );
      // const data = await response.json();
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Book Website</h1>
      <div className="app">
        {/* <label>Name</label> */}
        <input
          type="text"
          value={title}
          placeholder="Enter book name"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {/* <label>Date</label> */}
        <input
          type="number"
          placeholder="Enter release date.."
          onChange={(e) => setReleaseYear(e.target.value)}
          required
        />
        <button
          onClick={addBook}
          value={releaseYear}
          className="btn"
          disabled={!title || !releaseYear}
          style={{
            backgroundColor: !title || !releaseYear ? "gray" : "aqua",
            color: !title || !releaseYear ? "#CCC" : "black",
            cursor: !title || !releaseYear ? "not-allowed" : "pointer",
          }}
        >
          Add Book
        </button>
      </div>
      <div className="books">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} className="uss">
              <p>Title: {book.title}</p>
              <p>Release Date: {book.release_year}</p>
              <input
                type="text"
                placeholder="Edit Name.."
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                className="btn"
                onClick={() => updateTitle(book.id, book.release_year)}
              >
                Edit
              </button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </>
  );
}

export default App;
