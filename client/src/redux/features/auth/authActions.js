import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";
import { checkServerConnection, getNetworkErrorMessage } from "../../../utils/serverCheck";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      // Ensure role is defined and is a string
      if (!role || typeof role !== 'string') {
        return rejectWithValue("Please select a valid role");
      }
      
      // Basic validation
      if (!email || !password) {
        return rejectWithValue("Please provide both email and password");
      }

      // Check server connection first
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        return rejectWithValue("Cannot connect to server. Please check your internet connection or try refreshing the page.");
      }

      // Safely normalize role - add additional safety check
      const normalizedRole = (role && typeof role === 'string') ? role.toLowerCase().trim() : 'donar';
      
      console.log('Attempting login with:', { role: normalizedRole, email });
      const { data } = await API.post("/auth/login", { role: normalizedRole, email, password });
      console.log('Login response:', data);
      
      if (data.success) {
        // ✅ Don't show toast here - let Form.js handle it
        localStorage.setItem("token", data.token);
        window.location.replace("/dashboard");
      } else {
        return rejectWithValue(data.message || "Login failed");
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(getNetworkErrorMessage(error));
    }
  }
);

//register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      role,
      email,
      password,
      phone,
      organisationName,
      address,
      hospitalName,
      website,
    },
    { rejectWithValue }
  ) => {
    try {
      // Ensure role is defined and is a string
      if (!role || typeof role !== 'string') {
        return rejectWithValue("Please select a valid role");
      }
      
      // Basic validation
      if (!email || !password) {
        return rejectWithValue("Please provide both email and password");
      }

      // Normalize role to lowercase for consistency - add defensive check
      const normalizedRole = (role && typeof role === 'string') ? role.toLowerCase().trim() : 'donar';

      // Role-specific validation
      if ((normalizedRole === "user" || normalizedRole === "admin" || normalizedRole === "donar") && !name) {
        return rejectWithValue("Please provide your name");
      }
      if (normalizedRole === "organisation" && !organisationName) {
        return rejectWithValue("Please provide organisation name");
      }
      if (normalizedRole === "hospital" && !hospitalName) {
        return rejectWithValue("Please provide hospital name");
      }

      // Check server connection first
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        return rejectWithValue("Cannot connect to server. Please check your internet connection or try refreshing the page.");
      }

      console.log('Attempting registration with:', { role: normalizedRole, email });
      
      // Log the full request body for debugging
      const requestBody = {
        name: name || '',
        role: normalizedRole,
        email,
        password,
        phone: phone || '',
        organisationName: organisationName || '',
        address: address || '',
        hospitalName: hospitalName || '',
        website: website || '',
      };
      console.log('Registration request body:', requestBody);
      
      // Make the API request
      const { data } = await API.post("/auth/register", requestBody);
      console.log('Registration response:', data);

      if (data?.success) {
        // ✅ Don't show toast here - let Form.js handle it
        window.location.replace("/login");
      } else {
        return rejectWithValue(data?.message || "Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Use utility function for error messaging
      return rejectWithValue(getNetworkErrorMessage(error));
    }
  }
);

//current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching current user');
      const res = await API.get("/auth/current-user");
      console.log('Current user response:', res.data);
      
      if (res.data) {
        return res?.data;
      }
      return rejectWithValue("Failed to get user data");
    } catch (error) {
      console.error('Get current user error:', error);
      return rejectWithValue(getNetworkErrorMessage(error));
    }
  }
);
