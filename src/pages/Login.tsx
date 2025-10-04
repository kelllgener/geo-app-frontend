import { useContext, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Form/Input";
import { AuthContext } from "../contexts/AuthContext"; // adjust path if needed

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      // login() already redirects to /home inside AuthContext
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow mt-20">
      <div className="w-96 p-4 shadow-xl">
        {error && (
          <div className="alert alert-error mb-4">
            <div>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-row justify-center mb-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Geo-App Login
          </h2>
        </div>

        <form className="flex flex-col gap-2 justify-center" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <Button
            type="submit"
            label="Login"
            className="mt-2 px-4 py-2 bg-black hover:bg-black/80 text-white text-sm w-full justify-center"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
