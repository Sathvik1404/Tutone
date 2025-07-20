import React, { useState } from 'react';
import VoiceInput from './VoiceInput';

const VoiceTestPage = () => {
    const [text, setText] = useState('');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-blue-800 mb-4">🎤 Voice to Text Tester</h1>
                <VoiceInput onResult={setText} />
                <div className="mt-6">
                    <p className="text-gray-600">Final Result:</p>
                    <p className="mt-2 p-3 bg-gray-100 rounded text-blue-800 font-medium">{text || 'Speak something...'}</p>
                </div>
            </div>
        </div>
    );
};

export default VoiceTestPage;
