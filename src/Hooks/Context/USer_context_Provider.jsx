import React, { useEffect, useState } from 'react';
import UserContext from './User_context';
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  GoogleAuthProvider, 
  updateProfile
} from 'firebase/auth';
import app from '../../../Fire_base_config';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const USer_context_Provider = ({ children }) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  // const [meals, setMeals] = useState([]);

  // Create User
  const Create_User = async (data) => {
    const { email,password,fullName,image} = data;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: fullName, photoURL: image
      })
      setUser(user)
      // Add additional user setup logic here if needed.
    } catch (error) {
      // Swal.fire({
      //   icon: "error",
      //   title: "User Creation Failed",
      //   text: error.message,
      // });
    }
  };



//TODO : FETCH ALL MEAL DATA
const { data: meals = [], isLoading, isError, refetch } = useQuery({
  queryKey: ['meals'], // Unique query key
  queryFn: async () => {
    if (!User?.email) {
      throw new Error('User email is required');
    }
    const response = await axios.get(`https://pro12-two.vercel.app/all_meals_by_email/${User.email}` );
    return response.data; // Ensure you return the data
  },
  enabled: !!User?.email, // Ensure the query only runs if User.email is available
});

   






  // Log In User
 // Log In User
const Login = async (user) => {
  const { email, password } = user;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;
    // Swal.fire({
    //   icon: "success",
    //   title: "Login Successful",
    //   text: `Welcome back, ${loggedInUser.email}!`,
    // });
  } catch (error) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Login Failed",
    //   text:" Please try again.",
    // });
  }
};


  // Sign Out
  const signout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
      // Swal.fire({
      //   icon: "success",
      //   title: "Logged Out",
      //   text: "You have been successfully logged out.",
      // });
    } catch (error) {
    }
  };

//   // Google Sign-In
//   const Google_signin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       setUser(user);

//       Swal.fire({
//         icon: "success",
//         title: "Google Login Successful",
//         text: `Welcome, ${user.displayName || "User"}!`,
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Google Login Failed",
//         text: error.message,
//       });
//     }
//   };



//   // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
   
      setLoading(false);
      if (currentuser) {
        axios.post(`https://pro12-two.vercel.app/jwt`, currentuser , {withCredentials:true})
      } else {
           axios.post('https://pro12-two.vercel.app/logout',{}, {withCredentials:true} )
      }
     
    });
  
    return () => unsubscribe();
  }, [auth]);
  



  // Context Value
  const value = {
    // Google_signin,
    Create_User,
    User,
    setUser,
    Login,
    signout,
    loading,
    isLoading,
    refetch,
    meals
    // selectedRating,
    // setSelectedRating,
  };
  

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default USer_context_Provider;