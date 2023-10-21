import Layout from "@/components/Layout";
import AuthContext from "@/context/AuthProvider";7
import jwtDecode from "jwt-decode";
import { useContext } from "react";


const Homepage = () => {
  const {auth} = useContext(AuthContext);
  const decoded = jwtDecode(auth.accessToken);
  const userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  
    return <Layout>
    <h1 className="text-blue-900">
      Hoşgeldiniz {userName}
    </h1> 
  </Layout>
}

export default Homepage;
