import React from 'react';

let animatedBackground = true;

const toggleBackground = () => {
  if(animatedBackground) {
    document.body.style.background = "url('./space.jpg')"; 
    animatedBackground=false;
  }else {
    document.body.style.background = "url('./twinklingStars.gif')"; 
    animatedBackground=true;
  }
}

const Footer = () => (
  <footer>
    <button onClick={toggleBackground} className="universalButton">Toggle animated background</button>
  </footer>
);

export default Footer;
