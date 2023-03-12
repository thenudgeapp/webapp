import React, {useState} from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  CardBody,
  Label,
  Button,
  FormFeedback,
  Input, Alert
} from "reactstrap";
import {Link, useParams} from "react-router-dom";

//Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
//Import Icons
import FeatherIcon from "feather-icons-react";
import {useAtom} from "jotai";
import {AuthAtoms} from "../../store";
import {HttpStatusCode} from "axios";
import logoDark from "../../assets/images/logo-dark.png";

const RecoverPassword = () => {

  const [_, handleForgotPassword] = useAtom(AuthAtoms.forgotPassword)
  const [__, resetPassword] = useAtom(AuthAtoms.resetPassword)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const {verificationToken} = useParams()

  const validation = useFormik(
      {
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string("Enter your email").email("Enter a valid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      setErrorMessage(null)
      setSuccessMessage(null)
      setLoading(true)
      handleForgotPassword(values).then((response) => {
        setLoading(false)
        setSuccessMessage("Kindly check your email to complete the recover password process")
      }).catch((error) => {
        setLoading(false)

        if(error.response.status === HttpStatusCode.InternalServerError) {
          return setErrorMessage("An error has occured and our engineers will fix the problem shortly. Please, try again later")
        }

        setErrorMessage(error.response.data.message)
      })
    }
  });
  const validationVerify = useFormik({
    enableReinitialize: true,

    initialValues: {
      password: "",
      reTypePassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
          .min(8, 'Password must be at least 8 characters')
          .required("Please Enter Password"),
      reTypePassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords don't match").required('Confirm Password is required'),
    }),
    onSubmit: (values) => {
      console.log("here......")
      setErrorMessage(null)
      setSuccessMessage(null)
      setLoading(true)
      resetPassword({password: values.password, token: verificationToken}).then((response) => {
        setLoading(false)
        setSuccessMessage("Your password has been reset successful. You can now login to your account using the new password")
      }).catch((error) => {
        setLoading(false)

        if(error.response.status === HttpStatusCode.InternalServerError) {
          return setErrorMessage("An error has occured and our engineers will fix the problem shortly. Please, try again later")
        }

        setErrorMessage(error.response.data.message)
      })
    }
  });

  return (
    <React.Fragment>
      <div className="back-to-home">
        <Link to="/" className="back-button btn btn-icon btn-primary">
          <i>
            <FeatherIcon icon="arrow-left" className="icons" />
          </i>
        </Link>
      </div>

      <section className="bg-home bg-circle-gradiant d-flex align-items-center">
        <div className="bg-overlay bg-overlay-white"></div>
        <Container>
          <Row className="justify-content-center">
            <Row className="justify-content-center" >
              <Col lg={5} md={8} className="justify-content-center d-flex mb-3">
                <img src={logoDark} height="44" className="l-dark" alt="" />
              </Col>
            </Row>
            <Col lg={5} md={8}>
              <Card className="shadow rounded border-0">
                <CardBody>
                  <h4 className="card-title text-center">Recover Account</h4>

                  {
                    verificationToken ?
                        <Form
                            onSubmit={(e) => {
                              console.log("Here.....")
                              e.preventDefault();
                              validationVerify.handleSubmit();
                              return false;
                            }}
                            className="login-form mt-4"
                        >
                          <Row>
                            <Col lg={12}>
                              <p className="text-muted">
                                Please enter your new password.
                              </p>
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
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    onChange={validationVerify.handleChange}
                                    onBlur={validationVerify.handleBlur}
                                    value={validationVerify.values.password || ""}
                                    invalid={
                                      validationVerify.touched.password && validationVerify.errors.password ? true : false
                                    }
                                />
                                {validationVerify.touched.password && validationVerify.errors.password ? (
                                    <FormFeedback type="invalid">{validationVerify.errors.password}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="mb-3">
                                <Label className="form-label">
                                  Confirm Password <span className="text-danger">*</span>
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
                                    autoComplete="new-password"
                                    className="form-control ps-5"
                                    name="reTypePassword"
                                    placeholder="Confirm Password"
                                    onChange={validationVerify.handleChange}
                                    onBlur={validationVerify.handleBlur}
                                    value={validationVerify.values.reTypePassword || ""}
                                    invalid={
                                      validationVerify.touched.reTypePassword && validationVerify.errors.reTypePassword ? true : false
                                    }
                                />
                                {validationVerify.touched.reTypePassword && validationVerify.errors.reTypePassword ? (
                                    <FormFeedback type="invalid">{validationVerify.errors.reTypePassword}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={12}>
                              <div className="d-grid">
                                {errorMessage && <div className="d-grid">
                                  <Alert className="bg-soft-danger fw-medium">
                                    <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                                    {errorMessage}
                                  </Alert>
                                </div>}
                                {successMessage && <div className="d-grid">
                                  <Alert className="bg-soft-success fw-medium">
                                    <i className="uil uil-check-circle fs-5 align-middle me-1"></i>
                                    {successMessage}
                                  </Alert>
                                </div>}
                                <Button color="primary">
                                  {loading &&
                                      <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                  }
                                  Send
                                </Button>
                              </div>
                            </Col>
                            <div className="mx-auto">
                              <p className="mb-0 mt-3">
                                <small className="text-dark me-2">
                                  Remember your password ?
                                </small>{" "}
                                <Link
                                    to="/login"
                                    className="text-dark fw-bold"
                                >
                                  Sign in
                                </Link>
                              </p>
                            </div>
                          </Row>
                        </Form> :
                        <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                            }}
                            className="login-form mt-4"
                        >
                          <Row>
                            <Col lg={12}>
                              <p className="text-muted">
                                Please enter your email address. You will receive a
                                link to create a new password via email.
                              </p>
                              <div className="mb-3">
                                <Label className="form-label">
                                  Email address{" "}
                                  <span className="text-danger">*</span>
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
                                    name="email"
                                    type="email"
                                    className="form-control ps-5"
                                    placeholder="Enter Your Email Address"
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
                            <Col lg={12}>
                              <div className="d-grid">
                                {errorMessage && <div className="d-grid">
                                  <Alert className="bg-soft-danger fw-medium">
                                    <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                                    {errorMessage}
                                  </Alert>
                                </div>}
                                {successMessage && <div className="d-grid">
                                  <Alert className="bg-soft-success fw-medium">
                                    <i className="uil uil-check-circle fs-5 align-middle me-1"></i>
                                    {successMessage}
                                  </Alert>
                                </div>}
                                <Button color="primary">
                                  {loading &&
                                      <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                  }
                                  Send
                                </Button>
                              </div>
                            </Col>
                            <div className="mx-auto">
                              <p className="mb-0 mt-3">
                                <small className="text-dark me-2">
                                  Remember your password ?
                                </small>{" "}
                                <Link
                                    to="/login"
                                    className="text-dark fw-bold"
                                >
                                  Sign in
                                </Link>
                              </p>
                            </div>
                          </Row>
                        </Form>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default RecoverPassword;
