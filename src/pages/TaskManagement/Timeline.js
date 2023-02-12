import React, { Component } from "react"
import { Col, Container, Row } from "reactstrap"

import taskManagement from "../../assets/images/task/task-management.png"
import task from "../../assets/images/task/task-delivery.png"
import personalized from "../../assets/images/task/personalized.png"

//Import Icons
import FeatherIcon from "feather-icons-react"
import { Link } from "react-router-dom"

export default class Timeline extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className="mt-100 mt-60">
          <Row className="align-items-center">
            <Col lg={6} md={6}>
              <img
                src={taskManagement}
                className="img-fluid shadow rounded-md"
                alt=""
              />
            </Col>

            <Col lg={6} md={6} className="mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div className="section-title ms-lg-5">
                <h1 className="text-primary">
                  <i className="uil uil-schedule"></i>
                </h1>
                <h4 className="title mb-4">Easy Task Management</h4>
                <p className="text-muted">
                  Get the tools you need to manage your tasks effectively.
                  Create and manage projects, tasks, and sub-tasks in a few clicks.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="mt-100 mt-60">
          <Row className="align-items-center">
            <Col lg={6} md={6} className="order-1 order-md-2">
              <img src={task} className="img-fluid" alt="" />
            </Col>

            <Col
              lg={6}
              md={6}
              className="mt-4 mt-sm-0 pt-2 pt-sm-0 order-2 order-md-1"
            >
              <div className="section-title me-lg-5">
                <h1 className="text-primary">
                  <i className="uil uil-list-ui-alt"></i>
                </h1>
                <h4 className="title mb-4">
                  Better Delivery
                </h4>
                <p className="text-muted">
                  Nudge is more than a task management tool.
                  We apply Artificial Intelligence to generate the best recommendations
                  to help tech professionals improve their performance.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="mt-100 mt-60">
          <Row className="align-items-center">
            <Col lg={6} md={6}>
              <img
                  src={personalized}
                  className="img-fluid shadow rounded-md"
                  alt=""
              />
            </Col>

            <Col lg={6} md={6} className="mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div className="section-title ms-lg-5">
                <h1 className="text-primary">
                  <i className="uil uil-robot"></i>
                </h1>
                <h4 className="title mb-4">Personalized Insights</h4>
                <p className="text-muted">
                  Even better - you get tailored recommendations for your tasks based on your project goal,
                  your role, the company size, and other key data points.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}
