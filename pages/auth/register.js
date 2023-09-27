import {useRef,useState,useEffect} from "react";
import {faCheck, faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import axios from './api/axios';




const EMAIL_REGEX = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;;
const REGISTER_URL = 'Auth/register';



const Register = () => {
    const emailRef = useRef();
    const errRef = useRef();

    const[email,setEmail] = useState('');
    const[validEmail,setValidEmail] = useState(false);
    const[emailFocus,setEmailFocus] = useState(false);
    
    const [pwd,setPwd] = useState('');
    const [validPwd,setValidPwd] = useState(false);
    const [pwdFocus,setPwdFocus] = useState(false);

    const[firstname,setFirstName] = useState('');
    const[validFirstname,setValidFirstName] = useState(false);
    const[firstnameFocus,setFirstNameFocus] = useState(false);

    const[lastname,setLastName] = useState('');
    const[validLastname,setValidLastName] = useState(false);
    const[lastnameFocus,setLastNameFocus] = useState(false);


    const [matchPwd,setMatchPwd] = useState('');
    const [validMatch,setValidMatch] = useState(false);
    const [matchFocus,setMatchFocus] = useState(false);

    const [errMsg,setErrMsg] = useState('');
    const [success,setSuccess] = useState(false);

    useEffect(()=>{
        emailRef.current.focus();
    },[])

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    },[email])


    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]); 

    useEffect(()=>{
        setErrMsg('');
    },[email,pwd,matchPwd])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);  // Corrected to use PWD_REGEX
        const v3 = NAME_REGEX.test(firstname);  
        const v4 = NAME_REGEX.test(lastname);  
        if (!v1 || !v2 ||!v3 ||!v4) {
          debugger

            setErrMsg("Geçersiz Giriş");
            return;

        }
        try {
          const response = await axios.post(
            "https://localhost:44374/api/Auth/register",
            JSON.stringify({ email: email, password: pwd, firstname:firstname,lastname:lastname }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
        
          console.log(response.data);
          debugger;
          console.log(JSON.stringify(response.data));
          setSuccess(true);
          // input alanlarını temizle
        } catch (err) {
          if (!err?.response) {
            setErrMsg("Sunucudan Yanıt Alınamadı");
          } else if (err.response?.status === 409) {
            setErrMsg("E-posta Zaten Alınmış");
          } else {
            setErrMsg("Kayıt Başarısız");
          }
          errRef.current.focus();
        }
    }

  return (
    <>
      {success ? (
        <section>
          <h1>Giriş Başarılı</h1>
          <p>
            <a href="#">Giriş Yap</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Kayıt Ol</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstname">
              Adınız:
            </label>
            <input
              type="text"
              id="firstname"
              onChange={(e) => setFirstName(e.target.value)}
              required
              aria-invalid={validFirstname ? "false" : "true"}
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />

            <label htmlFor="lastname">
              Soyadınız:
            </label>
            <input
              type="text"
              id="lastname"
              onChange={(e) => setLastName(e.target.value)}
              required
              aria-invalid={validLastname ? "false" : "true"}
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />

            <label htmlFor="email">
              Email:
              <span className={validEmail ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validEmail || !email ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              @ işareti bulunamlıdır. <br />
            </p>

            <label htmlFor="password">
              Şifre:
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />

            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 karakterden fazla olmalıdır.
              <br />
              Büyük harf küçük harf sayı ve özel karakter içermelidir.
              <br />
              İzin verilen özel karakterler:{" "}
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Şifreyi Tekrarla:
              <span className={validMatch && matchPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />

            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Girilen iki şifre aynı olmalıdır.
              <br />
            </p>

            <button
              disabled={
                !validEmail ||
                !validPwd ||
                !validMatch 
                  ? true
                  : false
              }
            >
              Kayıt Ol
            </button>
          </form>
          <p>
            Hesabınız Var Mı? <br />
            <span className="line">
              {/*ROUTER LİNKİ BURAYA GELECEK */}
              <a href="#">Giriş Yap</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
}

export default Register;
