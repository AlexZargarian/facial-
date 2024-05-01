 import React, { useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function ClassDetailPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [recognitionResults, setRecognitionResults] = useState([]);

    const startRecognition = () => {
        setIsRecording(true);
        axios.post('http://localhost:8081/start-recognition')
            .then(response => {
                alert('Recognition started');
                setRecognitionResults(response.data.results);
            })
            .catch(error => {
                console.error('Error starting recognition:', error);
                alert('Error starting recognition');
                setIsRecording(false);
            });
    };

    const stopRecognition = () => {
        setIsRecording(false);
        // Optionally inform the server to stop the recognition process
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <div className="container mt-5">
            <h1>Facial Recognition</h1>
            {isRecording ? (
                <>
                    <Webcam
                        audio={false}
                        height={720}
                        width={1280}
                        videoConstraints={videoConstraints}
                    />
                    <div>
                        {recognitionResults.map((result, index) => (
                            <div key={index}>{result}</div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Webcam is off</p>
            )}
            <button onClick={startRecognition} className="btn btn-primary">
                Start Facial Recognition
            </button>
            <button onClick={stopRecognition} className="btn btn-secondary">
                Stop Facial Recognition
            </button>
        </div>
    );
}

export default ClassDetailPage;