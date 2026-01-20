import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../../api/requester";
import { UserContext } from "../../context/UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const data = { email, password };
        const response = await api.login(data);
        
        if (response && response.ok) {
            const userData = await response.json();
            console.log('Login successful, user data:', userData);
            setUser(userData);
            navigate("/account");
        } else {
            // Fetch user data after successful login
            const userData = await api.getUser();
            if (userData) {
                console.log('Fetched user data after login:', userData);
                setUser(userData);
                navigate("/account");
            }
        }
    };

    useEffect(() => {
        const emptyInputs = !email && !password;

        setIsEmpty(emptyInputs);
    }, [email, password]);

    return (
        <div className="max-w-global mx-auto flex justify-center mt-20">
            <div className="flex flex-col">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md"
                    action="POST"
                >
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <button disabled={isEmpty} className="primary mt-5">
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    Dont have an account?{" "}
                    <Link className="font-semibold underline" to={"/register"}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
