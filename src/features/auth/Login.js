import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation, useRegisterMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';

const Login = () => {
    useTitle('Employee Login/Sign-Up');

    const userRef = useRef(null);
    const errRef = useRef(null);

    const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login and sign-up
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For sign-up only
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isSignupLoading }] = useRegisterMutation();

    // Focus username field on component mount
    useEffect(() => {
        userRef.current?.focus();
    }, []);

    // Clear error message when input fields change
    useEffect(() => {
        setErrMsg('');
    }, [username, password, confirmPassword]);

    const handleToggleMode = () => {
        setIsLoginMode((prev) => !prev);
        setErrMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoginMode && password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }

        try {
            if (isLoginMode) {
                const { accessToken } = await login({ username, password }).unwrap();
                dispatch(setCredentials({ accessToken }));
                navigate('/dash');
            } else {
                await register({ username, password }).unwrap();
                setErrMsg('Account created successfully. You can now log in.');
                setIsLoginMode(true);
            }

            // Clear form inputs
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            const message = err.data?.message || 'An unexpected error occurred';
            setErrMsg(err.status === 401 ? 'Invalid username or password' : message);
            errRef.current?.focus();
        }
    };

    // Handlers for controlled inputs
    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleConfirmPwdInput = (e) => setConfirmPassword(e.target.value);
    const handleTogglePersist = () => setPersist((prev) => !prev);

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    if (isLoginLoading || isSignupLoading) {
        return <PulseLoader color={'#FFF'} />;
    }

    return (
        <section className="public">
            <header>
                <h1>{isLoginMode ? 'Employee Login' : 'Sign-Up'}</h1>
            </header>
            <main className="auth-form">
                <p
                    ref={errRef}
                    className={errClass}
                    aria-live="assertive"
                    tabIndex={-1}
                >
                    {errMsg}
                </p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePwdInput}
                        autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                        required
                    />

                    {!isLoginMode && (
                        <>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                className="form__input"
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPwdInput}
                                autoComplete="new-password"
                                required
                            />
                        </>
                    )}

                    <button className="form__submit-button">
                        {isLoginMode ? 'Sign In' : 'Sign Up'}
                    </button>

                    <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handleTogglePersist}
                            checked={persist}
                        />
                        Trust This Device
                    </label>
                </form>

                <button className="toggle-button" onClick={handleToggleMode}>
                    {isLoginMode
                        ? "Don't have an account? Sign Up"
                        : 'Already have an account? Log In'}
                </button>
            </main>
        </section>
    );
};

export default Login;
