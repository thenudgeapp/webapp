import React from "react";

//Import Components
import Features from "./features";
import WhatWeDo from "./WhatWeDo";
import Reviews from "./reviews";

const Section = () => {  
    return (
      <React.Fragment>
        <section className="section overflow-hidden">
          {/* Render Features */}
          <Features />

          {/* what we do in detail */}
          <WhatWeDo />

          {/* Render Review */}
          <Reviews />
        </section>
      </React.Fragment>
    );  
}

export default Section;
