import React from 'react'
import { useSelector } from 'react-redux'
import '../css/customerhome.css'
import SearchSection from './SearchComponent'
const CustomerHome = () => {

  const {currentUserData} = useSelector((state)=>state.user)
  
  return (
    
    <div className='p-md-5 p-2'>
          <div>
            <h2 className='welcome'>Welcome, <span className='text-primary'>{currentUserData?.user?.userId?.fullName}!</span></h2>
            <p className='para'>Find Professionals near you!</p>
            <SearchSection/>
          </div>
    </div>
  )
}

export default CustomerHome
