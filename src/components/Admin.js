import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';

function Admin() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ id: '', title: '', author: '', description: '', availability: true, year: '', imageUrl: '' });
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const firestore = getFirestore();
      const booksCollection = collection(firestore, 'books');
      const booksSnapshot = await getDocs(booksCollection);
      const booksData = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
    } catch (error) {
      console.log('Error fetching books:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const firestore = getFirestore();
      const bookRef = doc(firestore, 'books', bookId);
      const bookSnapshot = await getDoc(bookRef);

      if (bookSnapshot.exists()) {
        const bookData = bookSnapshot.data();
        if (!bookData.availability) {
          swal({
            title: 'Libro no disponible',
            text: 'Este libro no está disponible o está prestado. ¿Estás seguro de que deseas eliminarlo?',
            icon: 'warning',
            buttons: ['Cancelar', 'Eliminar'],
            dangerMode: true,
          }).then(async (confirmed) => {
            if (confirmed) {
              await deleteDoc(bookRef);
              console.log('Libro eliminado correctamente');
              fetchBooks();
            } else {
              console.log('Eliminación cancelada');
            }
          });
          return; // Si el usuario cancela la eliminación, salimos de la función
        }

        await deleteDoc(bookRef);
        console.log('Libro eliminado correctamente');
        fetchBooks();
      } else {
        console.log('El libro no existe en la base de datos');
      }
    } catch (error) {
      console.log('Error al eliminar el libro:', error);
    }
  };

  const handleAddBook = async () => {
    try {
      const firestore = getFirestore();
      const booksCollection = collection(firestore, 'books');
      const newBookData = {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        availability: newBook.availability,
        year: newBook.year,
        imageUrl: newBook.imageUrl,
      };
      await addDoc(booksCollection, newBookData);
      console.log('Libro agregado correctamente');
      fetchBooks();
      setNewBook({ title: '', author: '', description: '', availability: true, year: '', imageUrl: '' });
    } catch (error) {
      console.log('Error adding book:', error);
    }
  };

  const handleEditBook = async () => {
    try {
      const firestore = getFirestore();
      const bookRef = doc(firestore, 'books', editBook.id);
      await updateDoc(bookRef, {
        title: editBook.title,
        author: editBook.author,
        description: editBook.description,
        availability: editBook.availability, // No se necesita modificar aquí
        year: editBook.year,
        imageUrl: editBook.imageUrl,
      });
      console.log('Libro actualizado correctamente');
      fetchBooks();
      setEditBook(null);
    } catch (error) {
      console.log('Error updating book:', error);
    }
  };

  const handleChange = (e) => {
    if (editBook) {
      setEditBook({ ...editBook, [e.target.name]: e.target.value });
    } else {
      setNewBook({ ...newBook, [e.target.name]: e.target.value });
    }
  };

  const handleEditButtonClick = (book) => {
    setEditBook(book);
  };

  const handleCancelButtonClick = () => {
    setEditBook(null);
  };

  return (    

    <div className="container">
      <h2>{editBook ? 'Editar Libro' : 'Agregar Libro'}</h2>
      <div>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editBook ? editBook.title : newBook.title}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="author">Autor:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={editBook ? editBook.author : newBook.author}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={editBook ? editBook.description : newBook.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="availability">Disponibilidad:</label>
          <select
            id="availability"
            name="availability"
            value={editBook ? editBook.availability : newBook.availability}
            onChange={handleChange}
            className="form-control"
          >
            <option value={true}>Disponible</option>
            <option value={false}>No disponible</option>
          </select>
        </div>
        <div>
          <label htmlFor="year">Año:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={editBook ? editBook.year : newBook.year}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="imageUrl">URL de la imagen:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={editBook ? editBook.imageUrl : newBook.imageUrl}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          {editBook ? (
            <div>
              <button onClick={handleEditBook} className="btn btn-primary">
                Guardar
              </button>
              <button onClick={handleCancelButtonClick} className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          ) : (
            <button onClick={handleAddBook} className="btn btn-primary my-2">
              Agregar
            </button>
          )}
        </div>
      </div>
      <div className="container">
        <h2>Gestionar Libros</h2>
        <div className="table-responsive">
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Descripción</th>
                <th>Disponibilidad</th>
                <th>Año</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.description}</td>
                  <td>{book.availability ? 'Disponible' : 'No disponible'}</td>
                  <td>{book.year}</td>
                  <td>
                    <Button onClick={() => handleDeleteBook(book.id)} variant="danger" className="mx-2">
                      Eliminar
                    </Button>
                    <Button onClick={() => handleEditButtonClick(book)} variant="primary">
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;