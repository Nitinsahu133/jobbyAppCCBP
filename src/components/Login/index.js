import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = JSON.stringify({username, password})
    const options = {
      method: 'POST',
      body: userDetails,
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 1})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errorMsg: `*${data.error_msg}`})
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-container">
        <form onSubmit={this.onSubmitLoginForm} className="login-form">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label className="login-form-label" htmlFor="username">
            USERNAME
          </label>
          <input
            onChange={this.onChangeUsername}
            placeholder="Username"
            className="login-form-input"
            id="username"
            type="text"
            value={username}
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            onChange={this.onChangePassword}
            placeholder="Password"
            className="login-form-input"
            id="password"
            type="password"
            value={password}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {errorMsg.length > 0 && <p className="login-error">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
