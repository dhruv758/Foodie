import { Route, Routes } from "react-router-dom";
import SignInForm from "./Authentication/Page/SignInForm";
import Register from "./Authentication/Components/Register";
import Login from "./Authentication/Components/Login";
import ForgotPassword from "./Authentication/Components/forgotPassword/ForgotPassword";
import HomePage from "./HomePage/page/HomePage";
import SearchResPage from "./SearchResPage/page/SearchResPage";
import PollPage from "./PollPage/page/PollPage";

import EmailApproval from "./emailReply/AcceptEmail";
import EmailReject from "./emailReply/RejectEmail";
import SummaryPage from "./Summary/SummaryPage";
import UserInfo from "./Userinfo/Page/Userinfo";

import RestaurantMenuPage from "./SearchResPage/page/RestaurantMenuPage";
import ProtectedRoute from "./components/protectedRoute";
import DefaultComponent from "./components/defaultComponent";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInForm />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/approve-accept" element={<EmailApproval />} />
        <Route path="/approve-reject" element={<EmailReject />} />
        <Route element={<ProtectedRoute />}>
            <Route  path="/home" element={<HomePage/>}/>
            <Route  path="/search" element={<SearchResPage/>}/>
            <Route path="/restaurant/:restaurantId" element={<RestaurantMenuPage />} />

            <Route path="/summary/:pollId" element={<SummaryPage />} />
            <Route path="/poll/:pollId/users" element={<UserInfo />} />
            <Route path="/polls" element={<PollPage />} />
          </Route>
        <Route path="*" element={<DefaultComponent/>}/>

      </Routes>
    </>
  );
}

export default App;
