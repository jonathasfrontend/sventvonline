import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseCookies } from "nookies";

type RouteMiddlewareProps = {
  children: JSX.Element;
};

/**
 * Componente para rotas protegidas.
 * Se o token não estiver presente, redireciona para "/login".
 */
export const ProtectedRoute = ({ children }: RouteMiddlewareProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return children;
};

/**
 * Componente para rotas públicas.
 * Se o token existir, redireciona para a página principal.
 */
export const PublicRoute = ({ children }: RouteMiddlewareProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  return children;
};
