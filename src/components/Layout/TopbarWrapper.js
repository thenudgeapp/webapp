import Topbar from "./Topbar";
import {useAtom} from "jotai";
import {AuthAtoms} from "../../store";

const TopbarWrapper = (...props) => {
    const [user, _] = useAtom(AuthAtoms.user)
    const [__, logout] = useAtom(AuthAtoms.logout)
    const [tokens, ___] = useAtom(AuthAtoms.tokens)

    return <Topbar {...props} user={user} logout={logout} tokens={tokens}/>
}

export default TopbarWrapper
