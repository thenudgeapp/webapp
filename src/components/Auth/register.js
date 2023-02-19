import React, {useEffect, useState} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Label,
  Button,
  Input,
  FormFeedback, Alert
} from "reactstrap";
import { Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
//Import Icons
import FeatherIcon from "feather-icons-react";
import {useAtom} from "jotai";
import {AuthAtoms} from "../../store";
import {HttpStatusCode} from "axios";
import { useHistory } from 'react-router-dom'

const Register = () => {
  const history = useHistory()
  const [_, register] = useAtom(AuthAtoms.register)
  const [user, __] = useAtom(AuthAtoms.user)
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (user) {
      history.push('/home')
    }
  }, [user])

  const removeEmptyVals = (values) => {
    for (const value in values) {
      if (values[value]?.trim() === '') {
        values[value] = undefined
      }
    }

    return values
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      jobRole: "",
      workLevel: "",
      companyIndustry: "",
      companySize: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First Name"),
      lastName: Yup.string().required("Please Enter Last Name"),
      email: Yup.string("Enter your email").email("Enter a valid email").required("Email is required"),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required("Please Enter Password"),
      jobRole: Yup.string(),
      workLevel: Yup.string(),
      companyIndustry: Yup.string(),
      companySize: Yup.string(),
    }),
    onSubmit: (values) => {
      setLoading(true)
      setErrorMessage(null)
      register(removeEmptyVals(values)).then((response) => {
        setLoading(false)
      } ).catch(error => {
        if (error.response.status === HttpStatusCode.BadRequest) {
          setErrorMessage(error.response.data.message);
          setLoading(false)
        }
      })
    }
  });

  return (
    <React.Fragment>
      <div className="back-to-home rounded d-none d-sm-block">
        <Link
          to="/index"
          className="btn btn-icon btn-primary"
        >
          <i>
            <FeatherIcon icon="home" className="icons" />
          </i>
        </Link>
      </div>

      <section className="bg-auth-home bg-circle-gradiant d-table w-100">
        <div className="bg-overlay bg-overlay-white"></div>
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={8}>
              <Card className="shadow rounded border-0 mt-4">
                <CardBody>
                  <h4 className="card-title text-center">Signup</h4>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                    className="login-form mt-4"
                  >
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                icon="user"
                                className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                            type="text"
                            className="form-control ps-5"
                            placeholder="First Name"
                            name="firstName"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.firstName || ""}
                            invalid={
                              validation.touched.firstName && validation.errors.firstName ? true : false
                            }
                          />
                          {validation.touched.firstName && validation.errors.firstName ? (
                            <FormFeedback type="invalid">{validation.errors.firstName}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                icon="user-check"
                                className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                            type="text"
                            className="form-control ps-5"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.lastName || ""}
                            invalid={
                              validation.touched.lastName && validation.errors.lastName ? true : false
                            }
                          />
                          {validation.touched.lastName && validation.errors.lastName ? (
                            <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Your Email <span className="text-danger">*</span>
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                icon="mail"
                                className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                            type="email"
                            className="form-control ps-5"
                            placeholder="Email"
                            autoComplete="username"
                            name="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                icon="key"
                                className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                            type="password"
                            className="form-control ps-5"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Job Role
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                  icon="command"
                                  className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                              type="text"
                              className="form-control ps-5"
                              name="jobRole"
                              placeholder="Job Role"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.jobRole || ""}
                          />
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Experience Level
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                  icon="bar-chart"
                                  className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                              type="select"
                              className="form-control ps-5"
                              name="workLevel"
                              placeholder="Experience Level"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.workLevel || ""}
                          >
                            <option value=""/>
                            <option value="junior">Junior/Entry Level</option>
                            <option value="mid-level">Mid-level</option>
                            <option value="senior">Senior</option>
                          </Input>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Industry (IT, Finance, Agriculture, Oil & Gas, etc)
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                  icon="briefcase"
                                  className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                              type="text"
                              className="form-control ps-5"
                              name="companyIndustry"
                              placeholder="Industry"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.companyIndustry || ""}
                          />
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <Label className="form-label">
                            Company Size
                          </Label>
                          <div className="form-icon position-relative">
                            <i>
                              <FeatherIcon
                                  icon="pie-chart"
                                  className="fea icon-sm icons"
                              />
                            </i>
                          </div>
                          <Input
                              type="select"
                              className="form-control ps-5"
                              name="companySize"
                              placeholder="Company Size"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.companySize || ""}
                          >
                            <option value=""/>
                            <option value="startup">Startup (1-50 employees)</option>
                            <option value="mid-size">Mid-size company (50 - 200 employees)</option>
                            <option value="large">Large corporation (> 200 employees)</option>
                          </Input>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="mb-3">
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="customCheck1"
                            />
                            <Label
                              className="form-check-label"
                              htmlFor="customCheck1"
                            >
                              I Accept{" "}
                              <Link to="#" className="text-primary">
                                Terms And Condition
                              </Link>
                            </Label>
                          </div>
                        </div>
                      </Col>
                      <Col lg={12} className="mb-0">
                        {errorMessage && <div className="d-grid">
                          <Alert className="bg-soft-danger fw-medium">
                            <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                            {errorMessage}
                          </Alert>
                        </div>}
                        <div className="d-grid">
                          <Button color="primary">
                            {loading &&
                                <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                            }
                            Register
                          </Button>
                        </div>
                      </Col>
                      <Col lg={12} className="mt-4 text-center d-none">
                        <h6>Or Signup With</h6>
                        <Row>
                          <div className="col-6 mt-3">
                            <div className="d-grid">
                              <Link to="#" className="btn btn-light"><i className="mdi mdi-facebook text-primary"></i> Facebook</Link>
                            </div>
                          </div>

                          <div className="col-6 mt-3">
                            <div className="d-grid">
                              <Link to="#" className="btn btn-light"><i className="mdi mdi-google text-danger"></i> Google</Link>
                            </div>
                          </div>
                        </Row>
                      </Col>
                      <Col xs={12} className="text-center">
                        <p className="mb-0 mt-3">
                          <small className="text-dark me-2">
                            Already have an account ?
                          </small>{" "}
                          <Link
                            to="/login"
                            className="text-dark fw-bold"
                          >
                            Sign In
                          </Link>
                        </p>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
}

export default Register;
