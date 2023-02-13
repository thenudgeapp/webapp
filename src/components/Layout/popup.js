import React, {useEffect, useState} from 'react'
import { UncontrolledAlert } from "reactstrap"
import { Link } from 'react-router-dom'

const SHOW_COOKIE_CONST = "cookie_shown"

const Popup = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if(!localStorage.getItem(SHOW_COOKIE_CONST)) {
            setShow(true)
        }
    }, [])
    return (
        show ? <React.Fragment>
            <UncontrolledAlert onClick={() => localStorage.setItem(SHOW_COOKIE_CONST, "do not show")}
                               className="card cookie-popup shadow rounded py-3 px-4">
                <p className="text-muted mb-0 fs-6">This website uses cookies to provide you with a great user experience. By using it,
                    you accept our <Link to="#" target="_blank" rel="noopener noreferrer" className="text-success h6">use of cookies</Link></p>
                <div className="cookie-popup-actions text-end">
                    {/* <button>
                        <i className="uil uil-times text-dark fs-4"></i>
                    </button> */}
                </div>
            </UncontrolledAlert>

        </React.Fragment> : <></>
    )
}

export default Popup
