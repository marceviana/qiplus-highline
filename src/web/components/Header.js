import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  Navbar,
  Collapse,
  NavItem,
  DropdownMenu,
  DropdownItem,
  NavbarToggler,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import Config from '../../constants/config';
import { SidebarNavItems } from './Sidebar';

class Header extends Component {
  static propTypes = {
    member: PropTypes.shape({
      firstName: PropTypes.string,
      email: PropTypes.string,
    }),
    logout: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    member: {},
  }

  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = { isOpen: false };
  }

  onLogout = () => this.props.logout().then(() => this.props.history.push('/login'));

  toggleDropDown = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const { member } = this.props;
    const loggedIn = !!(member && member.email);

    return (
      <header>
        <Navbar dark color="primary" expand="sm" className="fixed-top">
          <Link to="/" className="navbar-brand" style={{ color: '#FFF' }}>
            <span className="logo"></span>
            <span>{Config.appName}</span>
          </Link>
          <NavbarToggler onClick={this.toggleDropDown} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <div className="d-block d-sm-none">
                <NavItem>
                  <Link onClick={this.toggleDropDown} className={`nav-link ${window.location.pathname === '/' && 'active'}`} to="/">
                    <i className="icon-home" /> <span>Home</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link onClick={this.toggleDropDown} className={`nav-link ${window.location.pathname.startsWith('/event') && 'active'}`} to="/events">
                    <i className="icon-calendar" /> <span>Eventos</span>
                  </Link>
                </NavItem>
                <NavItem>
                  {loggedIn ? 
                  <Link onClick={this.toggleDropDown} className={`nav-link ${window.location.pathname === '/login' && 'active'}`} to="/login">
                    <i className="icon-login" /> <span>Login</span>
                  </Link> :
                  <Link onClick={this.toggleDropDown} className={`nav-link ${window.location.pathname === '/login' && 'active'}`} to="/logout">
                      <i className="icon-logout" /> <span>Sair</span>
                  </Link>
                  }
                </NavItem>

                <NavItem>
                  <Link onClick={this.toggleDropDown} className={`nav-link ${window.location.pathname.startsWith('/sign-up') && 'active'}`} to="/sign-up">
                    <i className="icon-user-following" /> <span>Criar uma conta</span>
                  </Link>
                </NavItem>

              </div>

            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default withRouter(Header);
