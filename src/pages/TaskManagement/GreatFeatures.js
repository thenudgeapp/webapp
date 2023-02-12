import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

//Import Icons
import FeatherIcon from "feather-icons-react"

export default class GreatFeatures extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className="mt-100 mt-60">
          <Row className="justify-content-center">
            <Col lg={4} xs={12}>
              <div className="sticky-bar">
                <div className="section-title text-lg-start text-center mb-4 mb-lg-0 pb-2 pb-lg-0">
                  <h4 className="title mb-4">
                    Features to enable you achieve great results
                  </h4>
                  <p className="text-muted para-desc mb-0 mx-auto">
                    Designed to help product managers and software engineers work better.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={8} xs={12}>
              <Row className="align-items-center">
                <Col md={6}>
                  <Row>
                    <Col xs={12} className="mt-4 mt-lg-0 pt-2 pt-lg-0">
                      <Card className="features fea-primary rounded p-4 bg-light position-relative overflow-hidden border-0">
                        <span className="h1 icon2 text-primary">
                          <i className="uil uil-schedule"></i>
                        </span>
                        <CardBody className="p-0 content">
                          <h5>Manage your tasks</h5>
                          <p className="para text-muted mb-0">
                            Create and manage tasks easily.
                            View all your tasks at a glance
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col xs={12} className="mt-4 pt-2">
                      <Card className="features fea-primary rounded p-4 bg-light position-relative overflow-hidden border-0">
                        <span className="h1 icon2 text-primary">
                          <i className="uil uil-clock"></i>
                        </span>
                        <CardBody className="p-0 content">
                          <h5>Track workload</h5>
                          <p className="para text-muted mb-0">
                            Receive deadline reminders and a little nudge
                            on how to deliver your task on time.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col xs={12} className="mt-4 pt-2">
                      <Card className="features fea-primary rounded p-4 bg-light position-relative overflow-hidden border-0">
                        <span className="h1 icon2 text-primary">
                          <i className="uil uil-robot"></i>
                        </span>
                        <CardBody className="p-0 content">
                          <h5>Get recommendations</h5>
                          <p className="para text-muted mb-0">
                            Get tips & action steps
                            on how to achieve your goal 3X better.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col md={6}>
                  <Row>
                    <Col xs={12} className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                      <Card className="features fea-primary rounded p-4 bg-light position-relative overflow-hidden border-0">
                        <span className="h1 icon2 text-primary">
                          <i className="uil uil-rocket"></i>
                        </span>
                        <CardBody className="p-0 content">
                          <h5>Action recommendations</h5>
                          <p className="para text-muted mb-0">
                            See a recommendation that stands out to you,
                            turn it in into a task, and action it immediately.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col xs={12} className="mt-4 pt-2 d-none">
                      <Card className="features fea-primary rounded p-4 bg-light position-relative overflow-hidden border-0">
                        <span className="h1 icon2 text-primary">
                          <i className="uil uil-presentation-plus"></i>
                        </span>
                        <CardBody className="p-0 content">
                          <h5>Collaboration</h5>
                          <p className="para text-muted mb-0">
                            It is a long established fact that a reader will be
                            of a page reader will be of at its layout.
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col xs={12} className="mt-4 pt-2 text-center text-md-start d-none">
                      <Link to="#" className="btn btn-primary">
                        See more{" "}
                        <i><FeatherIcon icon="arrow-right" className="fea icon-sm" /> </i>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}
