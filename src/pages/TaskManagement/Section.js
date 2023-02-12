import React, { Component } from "react";
import { Col, Container, Form, Row } from "reactstrap";

// import images
import nudgeAi from "../../assets/images/task/nudge-ai.png";

export default class Section extends Component {
  render() {
    return (
      <React.Fragment>
        <section
          className="bg-home d-flex align-items-center bg-animation-left task-management-home"
          style={{ height: "auto" }}
          id="home"
        >
          <Container className="position-relative" style={{ zIndex: "1" }}>
            <Row className="justify-content-center">
              <Col lg={12} className="text-center mt-0 mt-md-5 pt-0 pt-md-5">
                <div className="title-heading margin-top-100">
                  <h1 className="heading text-white title-dark mb-3">
                    The productivity tool that guides you to success
                  </h1>
                  <p className="para-desc mx-auto text-white-50">
                    Stand out among your peers with AI-generated insights
                    on your tasks and perform better.
                    Built for Product Managers and Software Engineers.
                  </p>
                  <div className="text-center subcribe-form mt-4 pt-2">
                    <div
                        id="buyButton"
                        className="btn btn-pills btn-soft-primary settingbtn"
                    >
                      Get Started
                    </div>
                  </div>
                </div>

                <Row className="justify-content-center">
                  <Col lg={10} className="text-center">
                    <div className="home-dashboard">
                      <img src={nudgeAi} alt="" className="img-fluid" />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}
