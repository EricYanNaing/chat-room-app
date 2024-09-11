import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/welcome";
import Room from "./pages/Room";
import { useState } from "react";

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Welcome
          userName={userName}
          setUserName={setUserName}
          room={room}
          setRoom={setRoom}
          setSocket={setSocket}
        />
      ),
    },
    {
      path: "chat",
      element: <Room userName={userName} room={room} socket={socket} />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
