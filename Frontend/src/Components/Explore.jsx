import React from 'react'
import HireProfessionals from '../Customer/HireProfessionals'
import { useLocation, useParams } from 'react-router-dom'

const Explore = () => {
     const location = useLocation();
      const { pathname } = location;
    const {profession} = useParams();
  return (
   <>
    {pathname !== '/' &&
         <>
          <Helmet>
    <title>Fixkar Services - Explore Fixkar Services</title>
    <meta
      name="description"
      content="Contact Fixkar for support, service queries, or assistance. Our team is available to help you connect with skilled professionals efficiently."
    />
  </Helmet>
  
        <Navbar/>
        </>
        }
    Search {profession} near!
    <HireProfessionals/>

    {pathname !== '/' && <Footer/>}
   </>
  )
}

export default Explore
