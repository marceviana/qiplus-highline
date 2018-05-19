import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  Form,
  Label,
  Alert,
  Input,
  Button,
  CardBody,
  FormGroup,
  CardHeader,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import Loading from './Loading';

class SignUp extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    error: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onFormSubmit(this.state)
      .then(() => this.props.history.push('/login'))
      .catch(e => console.log(`Error: ${e}`));
  }

  render() {
    const { loading, error } = this.props;

    // Loading
    if (loading) return <Loading />;

    return (
      <div>
        <Row>
          <Col lg={{ size: 6, offset: 3 }}>
            <Card style={{ marginTop: 20 }}>
              <CardHeader>Registro</CardHeader>
              <CardBody>
                {!!error && <Alert color="danger">{error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Nome"
                      value={this.state.firstName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Sobrenome"
                      value={this.state.lastName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>

                  <FormGroup style={{ marginTop: 40 }}>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Senha"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      name="password2"
                      id="password2"
                      placeholder="Confirmar Senha"
                      value={this.state.password2}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <Button block color="primary">Criar minha conta no QI Plus!</Button>
                </Form>

                <hr />

                <Row>
                  <Col sm="12">
                    Já possui um usuário no QI Plus? <Link to="/login">Login</Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(SignUp);
