
import { lazy, Suspense ,useEffect } from "react";
import {
  BrowserRouter as Router ,Routes , Route
} from "react-router-dom";
import { Loader } from './components/Loader';
import SideBar from './Pages/SideBar/SideBar';
import PageNotFound from "./404/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import { useGetProfileQuery, useLoginMutation } from "./RTK/api";
import { getProfileDetails, loginUser, logoutUser } from "./Redux/Reducers/authSlice";
import axios from "axios";
import { server } from "./main"
const Home= lazy(()=> import("./Pages/Home/Home"));



function App() {
  // const { user, loading } = useSelector((state) => state.auth);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;
  // const [loginUserMutation] = useLoginMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log("efe");
    // console.log(userId);
    if (userId) {
      dispatch(getProfileDetails(userId));
    }
  }, [dispatch, userId]);

 
  // console.log(user);
  // useEffect(() => {
  //   axios
  //     .get(`${server}/api/v1/user/profile/${ userId}`, 
  //       { headers:"Content-Type: application/json",
  //         withCredentials: true }
  //     )
  //     .then(({ data }) => loginUserMutation(data))
  //     .catch((err) => console.log(err));
  // }, [userId]);
  return (
    <>
      <Router>
      <Suspense fallback={<Loader/>}> 
        <Routes>
          <Route path="/" element={<SideBar> <Home/> </SideBar>} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </Suspense>
      </Router>
    </>
  )
}

export default App
