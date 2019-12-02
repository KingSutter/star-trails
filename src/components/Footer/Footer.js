import React from 'react';

let animatedBackground = true;

const toggleBackground = () => {
  if(animatedBackground) {
    document.body.style.background = 'url("/static/media/space.94b0019d.jpg")'; 
    animatedBackground=false;
  }else {
    document.body.style.background = 'url("/static/media/twinklingStars.3096ed06.gif")'; 
    animatedBackground=true;
  }
}

const Footer = () => (
  <footer>
    <button onClick={toggleBackground} className="universalButton">Toggle animated background</button>
  </footer>
);

export default Footer;
