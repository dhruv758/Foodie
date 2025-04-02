import { Route, Routes } from "react-router-dom";
import SignInForm from "./Authentication/Page/SignInForm";
import Register from "./Authentication/Components/Register";
import Login from "./Authentication/Components/Login";
import ForgotPassword from "./Authentication/Components/forgotPassword/ForgotPassword";
import HomePage from "./HomePage/page/HomePage";
import SearchResPage from "./SearchResPage/page/SearchResPage";
import UserInfo from "./UserInfo/Page/UserInfo"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInForm />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route  path="/home" element={<HomePage/>}/>
        <Route  path="/search" element={<SearchResPage/>}/>
        <Route path="/userinfo" element={<UserInfo/>}/>
      </Routes>
    </>
  );
}

export default App;
