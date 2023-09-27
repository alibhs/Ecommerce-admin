import React, { useRef, useState, useEffect,useContext } from 'react';
import AuthContext from './context/AuthProvider';
import axios from './api/axios';
import Layout from '@/components/Layout';

const Login = () => {
 const {setAuth} = useContext(AuthContext);
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [goToProducts,setGoToProducts] = useState(false);


  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
    const response = await axios.post(
      "https://localhost:44374/api/Auth/login",
      JSON.stringify({ email: email, password: pwd }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log(JSON.stringify(response?.data));
    const accessToken = response?.data?.accessToken;
    setAuth({email,pwd,accessToken}); //
    setEmail('');
    setPwd('');
    setSuccess(true);
    setGoToProducts(true);
    } catch (err) {
        if(!err?.response){
            setErrMsg("No Server Response");
        }else if(err.response?.status === 400){
            setErrMsg('Yanlış Eposta veya Şifre');
        }else if(err.response?.status === 400){
            setErrMsg('Yetkisiz');
        } else{
            setErrMsg('Login Failed');
        }
        errRef.current.focus();
    }
    
      
  }

  return (
    <>
    {success ? (
      router.push("/")

    ) :
   ( <section>
      <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
        {errMsg}
      </p>
      <h1>Giriş Yap</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Giriş Yap</button>
        <p>
          Hesabınız yok mu?<br />
          <span className="line">
            {/* ROOT ROUTER LİNKİ GEİECEK*/}
            <a href="#">Kayıt Ol</a>
          </span>
        </p>
      </form>
    </section>) 
}
</>
  )
};

export default Login;
