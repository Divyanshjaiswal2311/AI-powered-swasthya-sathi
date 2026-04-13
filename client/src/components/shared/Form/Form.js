import API from "../api/api";

// ✅ LOGIN FUNCTION
export const handleLogin = async (data, dispatch) => {
  try {
    const res = await API.post("/auth/login", data);

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data.user,
      });
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// ✅ REGISTER FUNCTION
export const handleRegister = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("Register error:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};
