import React from 'react'
import {Alert} from 'react-bootstrap'

const Home=()=>{
  return(
    <Alert variant = 'danger' style = {{margin: "30px 20px", borderRadius: "20px", padding: "30px 30px", backgroundColor: "#212326"}}>
      <Alert.Heading>Uh oh! This page isn't found!</Alert.Heading>
      <p>The page you navigated to could not be found. Please navigate using the navigation bar above.</p>
    </Alert>
  )
}

export default Home