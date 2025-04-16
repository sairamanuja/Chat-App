import React from 'react';
import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef(null);
  const inputRef = useRef();

  const connectToRoom = () => {
    const ws = new WebSocket("https://chat-app-p36c.onrender.com");

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId }
      }));
      setConnected(true);
    };

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {!connected ? (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Enter a Room ID to Join</h2>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room ID"
            className="p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={connectToRoom}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className='h-[500px] w-[350px]  bg-white rounded-lg shadow-lg flex flex-col'>
          <div className='bg-blue-500 text-white p-4 rounded-t-lg'>
            <h1 className='text-xl font-bold text-center'>Room: {roomId}</h1>
          </div>

          <div className='flex-1 p-4 overflow-y-auto'>
            {messages.map((message, index) => (
              <div key={index} className='mb-4'>
                <span className='inline-block bg-blue-500 text-white rounded-lg p-3 max-w-[70%] break-words'>
                  {message}
                </span>
              </div>
            ))}
          </div>

          <div className='w-full bg-gray-200 p-4 rounded-b-lg'>
            <div className='flex flex-col sm:flex-row gap-2'>
              <input
                ref={inputRef}
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Type a message..."
              />
              <button
                onClick={() => {
                  const message = inputRef.current?.value;
                  if (message) {
                    wsRef.current.send(JSON.stringify({
                      type: "chat",
                      payload: { message }
                    }));
                    inputRef.current.value = '';
                  }
                }}
                className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors'
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
