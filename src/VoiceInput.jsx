import React, { useState } from 'react';

const VoiceInput = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support speech recognition.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            setTranscript(speechResult);
            onResult(speechResult); // Pass result to parent
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <button
                onClick={startListening}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                🎤 {isListening ? 'Listening...' : 'Start Voice'}
            </button>
            {transcript && <p className="text-sm text-gray-700">📝 {transcript}</p>}
        </div>
    );
};

export default VoiceInput;
