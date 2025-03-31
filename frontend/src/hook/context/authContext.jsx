import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    email: null,
    token: "",
  });

  const updateAuth = async () => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        email: parseData.email,
        token: parseData.token,
      });
    }
  };
  useEffect(() => {
    updateAuth();
  }, []);

  const logout = ()=>{
    setAuth({email:"", token:""})
    localStorage.removeItem('auth');
  }

  const login = (email , token)=>{
    console.log("auth context")
    console.log(email, token);
    setAuth[{email , token}]
    localStorage.setItem('auth' , JSON.stringify({email , token})); 
  }

  return (
    <AuthContext.Provider value={{login , logout}}>
      {children}
    </AuthContext.Provider>
  );
};

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };