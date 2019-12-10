import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, useRouteMatch } from 'react-router-dom';
import * as Request from 'superagent';
import { Container, Row, Col, Form, InputGroup, FormLabel, Button, Modal, ModalDialog, ModalDialogProps } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Signup from './Signup.jsx';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false }
    this.openSignUp = this.openSignUp.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    Request.post('http://' + window.location.hostname + ':3000/shopping/catalog').type('application/json')
                .responseType('json').then(doc => {
                  if(!doc.error) { console.log(doc.body) }
                }).catch(err => {
                  console.error(err);
                });
  }

  //
  render() {
    const schemaForm = Yup.object().shape({
      usermail: Yup.string().required('Debe introducir el correo electrónico registrado en la cuenta!')
                  .min(8, 'Dirección de correo muy corta!').max(60, 'Dirección de correo fuera de rango!')
                  .email('El correo electrónico no posee patrón válido!'),
      userpass: Yup.string().required('Debe introducir la contraseña para iniciar sesión!')
                .min(8, 'La contraseña debe ser mayor a 8 caracteres!').max(50, 'Contraseña muy larga e inválida'),
    });

    return (
      <Formik initialValues={{ usermail: '', userpass: ''}} onSubmit={this.signInUser} validationSchema={schemaForm}>{
      ({ handleSubmit, handleChange, handleBlur, values, isValid, touched, errors, isSubmitting, isValidating }) => (
      <Container>
        <Row className="justify-content-center login-padding">
          <Col xs="8" sm="6" md="5" lg="4" xl="3">
            <div className="border-bottom-0 rounded-top login-box">
              <h2 className="text-white text-center mt-2 mb-0 pt-2">Inicio de Sesión</h2>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="8" sm="8" md="7" lg="6" xl="5">
            <div className="rounded-lg m-0 p-0 login-box">
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} controlId="useremail" className="ml-2 mr-2 mb-0">
                      <FormLabel className="text-white pl-4 pt-2 login-labels" size="lg">Correo Eletcrónico</FormLabel>
                      <InputGroup>
                        <InputGroup.Prepend id="email_prefix" className="pt-1 pr-2">
                          <i className="material-icons text-white">mail_outline</i>
                        </InputGroup.Prepend>
                        <Form.Control type="email" size="sm" className="rounded" aria-describedby="email_prefix" name="usermail" defaultValue={values.usermail}
                            onChange={handleChange} onBlur={handleBlur} isValid={touched.usermail && !errors.usermail} isInvalid={errors.usermail} />
                        <Form.Control.Feedback type="invalid" className="ml-5">{errors.usermail}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="userpword" className="ml-2 mr-2">
                      <FormLabel className="text-white pl-4 pt-2 login-labels">Contraseña</FormLabel>
                      <InputGroup>
                        <InputGroup.Prepend id="pword_prefix" className="pt-1 pr-2 font">
                          <i className="material-icons text-white">vpn_key</i>
                        </InputGroup.Prepend>
                        <Form.Control type="password" size="sm" className="rounded" aria-describedby="pword_prefix" name="userpass" defaultValue={values.userpass}
                            onChange={handleChange} onBlur={handleBlur} isValid={!!errors.userpass && values.userpass.lenght > 7} isInvalid={errors.userpass} />
                        <Form.Control.Feedback type="invalid" className="ml-5">{errors.userpass}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row className="justify-content-center">
                    <Col xs="4" sm="6">
                      <Button type="submit" variant="outline-primary" className="login-labels" block
                              disabled={errors.usermail || errors.userpass}>Ingresar</Button>
                    </Col>
                    <p className="text-white mt-2">¿No tienes cuenta? Registrate <a href="#" onClick={this.openSignUp}>aquí</a></p>
                  </Form.Row>
                </Form>
            </div>
          </Col>
        </Row>
      <Modal dialogAs={Signup} doneSignup={this.closeModal.bind(this)} animation={false} size="lg" scrollable keyboard
              show={this.state.showModal} onHide={this.closeModal} />
      </Container>
      )}</Formik>
    );
  }

  openSignUp() {
    console.log('Registrando....');
    this.setState({ showModal: true });
  }

  signInUser() {
    alert('Ingresando....');
  }

  closeModal() { this.setState({ showModal: false }); }
}

export default Login;