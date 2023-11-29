import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ErrorPage from '../components/ErrorPage';
import Header from '../components/Header'
import { RegisterData } from '../models/Model'

interface Props {
    checkTokenValidation: () => Promise<boolean>
}

const Register: React.FC<Props> = ({ checkTokenValidation }) => {
    var navigation = useNavigate();
    const [inputFields, setInputFields] = useState<RegisterData>({ username: "", email: "", confirmEmail: "", password: "", confirmPassword: "", country: "" });
    const [authorized, setAuthorized] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const checkFields = (initial: string, check: string) => {
        return initial === check;
    }

    const checkPasswordSecure = (pass: string) => {
        if((pass.length < 16) || !(/[A-Z]/.test(pass)) || !(/[\W_]/.test(pass))) {
            return false;
        }
        return true;
    }

    const checkEmailValid = (email: string) => {
        if(/^[^@\s]+@[^@\s]+\.(com|net|org|gov|nl|be|uk)/.test(email)) {
            return true;
        }
        return false;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!checkEmailValid(inputFields.email)) {
            setError('Email is not valid');
            return;
        } else if(!(checkPasswordSecure(inputFields.password))) {
            setError("password must have at least 16 characters, one special character and an uppercase letter");
            console.log("not secure")
            return;
        }

        if(!checkFields(inputFields.email, inputFields.confirmEmail)) {
            setError('Emails do not match!');
            return;
        } else if(!checkFields(inputFields.password, inputFields.confirmPassword)) {
            setError('Passwords do not match!');
            return;
        }
        
        var result = await fetch('apiUser/SignIn/register', {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            email: inputFields.email,
            password: inputFields.password,
            username: inputFields.username,
            country: inputFields.country
          })
        })

        console.log(result);

        if(result.status === 200) {
            navigation(-1)
        }
    }
    
    useEffect(() => {
        const checkValid = async () => {
            setAuthorized(await checkTokenValidation());
        }

        checkValid();
    }, [])
    
    if(authorized) {
        return <ErrorPage />
    }

    return (
    <div>
        <Header />
        <form className='register-form' onSubmit={(e) => onSubmit(e)}>
            <div className="register-form__error">{error}</div>
            <input type="text" className='register-form__input' placeholder='username' onChange={(e) => setInputFields({...inputFields, username: e.target.value})}/>
            <input type="email" className='register-form__input' placeholder='email' onChange={(e) => setInputFields({...inputFields, email: e.target.value})}/>
            <input type="email" className="register-form__input" placeholder='confirm email' onChange={(e) => setInputFields({...inputFields, confirmEmail: e.target.value})}/>
            <input type="password" className="register-form__input" placeholder='password' onChange={(e) => setInputFields({...inputFields, password: e.target.value})}/>
            <input type="password" className="register-form__input" placeholder='confirm password' onChange={(e) => setInputFields({...inputFields, confirmPassword: e.target.value})}/>
            <input type="text" className='register-form__input' placeholder='country' onChange={(e) => setInputFields({...inputFields, country: e.target.value})}/>
            <input type="submit" className="register-form__submit" value="submit"/>
        </form>
    </div>
    )
}

export default Register