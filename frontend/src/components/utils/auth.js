const USER = "admin123";
const PASS = "admin123";

export const login = (username, password) => {
  if (username === USER && password === PASS) {
    localStorage.setItem("token", "usuario-autenticado");
    return { success: true, message: "Autenticación exitosa." };
  }
  return { success: false, message: "Credenciales incorrectas." };
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
