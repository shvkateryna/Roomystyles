import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Rooms from "./Rooms";
import Main_Form from "./Main_Form";
import Curator_menager from "./Curator_menager";
import Main_One from "./Main_One";
import Main_Two from "./Main_Two";
import Main_Two2 from "./Main_Two2";
import Main_General from "./Main_General";
import { Room } from "./Room";
import { useCookies } from "react-cookie";
import { fetcher } from "../services/ApiService";
import "../styles/app.css";
import { CSVParserMain } from "./csv_parser/CSVParserMain";
import GroupDetail from "./csv_parser/GroupDetail";

function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState("");
  const [cookies] = useCookies(["user"]);
  useEffect(() => {
    if (cookies.token) {
      fetcher({ url: "validate_token", body: {}, token: cookies.token })
        .then((res) => {
          setAuth(true);
          setLoading(false);
          setRole(res.data);
        })
        .catch(() => {
          setAuth(false);
          setLoading(false);
        });
    } else {
      setAuth(false);
      setLoading(false);
    }
  }, [cookies]);

  return (
    <div>
      <div className="w-100 h-100 outer">
        <Routes>
          <Route path="/login" element={<Login />} />
          {loading ? (
            <>
              <Route path="/" element={<span class="loader"></span>} />
            </>
          ) : (
            <>
              {auth ? (
                <>
                  {role === "ADMIN" ? (
                    <>
                    <Route path="/csv_parser" element={<CSVParserMain />} />
                    <Route path="/csv_parser/:number" element={<GroupDetail />} />

                      <Route
                        path="/:number"
                        element={<Room role={role} user_id={1} />}
                      />
                      <Route
                        exact
                        path="/manager"
                        element={<Curator_menager role={role} />}
                      />
                    </>
                  ) : (
                    <>
                      <Route
                        path="/:number"
                        element={<Room role={role} user_id={1} />}
                      />
                      <Route path="/csv_parser" element={<CSVParserMain />} />
                      <Route path="/csv_parser/:number" element={<GroupDetail />} />

                    </>
                  )}
                  <Route
                    exact
                    path="/"
                    element={<Rooms role={role} user_id={1} />}
                  />
                </>
              ) : (
                <>
                  <Route path="/" element={<Navigate to="/login" />} />
                </>
              )}
            </>
          )}

          <Route path="/rooms/:id_coded" element={<Main_Form />} />
          <Route path="/rooms/:id_coded/general" element={<Main_General />} />
          <Route path="/rooms/:id_coded/one" element={<Main_One />} />
          <Route path="/rooms/:id_coded/two" element={<Main_Two />} />
          <Route path="/rooms/:id_coded/two2" element={<Main_Two2 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
