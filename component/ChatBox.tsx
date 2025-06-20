'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Loading from './Loading';

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Chrome or Firefox.');
    }
  }
  , [browserSupportsSpeechRecognition]);

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'hi-IN' });
  };


  const handleStopListening = () => {
    
    SpeechRecognition.stopListening();
    setQuery(transcript);
    sendQuery(transcript);
  };

  const sendQuery = async (userQuery: string) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/chat', { query: userQuery });
      setLoading(false);
      setResponse(res.data.reply);
      speakResponse(res.data.reply);
    } catch (error) {
      console.error('Error sending query:', error);
    }
  };

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
  };

  const cancelSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendQuery(query);
  };

  return ( loading ? <Loading/> :
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Fasal Chat-Assist</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask your crop question..."
        ></textarea>
        <div className="flex space-x-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
          <button
            type="button"
            onClick={listening ? handleStopListening : handleStartListening}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            🎤 {listening ? 'Listening...' : 'Click here'}
          </button>
        </div>
      </form>
        <button
          onClick={cancelSpeech}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel Speech
        </button>
      {response && (
        <div className="bg-gray-100 p-4 rounded">
          <strong>Assistant:</strong> {response}
        </div>
      )}
    </div>
  );
}