import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link className="nav-link-component" to="/">
        <img
          className="navbar-web-logo"
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        />
      </Link>
      <ul className="nav-ul">
        <Link className="nav-link-component" to="/">
          <li>
            <button className="mobile-nav-button" type="button">
              <AiFillHome />
            </button>
            <button className="desktop-nav-button" type="button">
              Home
            </button>
          </li>
        </Link>
        <Link className="nav-link-component" to="/jobs">
          <li>
            <button className="mobile-nav-button" type="button">
              <BsFillBriefcaseFill />
            </button>
            <button className="desktop-nav-button" type="button">
              Jobs
            </button>
          </li>
        </Link>
        <li className="logout-button-container">
          <button
            onClick={onClickLogout}
            className="mobile-nav-button"
            type="button"
          >
            <FiLogOut />
          </button>
          <button
            onClick={onClickLogout}
            className="desktop-nav-logout-button"
            type="button"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
