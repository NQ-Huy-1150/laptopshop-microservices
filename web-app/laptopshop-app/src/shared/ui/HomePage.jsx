import React from 'react'
import { Outlet } from 'react-router-dom'
import { Row, Col, Container } from 'react-bootstrap'
import NavbarApp from './NavBar'
import HeroShow from './SlideShow'
export default function HomePage() {
    return (
        <>
            <NavbarApp />
            <Container className="my-4">
                <Row className="justify-content-center">
                    <Col xs={12} lg={12}>
                        <HeroShow />
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col xs={12}>
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    )
}
