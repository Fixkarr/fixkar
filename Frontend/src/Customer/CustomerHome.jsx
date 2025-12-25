import React from 'react'
import { useSelector } from 'react-redux'
import '../css/customerhome.css'
import SearchSection from './SearchComponent'
import { useDispatch } from 'react-redux'
import { setSelectedLocation, setSelectedService } from '../redux/location.slice'
import { useNavigate } from 'react-router-dom'
import Instructions from './Instructions'
import MobileNotVerified from './MobileNotVerified'
import Messages from '../Professional/Messages'
const CustomerHome = () => {

  const {currentUserData} = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLocationSelect = (location)=>{
    dispatch(setSelectedLocation(location));
    navigate("/customer/hire-professionals");
  }

  const handleServiceSelect = (service) => {
    dispatch(setSelectedService(service));
    navigate("/customer/hire-professionals");
  };


  
  return (
    
    <div className='p-md-5 p-2'>
          <div>
            <h2 className='welcome'>Welcome, <span className='text-primary fs-1'>{currentUserData?.user?.userId?.fullName}!</span></h2>
            {!currentUserData?.user?.userId?.isMobileVerified && <MobileNotVerified/>}
            <p className='para'>Find Professionals near you!</p>
            <SearchSection onLocationSelect={handleLocationSelect} onServiceSelect={handleServiceSelect}/>
          </div>
          <br />
          <Instructions/>
          <Messages/>
    </div>
  )
}

export default CustomerHome
