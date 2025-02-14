import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";

const API_URL = 'https://serversventv.vercel.app';
// const API_URL = 'http://localhost:3000';

export function getAPIClient(ctx = undefined) {
  const { "nextauth.token": token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      // Se existir token, adiciona o header Authorization
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  // Interceptor para capturar erros de resposta
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        // Exemplo: se o token estiver expirado ou inválido, trata o erro 401
        if (error.response.status === 401) {
          // Se estiver no lado do cliente, pode destruir o cookie e redirecionar o usuário para login
          if (typeof window !== "undefined") {
            destroyCookie(ctx, "nextauth.token");
            // opcionalmente redirecionar para a página de login
            // window.location.href = "/login";
          }
          // Você também pode disparar uma notificação global ou logar o erro
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}

export const api = getAPIClient();
