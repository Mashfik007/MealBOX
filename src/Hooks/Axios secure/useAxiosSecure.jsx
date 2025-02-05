import axios from 'axios'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../Context/User_context'

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const useAxiosSecure = () => {
  const navigate = useNavigate()
  const{signout}=useContext(UserContext)
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      res => {
        return res
      },
      async error => {
        if (error.response.status === 401 || error.response.status === 403) {
          // logout
          signout()
          // navigate to login
          navigate('/login')
        }
        return Promise.reject(error)
      }
    )
  }, [signout, navigate])
  return axiosSecure
}

export default useAxiosSecure