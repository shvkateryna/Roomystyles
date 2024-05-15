import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContexts";
import { Link } from "react-router-dom"
import NavBar from "./NavBar";
import Map from "../components/Map"

export default function ForgotPassword() {
    const [isHover, setIsHover] = useState(false)
    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Заглянь на пошту за подальшими інструкціями')
        } catch {
            setError('Не вдалосяя відновити пароль')
        }
        setLoading(false)
    }

    return (
        <div>
            <NavBar />
            <Container className='align-items-center justify-content-center' style={{ justifyContent: "center", minHeight: '60vh', maxWidth: '450px', marginTop: "80px" }}>
                <Card>
                    <Card.Body style={{backgroundColor: "#FDF2E9", borderRadius: '5px', border: "none"}}>
                        <h2 className='text-center mb-4' style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "18px", textTransform: 'uppercase', letterSpacing: '5px'}}><strong>Скинути пароль</strong></h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        {message && <Alert variant='success'>{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id='email'>
                                <Form.Label style={{color: "black", fontFamily: 'Montserrat Medium 500', fontSize: "16px"}}>Корпоративна пошта</Form.Label>
                                <Form.Control type='email' ref={emailRef} required></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} className='w-100' type='submit' style={{backgroundColor: "#f7d474", border: "none", borderRadius: "12px", marginTop: "15px", height: "65px", fontFamily: 'Montserrat Medium 500', fontSize: "16px", backgroundColor: isHover ? '#efd8b5' : '#f3e8c9', color: isHover ? 'black' : 'black', padding: '15px'}}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                Скинути пароль
                            </Button>
                        </Form>
                        <div className='w-100 text-center mt-3'>
                            <Link to="/login" style={{color: "black", fontFamily: 'Montserrat Medium 500', marginTop: "40px", fontSize: '16px'}}>Увійти</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
            <div className="greeting">
                <strong><p>Вітаємо вдома!</p></strong>
                <Map />
            </div>
        </div>
    )
}

