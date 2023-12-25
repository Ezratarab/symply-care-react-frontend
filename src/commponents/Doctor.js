import React from 'react'

export default function Doctor({doctor}) {
  return (
    <div>
        <h4>Doctor</h4>
        <div>Name: {doctor.firstName}</div>
        <div>Name: {doctor.lastName}</div>
    </div>

  )
}
