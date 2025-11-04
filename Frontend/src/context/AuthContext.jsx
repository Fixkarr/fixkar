import React,{createContext, useContext, useState} from 'react'
const AuthContext = createContext()
export const AuthProvider = ({children}) => {
    const [email, setEmail] = useState("")
    const [otpVerified, setOtpVerified] = useState(false)

  return (
    <AuthContext.Provider value={{email, setEmail, otpVerified, setOtpVerified}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=> useContext(AuthContext)
