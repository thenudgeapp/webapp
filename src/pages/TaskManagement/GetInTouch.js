import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"

//Import Icons
import FeatherIcon from "feather-icons-react"

export default class GetInTouch extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className="mt-100 mt-60">
          <Row className="mt-5 pt-4 justify-content-center">
            <Col xs={12} className="text-center">
              <div className="section-title">
                <h4 className="title mb-4">What’s your goal?</h4>
                <p className="text-muted para-desc mx-auto mb-0">
                  <span className="text-primary fw-bold">
                    10% increase
                  </span>{" "}
                   in conversation rate, fix a bug, or{" "}
                  <span className="text-primary fw-bold">
                    look smarter
                  </span>?{" "}
                </p>
                <p className="text-muted para-desc mx-auto mt-0">
                  Join{" "}
                  <span className="text-primary fw-bold">
                    Nudge
                  </span>{" "}
                  today, and let’s set you on a path to success.
                </p>
                <Link
                  to="/register"
                  className="btn btn-primary mt-4"
                >
                  Get Started
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}
