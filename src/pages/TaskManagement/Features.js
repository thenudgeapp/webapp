import React, { Component } from "react"
import {Col, Container, Row} from "reactstrap"
import nudgeAi from "../../assets/images/task/nudge-ai.png";

export default class Features extends Component {
  render() {
    return (
      <React.Fragment>
        <Container>
          <div className="row">
            <Col lg={12} className="text-center mt-0 pt-0">
              <div className="title-heading">
                <h1 className="heading text-dark title-light mb-3">
                  Get 3X better with Nudge
                </h1>
                <p className="para-desc mx-auto text-dark-50">
                  It is easy to miss key tasks in your planning phase. No worries, we’ve got you!
                </p>
              </div>
            </Col>
          </div>
        </Container>
      </React.Fragment>
    )
  }
}
