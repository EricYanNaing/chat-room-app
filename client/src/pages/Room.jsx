import { useEffect, useRef, useState } from "react";
import {
  ArrowRightEndOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Room = ({ userName, room, socket }) => {
  const navigate = useNavigate();
  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");
  const boxDivRef = useRef();

  const sendMessage = () => {
    if (message.trim().length > 0) {
      socket.emit("message_send", message);
      setMessage("");
    }
  };

  const getOldMessage = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/chat/${room}`);
    if (response.status === 403) {
      return navigate("/");
    }
    const data = await response.json();
    console.log(data);
    setReceivedMessages((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    getOldMessage();
  }, []);

  useEffect(() => {
    socket.emit("joined_room", { userName, room });
    socket.on("message", (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    socket.on("room_users", (data) => {
      let prevRoomUsers = [...roomUsers];
      data.forEach((user) => {
        const index = prevRoomUsers.findIndex(
          (prevUser) => prevUser.id === user.id
        );

        if (index !== -1) {
          prevRoomUsers[index] = { ...prevRoomUsers[index], ...data };
        } else {
          prevRoomUsers.push(user);
        }
        setRoomUsers(prevRoomUsers);
      });
    });
    return () => socket.disconnect();
  }, [socket]);

  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(() => {
    if (boxDivRef.current) {
      boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
    }
  }, [receivedMessages]);
  return (
    <section className="flex gap-4 h-screen relative">
      {/* left side  */}
      <div className="bg-blue-500 w-1/3 text-white font-medium pt-5">
        <p className="text-3xl font-bold text-center mt-5">Room.io</p>
        <div className="mt-10 ps-2">
          <p className="text-lg flex items-end gap-1">
            <ChatBubbleLeftRightIcon width={30} /> Room Name
          </p>
          <p className="text-blue-500 bg-white ps-5 py-2 rounded-tl-full rounded-bl-full my-2">
            {room}
          </p>
        </div>
        <div className="mt-5 ps-2">
          <p className="text-lg flex items-end gap-1">
            <UserGroupIcon width={30} /> Users
          </p>
          {roomUsers.map((user, i) => (
            <p className="flex items-end gap-1 text-sm my-1" key={i}>
              <UserIcon width={24} />{" "}
              {user.username === userName ? "You" : user.username}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={leaveRoom}
          className="absolute bottom-0 flex items-center gap-1 w-full mx-2 mb-4 p-2.5 text-lg"
        >
          <ArrowRightEndOnRectangleIcon width={30} /> Leave Room
        </button>
      </div>
      {/* right side  */}
      <div className="pt-5 w-full relative">
        <div className="h-[30rem] overflow-y-auto" ref={boxDivRef}>
          {receivedMessages.map((message, i) => (
            <div
              key={i}
              className="text-white bg-blue-500 px-3 py-2 w-3/4 rounded-br-3xl rounded-tl-3xl my-3"
            >
              <p className="text-sm font-medium font-mono">
                {message.username}
              </p>
              <p className="text-lg font-medium">{message.message}</p>
              <p className="text-sm font-mono font-medium text-right">
                {formatDistanceToNow(new Date(message.send_at))}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 my-2 py-2.5 flex items-end w-full px-2">
          <input
            onChange={(e) => setMessage(e.target.value)}
            placeholder="message..."
            type="text"
            value={message}
            className="w-full outline-none border-b text-lg me-2 p-2"
          />
          <button type="button" onClick={sendMessage}>
            <PaperAirplaneIcon
              width={30}
              className="hover:text-blue-500 hover:-rotate-45 duration-200"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Room;
