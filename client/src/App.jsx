
import { lazy, Suspense ,useEffect } from "react";
import {
  BrowserRouter as Router ,Routes , Route
} from "react-router-dom";
import { Loader } from './components/Loader';
import SideBar from './Pages/SideBar/SideBar';
import PageNotFound from "./404/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import { useGetallUsersQuery, useGetProfileQuery, useLoginMutation } from "./RTK/api";
import { getProfileDetails, loginUser, logoutUser } from "./Redux/Reducers/authSlice";
// import Maps from "./Pages/Maps/Maps";
// import Quiz from "./Pages/Quiz/Quiz";
// import GroupChat from "./Pages/Chat/GroupChat";

const Home= lazy(()=> import("./Pages/Home/Home"));
const Users= lazy(()=> import("./Pages/Users/Users"));
const Chat = lazy(()=> import("./Pages/Chat/Chat"));
const GroupChat = lazy(()=> import("./Pages/Chat/GroupChat"));
const Quiz = lazy(()=> import("./Pages/Quiz/QuizPage"));
const Maps = lazy(()=> import("./Pages/Maps/Maps"));



function App() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log("efe");
    // console.log(userId);
    if (userId) {
      dispatch(getProfileDetails(userId));
      dispatch(loginUser(storedUser));
    }
  }, [dispatch, userId]);

  // const {data} = useGetallUsersQuery()
  // console.log(data);


  return (
    <>
      <Router>
      <Suspense fallback={<Loader/>}> 
        <Routes>
          <Route path="/" element={<SideBar> <Home/> </SideBar>} />
          <Route path="/users" element={<SideBar> <Users/> </SideBar>} />
          <Route path="/chat/:id" element={<SideBar> <Chat /> </SideBar>} />
          <Route path="/group-chat" element={<SideBar> <GroupChat /> </SideBar>} />
          <Route path="/maps" element={<SideBar> <Maps/></SideBar>} />
          <Route path="/quiz" element={<SideBar> <Quiz/></SideBar>} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </Suspense>
      </Router>
    </>
  )
}

export default App
