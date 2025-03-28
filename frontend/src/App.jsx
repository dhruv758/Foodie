import { Route, Routes } from "react-router-dom";
import SignInForm from "./Authentication/Page/SignInForm";
import Register from "./Authentication/Components/Register";
import Login from "./Authentication/Components/Login";
import ForgotPassword from "./Authentication/Components/forgotPassword/ForgotPassword";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInForm />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
