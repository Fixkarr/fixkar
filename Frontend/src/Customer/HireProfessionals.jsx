import React from 'react'
import SearchSection from './SearchComponent'
import ProfessionalCard from './ProfessionalCard'

const HireProfessionals = () => {
  return (
    <div className='container py-4'>
        <h4 className="mt-4 mb-3 fw-semibold">Available Professionals</h4>
      <SearchSection/>
      <div className='mt-4 d-flex gap-3'>
      <ProfessionalCard/>
      <ProfessionalCard/>
      <ProfessionalCard/>
      <ProfessionalCard/>
      <ProfessionalCard/>
      <ProfessionalCard/>
      <ProfessionalCard/>
      </div>
    </div>
  )
}

export default HireProfessionals
