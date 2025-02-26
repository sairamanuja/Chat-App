import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState(["Hello from server!"]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data]);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "123"
        }
      }));
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className='h-[75%] w-[50%] bg-white rounded-lg shadow-lg flex flex-col'>
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
          <div className='flex gap-2'>
            <input
              ref={inputRef}
              id="message"
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={() => {
                const message = inputRef.current?.value;
                if (message) {
                  wsRef.current.send(JSON.stringify({
                    type: "chat",
                    payload: {
                      message: message
                    }
                  }));
                  inputRef.current.value = ''; // Clear input after sending
                }
              }}
              className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors'
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;