import React, {useEffect, useState} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody, Alert,
} from "reactstrap";
import {Link, useParams} from "react-router-dom";

//Formik Validation
//Import Icons
import FeatherIcon from "feather-icons-react";
import {useAtom} from "jotai";
import {AuthAtoms} from "../../store";
import {HttpStatusCode} from "axios";
import {verifyEmailRequest} from "../../store/auth";

const VerifyEmail = () => {

  const [_, handleForgotPassword] = useAtom(AuthAtoms.forgotPassword)
  const [__, verifyEmail] = useAtom(AuthAtoms.verifyEmailRequest)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const { token } = useParams()

  useEffect(() => {
    if (token) {
      setLoading(true)
      verifyEmail({ token }).then((response) => {
        setLoading(false)
      } ).catch(error => {
          setErrorMessage(error.response.data.message);
          setLoading(false)
      })
    }
  }, [token])

  const invalidToken = (message='Account verification token is invalid.') => <>
    <Alert className="bg-soft-danger fw-medium">
      <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
      {message}
    </Alert>
    <p className="d-flex text-muted justify-content-center">
      <Link className="btn btn-primary" to="/">Go Home</Link>
    </p>
  </>


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
            <Col lg={5} md={8}>
              <Card className="shadow rounded border-0">
                <CardBody>
                  <h4 className="card-title text-center">Verify Account</h4>
                  <Col lg={12}>
                    {!token ?
                        invalidToken()
                        :
                        loading ?
                            <>Loading...</> :
                            errorMessage ?
                                invalidToken(errorMessage) :
                                <>
                                  <Alert className="bg-soft-success fw-medium">
                                    <i className="uil uil-check-circle fs-5 align-middle me-1"></i>
                                    Your account verification was successful.
                                  </Alert>
                                  <p className="d-flex text-muted justify-content-center">
                                    <Link className="btn btn-light" to="/login">Login</Link>
                                  </p>
                                </>
                    }
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default VerifyEmail;
