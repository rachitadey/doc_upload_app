import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { useState } from "react";
import "../src/styles/App.css";
import LoginContainer from "./modules/Login/Container/LoginContainer";
import UplaodingDocContainer from "./modules/UploadingDoc/Container/UplaodingDocContainer";



const MainContent = () => {
  const isAuthenticated = useIsAuthenticated();
  return (
      <div className="App">
          <AuthenticatedTemplate>
              <UplaodingDocContainer />
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
              <LoginContainer/>
          </UnauthenticatedTemplate>
      </div>
  );
};

// export function App() {
//   // const [isLoggedIn, setIsLoggedIn] = useState(
//   //   localStorage.getItem("isLogin") === "Yes" ? true : false
//   // );
  
//   const isAuthenticated = useIsAuthenticated();
//   console.log('isAuthenticated', isAuthenticated);

//   return isAuthenticated ? (
//     <UplaodingDocContainer
      
//     ></UplaodingDocContainer>
//   ) : (
//     <LoginContainer></LoginContainer>
//   );
//   // return (
//   // <MainContent/>
//   // );
// }

// export default App;

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return isLoggedIn ? (
    <UplaodingDocContainer
      setIsLoggedIn={setIsLoggedIn}
    ></UplaodingDocContainer>
  ) : (
    <LoginContainer setIsLoggedIn={setIsLoggedIn}></LoginContainer>
  );
}