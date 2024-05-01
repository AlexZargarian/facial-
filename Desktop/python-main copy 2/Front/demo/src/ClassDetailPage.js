import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClassDetailPage() {
    const location = useLocation();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const { title } = location.state || {};

    const startRecognition = () => {
        axios.post('http://localhost:8081/start-recognition')
            .then(response => {
                alert('Recognition started');
                // You can navigate to another route if necessary
                // navigate('/some-other-route');
            })
            .catch(error => {
                console.error('Error starting recognition:', error);
                alert('Error starting recognition');
            });
    };

    return (
        <div className="container mt-5">
            <h1>{title}</h1>
            <button onClick={startRecognition} className="btn btn-primary">Start Facial Recognition</button>
        </div>
    );
}

export default ClassDetailPage;
