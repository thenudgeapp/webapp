import React, { useEffect } from "react";
import { Container } from "reactstrap";

//Import Components
import Section from "./section";
import Partners from "./Partners";
import Feature from "../../components/Shared/Feature";
import FeatureDescription from "./FeatureDescription";
import CTA from "./cta";
import Pricings from "./pricings";
import Trial from "./trial";
import { featureArray, facilities, testimonials } from "../../common/data";
import classic02 from "../../assets/images/saas/classic02.png";
import Popup from "../../components/Layout/popup";

//Import Images

const IndexclassNameicSaas = () => {

  useEffect(() => {
    document.body.classList = "";
    document.querySelectorAll("#buyButton").forEach((navLink) => {
      navLink.classList.add("btn-light")
      navLink.classList.remove("btn-soft-primary");
    });
    window.addEventListener("scroll", scrollNavigation, true);
  })

  const scrollNavigation = () => {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    if (top > 80) {
      document.querySelector(".shoppingbtn")?.classList.remove("btn-light");
      document.querySelector(".settingbtn")?.classList.remove("btn-light");
      document.querySelector(".shoppingbtn")?.classList.add("btn-primary");
      document.querySelector(".settingbtn")?.classList.add("btn-soft-primary");
      document.getElementById("topnav")?.classList.add("nav-sticky");
    } else {
      document.querySelector(".shoppingbtn")?.classList.remove("btn-primary");
      document.querySelector(".settingbtn")?.classList.remove("btn-soft-primary");
      document.querySelector(".shoppingbtn")?.classList.add("btn-light");
      document.querySelector(".settingbtn")?.classList.add("btn-light");
      document.getElementById("topnav")?.classList.remove("nav-sticky");
    }
  };

  return (
    <React.Fragment>
      {/* render section */}
      <Section />

      {/* render partner */}
      <Partners />
      
      <section className="section overflow-hidden">
        <Container className="pb-5 mb-md-5">
          {/* feature box */}
          <Feature featureArray={featureArray} isCenter={true} />
        </Container>

        {/* Render Feature Description */}
        <FeatureDescription
          image1={classic02}
          image2={classic02}
          testimonials={testimonials}
          facilities={facilities} />
        <CTA />
        <Pricings />
        <Trial />
      </section>

      <Popup/>
    </React.Fragment>
  );
}

export default IndexclassNameicSaas;
