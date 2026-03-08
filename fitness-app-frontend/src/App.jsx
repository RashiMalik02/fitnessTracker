import { BrowserRouter as Router, Navigate , Route , Routes , useLocation } from "react-router-dom"
import { AccordionDetails, Box, Button } from "@mui/material"
import { useEffect, useState, useContext} from "react"
import { useDispatch } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";

const ActivitesPage = () => {
  return (
    <Box component="section" sx={{p: 2, border: "1px solid gray"}}>
        <ActivityForm onActivitiesAdded = {() => window.location.reload()}/>
        <ActivityList/>
    </Box>
  )
}


function App() {
  const {token, tokenData, logIn, logOut, isAuthenticated} = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);


  useEffect(() => {
  if (token && tokenData?.sub) {
    dispatch(setCredentials({ token, user: tokenData }));
    setAuthReady(true);
  }
}, [token, tokenData, dispatch]);
  
  return (
    <Router>
      {!token ? (
        <Button variant="contained" color="primary" size="large" onClick={() => {
                  console.log("Logging in...");
                  logIn();
                }}>LOGIN</Button>
              ): (
                <div>
                  {/* <pre>
                    {JSON.stringify(tokenData, null, 2)}
                    {JSON.stringify(token, null, 2)}
                  </pre> */}

                  <Box component="section" sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Routes>
                          <Route path="/activites" element={<ActivitesPage/>}/>
                          <Route path="/activites/:id" element={<AccordionDetails/>}/>

                          <Route  path="/" element={token ? <Navigate to="/activites" replace/> : <div>Welcome! please login</div>} />

                          </Routes>
                    </Box>
                </div>
              )}
    </Router>
  )
}

export default App
