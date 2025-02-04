import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseCookies } from "nookies";
import bcrypt from "bcryptjs-react";

type RouteMiddlewareProps = {
  children: JSX.Element;
};

export const ProtectedRoute = ({ children }: RouteMiddlewareProps) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setIsVerified(true);
    }
  }, [navigate]);

  if (!isVerified) return null; // Pode exibir um spinner aqui, se desejar
  return children;
};

export const PublicRoute = ({ children }: RouteMiddlewareProps) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      navigate("/", { replace: true });
    } else {
      setIsVerified(true);
    }
  }, [navigate]);

  if (!isVerified) return null;
  return children;
};

export const AdminRoute = ({ children }: RouteMiddlewareProps) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedCargo = localStorage.getItem("flag"); // Supondo que "flag" armazene "admin" ou "membro"
    if (storedCargo && bcrypt.compareSync("admin", storedCargo)) {
      setIsVerified(true);
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!isVerified) return null;
  return children;
};