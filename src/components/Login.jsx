import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, FormLabel, Button, Modal, Toast, ToastBody } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Request } from '../services/requestdata.js';
import { ControlSid as controlSid } from '../services/managesid.js';
import Catalog from './Catalog.jsx';
import Signup from './Signup.jsx';
import { Creds } from '../modeldata/Creds.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.controlSid = new controlSid;
    this.state = { showModal: false, showNotice: false, typeMsgInfo: 'bg-success', msgInfo: '' };
    this.checkSession = this.checkSession.bind(this);
    this.openSignUp = this.openSignUp.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.notifyMsg = this.notifyMsg.bind(this);
    this.signInUser = this.signInUser.bind(this);
  }

  componentDidMount() {
    document.getElementsByTagName("body").item(0).classList = 'bckgr-login';
  }

  render() {
    const schemaForm = Yup.object().shape({
      usermail: Yup.string().required('Debe introducir el correo electrónico registrado en la cuenta!')
                  .min(8, 'Dirección de correo muy corta!').max(60, 'Dirección de correo fuera de rango!')
                  .email('El correo electrónico no posee patrón válido!'),
      userpass: Yup.string().required('Debe introducir la contraseña para iniciar sesión!')
                .min(8, 'La contraseña debe ser mayor a 8 caracteres!').max(50, 'Contraseña muy larga e inválida'),
    });

    return this.controlSid.getSid() !== null ? <Redirect to="/catalogo" /> : (
      <div>
      <Formik initialValues={{ usermail: '', userpass: ''}} validationSchema={schemaForm} onSubmit={this.signInUser}>{
      ({ handleSubmit, handleChange, handleBlur, values, isValid, touched, errors, isSubmitting, handleReset }) => (
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
                        <Form.Control type="email" size="sm" className="rounded" aria-describedby="email_prefix" name="usermail" value={values.usermail}
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
                        <Form.Control type="password" size="sm" className="rounded" aria-describedby="pword_prefix" name="userpass" value={values.userpass}
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
              show={this.state.showModal} onHide={this.closeModal} noticeToast={this.notifyMsg.bind(this)} />
      </Container>
      )}</Formik>
      <Row className="fixed-bottom mw-100 justify-content-center mh-2">
        <Toast autohide delay={2500} className={"text-center " + this.state.typeMsgInfo}
                show={this.state.showNotice} onClose={() => this.setState({ showNotice: false})}>
          <ToastBody className="text-light h6">{this.state.msgInfo}</ToastBody>
        </Toast>
      </Row>
      </div>
    );
  }

  checkSession() {

  }

  openSignUp() { this.setState({ showModal: true }); }

  closeModal() { this.setState({ showModal: false }); }

  notifyMsg(err, msg) {
    err ?  this.setState({ typeMsgInfo: 'bg-danger', msgInfo: msg }) : this.setState({ msgInfo: msg });
    this.setState({ showNotice: true });
  }

  signInUser(values, fmkbag) {
    const userCreds = new Creds, req = new Request; let resp;
    userCreds.emailusr = values.usermail;
    userCreds.pwordusr = values.userpass;
    fmkbag.resetForm({});
    req.loginCheck(userCreds).then(res => {
      resp = res.body;
      if (res.error || !res.body.access) throw res.error
      this.controlSid.buildSid(resp.sid);
    }).catch(error => { if (error) console.error(error);
    }).finally(() => {
      if (!resp.access) {
        this.notifyMsg(true, resp.msg);
      } else {
        this.notifyMsg(false, 'Usuario autenticado!!');
      }
    });
  }
}

export default Login;