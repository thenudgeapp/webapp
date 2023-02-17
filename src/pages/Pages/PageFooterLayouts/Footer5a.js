import React, { Component, Suspense } from "react";
import { Col, Container, Row } from 'reactstrap';

//Import Icons
import { Link } from 'react-router-dom';

//import images
import icon from '../../../assets/images/logo-icon.png';

//Import Switcher
import BackToTop from "../../../components/Layout/backToTop";

const Loader = () => {
  return (
    <div id="preloader">
      <div id="status">
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      </div>
    </div>
  );
};

class Footer5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        { listItem: "Privacy" },
        { listItem: "Terms" },
        { listItem: "FAQs" },
        { listItem: "Contact" },
      ]
    }
  }
  render() {
    return (
      <React.Fragment>
        <Suspense fallback={Loader()}>
          <footer className="footer">

            <div className="footer-py-30 footer-bar bg-footer">
              <Container className="text-center">
                <Row className="align-items-center justify-content-between pl-5 pr-5">
                  <Col lg={6} md={6} sm={6} className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                    <ul className="list-unstyled footer-list terms-service mb-0" style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <li className="text-sm-start">
                        <Link to="#" className="logo-footer">
                          <img src={icon} height="34" alt="" />
                        </Link>
                      </li>
                      <li className="list-inline-item mb-0"><Link to="#" className="text-foot">Contact Us</Link></li>{" "}
                      <li className="list-inline-item mb-0"><Link to="#" className="text-foot me-2">Privacy</Link></li>{" "}
                      <li className="list-inline-item mb-0"><Link to="#" className="text-foot me-2">Terms</Link></li>{" "}
                    </ul>
                  </Col>

                  <Col lg={3} md={4} sm={3} className="mt-4 mt-sm-0 pt-2 pt-sm-0">
                    <div className="text-sm-end">
                      <p className="mb-0 text-foot">© {(new Date().getFullYear())} {" "}
                        <Link to="/"
                          rel="noreferrer"
                          target="_blank"
                          className="text-reset">
                          Nudge</Link>.
                      </p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </footer>

          <BackToTop />
          {/* theme switcher */}
        </Suspense>
      </React.Fragment>
    );
  }
}

export default Footer5;
