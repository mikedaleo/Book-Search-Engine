import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { Navigate, useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { userId } = useParams();
  const userData = useQuery(GET_ME);
  console.log(userData);
  const [removeBook] = useMutation(
    REMOVE_BOOK, {
    refetchQueries: [{ query: GET_ME }]
  });


  if (Auth.loggedIn() && Auth.getProfile().data._id === userId) {
    return <Navigate to="/saved" />;
  }

  if (userData.loading) {
    return <div>Loading...</div>;
  }

  if (userData.error) {
    return <div>Error loading saved books.</div>;
  }

  if (!userData.data.me?.username) {
    return (
      <h4> You need to be logged in to see your saved books.</h4>
    );
  }


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.data.me.savedBooks.length
            ? `Viewing ${userData.data.me.savedBooks.length} saved ${userData.data.me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.data.me.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
