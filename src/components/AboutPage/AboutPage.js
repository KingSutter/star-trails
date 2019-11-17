import React from 'react';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

const AboutPage = () => (
  <div>
    <div>
      <p>
        Due to a malfunction of your ship's spore drive, you are stranded out in hostile Klingon territory with only your warp drive and impulse engine to get you home. It is up to you to get home safely. Luckily, your ship ended up in a system with a friendly Ferengi merchant who is sympathetic to your cause and is willing to sell you any parts or food you need for your journey in exchange for latinum.
        <br /><br/>
        <ul>
          <li>In the first part of the game, you must decide how much food you may need for you and your crew, as well as any spare parts in the event of a malfunction.</li>
          <li>Your crew will eat a fixed amount of food per day, unless you run into a hitch</li>
          <li>Be prepared for the worst. As captain, you will encounter situations that may require a tough decision to be made. Do what you believe is best for your crew!</li>
          <li>This isn't a race, but keep in mind that the longer you stay in enemy territory, the higher chance you have getting discovered by the Klingons. They will most certainly make life harder for you.</li>
          <li>If you lose your entire critical crew compliment at any point in your journey, you lose. No save points to revert to, no do-overs. You must restart the entire game.</li>
        </ul>
      </p>
    </div>
  </div>
);

export default AboutPage;
