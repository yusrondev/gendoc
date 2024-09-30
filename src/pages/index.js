import React, { useEffect } from 'react';
import { Redirect } from '@docusaurus/router';

const HomePage = () => {
  useEffect(() => {
    // Redirect to your desired page after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/docs/intro'; // Change to your target page
    },3000); // Redirect after 2 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  return (
    <div>
      <center className='fadeout'>
        <img src='img/aci-core.png' className='aci-core-logo'></img>
        <h1>ACI Core Documentation</h1>
      </center>
    </div>
  );
};

export default HomePage;
