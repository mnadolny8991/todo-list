import './LoginForm.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function LoginForm({ setToken }) {
    const [input, setInput] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState(false);

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const resp = await fetch(
                'http://localhost:9000/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(input)
                }
            );
            if (resp.ok) {
                const token = await resp.text();
                setToken(token);
                setError(false);
                console.log(token);
            } else {
                console.log('error');
                setError(true);
            }
        } catch (e) {
            setError(true);
        }
    }

    return (
        <form className='container login-form' onSubmit={e => handleSubmit(e)}>
            <h1 className='login-form__heading'>Login</h1>
            { error && <p className='login-form__error'>Please enter correct username and password</p> }
            <input 
                className='login-form__input' 
                type='text'
                name='login'
                value={input.login}
                placeholder='Login'
                required
                minlength='4'
                onChange={e => handleChange(e)}>
            </input>
            <input 
                className='login-form__input' 
                type='password'
                name='password'
                value={input.password}
                placeholder='Password'
                minlength='5'
                required
                onChange={e => handleChange(e)}>
            </input>
            <Link to='#' className='login-form__link'><small>Forgot Password?</small></Link>
            <button 
                className='login-form__btn'
                type='submit'
                >
                Login
            </button>
            <small className='login-form__aside'>Don't have an account? <Link 
                className='login-form__link' to='#'>Signup</Link></small>
        </form>
    ); 
}

export default LoginForm;