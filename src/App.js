import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';


const client = axios.create({
    baseURL: process.env.REACT_APP_QUIZ_BANK_QUESTIONS_URL + process.env.REACT_APP_QUIZ_BANK_QUESTIONS_ENDPOINT
});

const GET_LOCATIONS = `
    query Questions {
      questions {
        questionId,
        text,
        choice {
          choiceId,
          text,
          isCorrect
        },
        description,
        imageUrl,
        category
      }
    }
`;

function DisplayLocations() {
    const [questionBank, setQuestionBank] = useState([]);

    useEffect(() => {
        client.post('', {
            "query": GET_LOCATIONS
        }).then((response) => {
            console.log(response)
            setQuestionBank(response.data.data.questions);
        });
    }, []);


    return questionBank.map(({ questionId, text, choice, description, imageUrl, category }) => (
        <tr>
            <td>{questionId}</td>
            <td>{text}</td>
            <td>{description}</td>
            <td>{category}</td>
        </tr>
    ));
}

export default function App() {
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Description</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    <DisplayLocations />
                </tbody>
            </Table>
        </div>
    );
}
