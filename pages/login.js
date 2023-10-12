import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '@/context/AuthProvider';
import axios from 'axios';
import styles from '@/styles/Login.module.css';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const Login = () => {
  const router = useRouter();
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef(null);
  const errRef = useRef(null);

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
     if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:44374/api/Auth/login', {
        email: email,
        password: pwd,
      }
      );
      const accessToken = response?.data?.token;
      setAuth({ accessToken });
      setEmail('');
      setPwd('');
      const decoded = jwtDecode(accessToken);
      console.log(decoded);
      const nameIdentifier = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];  
      if(nameIdentifier == "admin"){
        setSuccess(true);
        setTimeout(() => {
          router.push('/homepage');
        }, 3000);
      }else {
        alert("Yetkisiz Kullanıcı");
        setSuccess(false); 
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('Sunucudan Yanıt Alınamadı');
      } else if (err.response?.status === 400) {
        setErrMsg('Yanlış Eposta veya Şifre');
      } else if (err.response?.status === 400) {
        setErrMsg('Yetkisiz');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div className={styles.body}>
          <section className={styles.section}>
            <h1 className={styles.a}>Giriş Başarılı</h1>
            <br />
            <p className={styles.a}>
              <NavLink href="/homepage">
                Anasayfaya yönlendiriliyorsunuz
              </NavLink>
            </p>
          </section>
        </div>
      ) : (
        <div className={styles.body}>
          <section className={styles.section}>
            <p
              ref={errRef}
              className={`${errMsg ? styles.errmsg : styles.offscreen}`}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1 className={styles.a}>ZT-SEPET Admin Giriş</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={(styles.label, styles.a)} htmlFor="email">
                Email:
              </label>
              <input
                className={styles.textarea}
                type="text"
                id="email"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <label className={(styles.label, styles.a)} htmlFor="password">
                Şifre:
              </label>
              <input
                className={styles.textarea}
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <button className={styles.button}>Giriş Yap</button>
            </form>
          </section>{" "}
        </div>
      )}
    </>
  );
};

export default Login;
