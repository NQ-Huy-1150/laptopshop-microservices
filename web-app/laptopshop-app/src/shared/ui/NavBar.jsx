import { Navbar, Nav, Form, Button, Container, NavDropdown } from "react-bootstrap";
import { useState } from "react";
import logo from "../../assets/react.svg";
import RegisterForm from "./Register";
import LoginForm from "./Login";

export default function NavbarApp({ isLogin = false }) {
    const [show, setShow] = useState({
        showRegister: false,
        showLogin: false
    });
    const handleShowLogin = () => setShow({
        showRegister: false,
        showLogin: true
    });
    const handleShowRegister = () => setShow({
        showRegister: true,
        showLogin: false
    });
    const handleCloseRegister = () => setShow({
        ...show, showRegister: false
    });
    const handleCloseLogin = () => setShow({
        ...show, showLogin: false
    });
    return (
        <Navbar expand="lg" className="bg-body-tertiary w-100" collapseOnSelect>
            <Container fluid>
                <Navbar.Brand href="#home" className="d-flex align-items-center">
                    <img
                        src={logo}
                        alt="logo"
                        width={30}
                        height={30}
                        className="d-inline-block align-top me-2"
                    />
                    Laptop Shop
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Form
                        className="d-flex mx-auto my-2 my-lg-0"
                        style={{ width: "100%", maxWidth: "400px" }}
                    >
                        <Form.Control
                            type="search"
                            placeholder="Hãy nhập sản phẩm cần tìm ..."
                            className="me-2 rounded"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </Button>
                    </Form>

                    {
                        isLogin ? (
                            <>
                                <Nav.Link href="#home" className="me-3 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
                                        <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                    </svg>
                                </Nav.Link>


                                <Nav>
                                    <NavDropdown title="Xin chào, user" align="end">
                                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action4">Profile</NavDropdown.Item>
                                        <NavDropdown.Item href="#action4">
                                            Lịch sử mua hàng
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action5">
                                            Đăng xuất
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </>
                        ) : (
                            <>
                                <Nav.Link onClick={handleShowRegister} href="#home" className="me-3 p-2">
                                    Đăng ký
                                </Nav.Link>
                                <Nav.Link onClick={handleShowLogin} className="me-3 p-2">
                                    Đăng nhập
                                </Nav.Link>
                                <RegisterForm 
                                    show={show.showRegister} 
                                    handleClose={handleCloseRegister} 
                                    switchToLogin={handleShowLogin} 
                                />
                                <LoginForm 
                                    show={show.showLogin} 
                                    handleClose={handleCloseLogin} 
                                    switchToRegister={handleShowRegister} 
                                />
                            </>
                        )
                    }


                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}