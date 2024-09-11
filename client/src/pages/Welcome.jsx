import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Welcome = ({ userName, setUserName, room, setRoom, setSocket }) => {
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    if (
      userName.trim().length > 0 &&
      room !== "select-room" &&
      room.trim().length > 0
    ) {
      const socket = io.connect("http://localhost:4000");
      setSocket(socket);
      navigate("/chat", { replace: true });
    } else {
      alert("Failed user auth!");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-5xl font-bold text-center text-blue-500 mb-6">
          Room.io
        </h2>
        <form onSubmit={joinRoom}>
          <div className="mb-3">
            <input
              className="border-2 border-blue-500 outline-none p-2.5 rounded-lg w-full text-base font-medium"
              placeholder="username..."
              type="text"
              id="username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              onChange={(e) => setRoom(e.target.value)}
              name="room"
              id="room"
              className="border-2 border-blue-500 rounded-lg w-full font-medium focus:ring-blue-500 block p-2.5 text-center"
            >
              <option value="select-room">---- Select Room ----</option>
              <option value="javascript"> Javascript </option>
              <option value="react"> React </option>
              <option value="node"> Node </option>
            </select>
          </div>
          <button className="text-base text-center text-white bg-blue-500 py-3.5 rounded-lg font-medium  w-full">
            Join Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default Welcome;
