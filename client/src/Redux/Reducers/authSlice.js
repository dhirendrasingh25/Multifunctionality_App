import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { server } from "@/main";
// const toast = useToast();

const initialState = {
  user: null,
  isAdmin: false,
  loading: true,
};

// const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
//   try {
//     const config = {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const { data } = await axios.post(
//       `${server}/api/v1/admin/verify`,
//       { secretKey },
//       config
//     );

//     return data.message;
//   } catch (error) {
//     throw error.response.data.message;
//   }
// });

// const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
//   try {
//     const { data } = await axios.get(`${server}/api/v1/admin/`, {
//       withCredentials: true,
//     });

//     return data.admin;
//   } catch (error) {
//     throw error.response.data.message;
//   }
// });

export const getProfileDetails = createAsyncThunk("profile/:id", async (id) => {
  try {
    const { data } = await axios.get(`${server}/api/v1/user/profile/${id}`, {
      withCredentials: true,
    });
    // console.log(data);
    return data.user;
  } catch (error) {
    console.log(error);
    throw error.response.data.message;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        // toast.success(action.payload);
      })
      .addCase(getProfileDetails.rejected, (state, action) => {
        state.user = null;
        // toast.error(action.error.message);
      });

    //       .addCase(getAdmin.rejected, (state, action) => {
    //         state.isAdmin = false;
    //       })
    //       .addCase(adminLogout.fulfilled, (state, action) => {
    //         state.isAdmin = false;
    //         toast.success(action.payload);
    //       })
    //       .addCase(adminLogout.rejected, (state, action) => {
    //         state.isAdmin = true;
    //         toast.error(action.error.message);
    //       });
  },
});

export default authSlice;
export const { loginUser, logoutUser } = authSlice.actions;
