import React, { useState } from 'react';
import './App.css'

type Message = {
    sender_name: string;
    timestamp_ms: number;
    content: string;
    call_duration: number;
    is_geoblocked_for_viewer: boolean;
    reactions?: any[];
    photos?: any[];
    gifs?: any[];
    share?: undefined;
    videos?: any[];
    is_unsent?: undefined;
    sticker?: undefined;
};

function App() {
  const [messages, setMessages] = useState<Message[]>()
  const updateData = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.currentTarget.files;
    if(files?.length) {
      const reader = new FileReader();
      reader.readAsText(files[0], 'json');

      reader.onload = async () => {
        if(typeof reader.result === 'string') {
          const res = await JSON.parse(reader.result);
          setMessages(res.messages as Message[])
        }
      }
    }
  }

  return (
    <div>
      <input type="file" onChange={updateData} />
      <div>
        {messages?.map((message, idx) => {
          return <Message message={message} key={idx} />
        })}
      </div>
    </div>
  )
}

export default App


const Message = ({message} : {message: Message}) => {
  const date = new Date(message.timestamp_ms);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <div>
      <div><strong>Sent: {message.sender_name}</strong></div>
      <div><small>Date: {`${year}.${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}`}</small></div>
      <div>
        {message.call_duration ?
          <Call call_duration={message.call_duration} />
          :
          <div>
            <div>{message.content}</div>
            <div>{message.photos?.length && '📸'}</div>
            <div>{message.gifs?.length && '🎨'}</div>
            <div>{message.reactions?.length && '😀'}</div>
            <div>{message.videos?.length && '🎥'}</div>
          </div>
        }
      </div>
      <br />
      <br />
    </div>
  )
}

const Call = ({call_duration}: {call_duration: number}) => {
  const hours = Math.floor(call_duration / 60 / 60);
  const minutes = Math.floor(call_duration / 60 % 60);
  const seconds = Math.round(call_duration - hours * 60 * 60 - 60 * minutes);

  return (
    <div>
      <span>Call: 📞</span>
      {hours > 0 && <span> {hours} hours</span>}
      {minutes > 0 && <span> {minutes} minutes</span>}
      <span> {seconds} seconds</span>
    </div>
  )
}