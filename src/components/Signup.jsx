import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Form, InputGroup, FormLabel, Button, ModalTitle, ModalBody, ModalDialog } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import * as Yup from 'yup';
import { Formik } from 'formik';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.userSignUp = this.userSignUp.bind(this);
    this.doneSignup = this.props.doneSignup.bind(this);
  }

  componentWillMount() { }

  //
  render() {
    const schemaData = Yup.object().shape({
      username: Yup.string().required('Ingrese su nombre completo para el registro de la cuenta!')
                  .min(5, 'Nombre muy corto, debe ingresar nombre y apellido'),
      usermail: Yup.string().required('Debe introducir un correo electrónico válido para el registro de la cuenta!')
                  .min(8, 'Dirección de correo muy corta!').max(60, 'Dirección de correo fuera de rango!')
                  .email('El correo electrónico no posee patrón válido!'),
      userpass: Yup.string().required('Debe introducir una contraseña para el registro de la cuenta!')
                .min(8, 'La contraseña debe ser mayor a 8 caracteres!').max(50, 'Contraseña muy larga e inválida')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
                        { message: 'La contraseña debe contener letras y números, sin caracteres especiales!', excludeEmptyString: true }),
      passconf: Yup.string().required('Debe introducir la contraseña anterior para la confirmación!')
                .min(8, 'La contraseña debe ser mayor a 8 caracteres!').max(50, 'Contraseña muy larga e inválida')
                .oneOf([Yup.ref('userpass'), null], 'Las contraseña debe coincidir con la anterior!'),
    });

    return (
      <ModalDialog centered>
        <ModalHeader closeButton className="alert-secondary"><ModalTitle>Registro - Cuenta de Usuario</ModalTitle></ModalHeader>
        <ModalBody className="alert-secondary rounded-bottom">
        <Formik initialValues={{username: '', usermail: '', userpass: '', passconf: ''}} onSubmit={this.userSignUp} validationSchema={schemaData}>{
        ({ handleSubmit, handleChange, handleBlur, values, isValid, touched, errors, isSubmitting }) => (
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <div className="rounded-lg m-0 p-0 signup-box">
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit} className="alert-secondary">
                    <Form.Row>
                      <Form.Group as={Col} controlId="nameusr" className="ml-2 mr-2 mb-0">
                        <FormLabel className="text-dark pl-4 pt-2 login-labels" size="lg">Nombre Completo</FormLabel>
                        <InputGroup>
                          <InputGroup.Prepend id="name_prefix" className="pt-1 pr-2">
                            <i className="material-icons text-dark">account_box</i>
                          </InputGroup.Prepend>
                          <Form.Control type="text" size="sm" className="rounded" aria-describedby="name_prefix" name="username" defaultValue={values.username}
                              onChange={handleChange} onBlur={handleBlur} isValid={touched.username && !errors.username} isInvalid={errors.username} />
                          <Form.Control.Feedback type="invalid" className="ml-5">{errors.username}</Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="emailusr" className="ml-2 mr-2 mb-0">
                        <FormLabel className="text-dark pl-4 pt-2 login-labels" size="lg">Correo Eletcrónico</FormLabel>
                        <InputGroup>
                          <InputGroup.Prepend id="email_prefix" className="pt-1 pr-2">
                            <i className="material-icons text-dark">mail_outline</i>
                          </InputGroup.Prepend>
                          <Form.Control type="email" size="sm" className="rounded" aria-describedby="email_prefix" name="usermail" defaultValue={values.usermail}
                              onChange={handleChange} onBlur={handleBlur} isValid={touched.usermail && !errors.usermail} isInvalid={errors.usermail} />
                          <Form.Control.Feedback type="invalid" className="ml-5">{errors.usermail}</Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="pwordusr" className="ml-2 mr-2">
                        <FormLabel className="text-dark pl-4 pt-2 login-labels">Contraseña</FormLabel>
                        <InputGroup>
                          <InputGroup.Prepend id="pword_prefix" className="pt-1 pr-2 font">
                            <i className="material-icons text-dark">vpn_key</i>
                          </InputGroup.Prepend>
                          <Form.Control type="password" size="sm" className="rounded" aria-describedby="pword_prefix" name="userpass" defaultValue={values.userpass}
                              onChange={handleChange} onBlur={handleBlur} isValid={!!errors.userpass && values.userpass.lenght > 7} isInvalid={errors.userpass} />
                          <Form.Control.Feedback type="invalid" className="ml-5">{errors.userpass}</Form.Control.Feedback>
                          <Form.Control.Feedback type="valid" className="ml-5">Contraseña correcta!</Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="pconfirm" className="ml-2 mr-2">
                        <FormLabel className="text-dark pl-4 pt-2 login-labels">Confirmar contraseña</FormLabel>
                        <InputGroup>
                          <InputGroup.Prepend id="pconf_prefix" className="pt-1 pr-2 font">
                            <i className="material-icons text-dark">check_circle_outline</i>
                          </InputGroup.Prepend>
                          <Form.Control type="password" size="sm" className="rounded" aria-describedby="pconf_prefix" name="passconf" defaultValue={values.passconf}
                              onChange={handleChange} onBlur={handleBlur} isValid={!!errors.passconf && values.passconf.lenght > 7} isInvalid={errors.passconf} />
                          <Form.Control.Feedback type="invalid" className="ml-5">{errors.passconf}</Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row className="justify-content-end">
                      <Col xs="4" sm="6">
                        <Button type="submit" variant="outline-info" className="login-labels" block
                                disabled={errors.username || errors.usermail || errors.userpass || errors.passconf}>Crear cuenta</Button>
                      </Col>
                    </Form.Row>
                  </Form>
              </div>
            </Col>
          </Row>
        </Container>
        )}</Formik>
        </ModalBody>
      </ModalDialog>
    );
  }

  userSignUp() {
    alert('Registrando....');
    this.doneSignup();
  } 

  signInUser() {
    alert('Ingresando....');
  }
}

export default Signup;
