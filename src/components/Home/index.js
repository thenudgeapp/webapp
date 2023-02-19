import {useEffect} from "react";
import { useHistory } from 'react-router-dom'
import Layout from "./layout";

const {useAtom} = require("jotai");
const {AuthAtoms} = require("../../store");
const Home = ({...props}) => {
    const history = useHistory()
    const [user, _] = useAtom(AuthAtoms.user)

    useEffect(() => {
        if (!user) {
            history.push('/')
        }
    }, [user])
  return <div><Layout/></div>
}

export default Home
