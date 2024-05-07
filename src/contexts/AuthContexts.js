// import { auth } from "../firebase";
// import React, { useContext, useState, useEffect } from "react";
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
// import { useNavigate } from "react-router-dom"
// import axios from "axios";
// import path from "../path"
// const AuthContext = React.createContext()
// export function useAuth() {
//     return useContext(AuthContext)
// }
// export function AuthProvider({ children }) {
//     let navigate1 = useNavigate();
//     const [currentUser, setCurrentUser] = useState(Object)
//     const [role, setRole] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const signInWithGoogle = () => {
//         signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
//             navigate1("/")
//         })
//             .catch((error) => {
//             })
//     }
//     function signup(email, password, role, rooms) {
//         return auth.createUserWithEmailAndPassword(email, password).then((result) => {
//             axios.post(path + `/create_user`, {
//                 email: email,
//                 role: "USER",
//                 uid: result.user._delegate.uid,
//                 rooms: rooms
//             })
//         }).then(async res => {
//             await logout()
//             console.log("relogging")
//             await login(currentUser.email, "AdminCollegium2023!")
//                 .then(res => window.location.href = '/manager')
//         })
//             .catch((error) => {
//             })
//     }

//     function login(email, password) {
//         console.log(role)
//         return auth.signInWithEmailAndPassword(email, password)
//     }

//     function logout() {
//         setRole(null)
//         return auth.signOut()
//     }
//     function resetPassword(email) {
//         return auth.sendPasswordResetEmail(email)
//     }

//     function updateEmail(email) {
//         return currentUser.updateEmail(email)
//     }

//     function updatePassword(password) {
//         return currentUser.updatePassword(password)
//     }
//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(user => {
//             setCurrentUser(user)
//             if (user) {
//                 axios.post(path + '/login', {
//                     uid: user._delegate.uid
//                 })
//                     .then(function (response) {
//                         setRole(response.data)
//                     })
//                     .catch(function (error) {
//                     });
//             }
//             setLoading(false)
//         })
//         return unsubscribe
//     }, [])
//     const value = {
//         currentUser, role,
//         signup,
//         login,
//         logout,
//         resetPassword,
//         updateEmail,
//         updatePassword,
//         signInWithGoogle
//     }
//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     )
// }
