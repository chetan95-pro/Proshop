import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({history, match}) => {
    const dispatch = useDispatch();
    const orderId = match.params.id;
    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;
    const [sdkReady, setSdkReady] = useState(false);
    const paypalOptions = {
        clientId: 'AWwM71I3WIWAgq_TUNKOPQ4ITj3dJ3cF1OeuNLCtE3ZLs5ViCXzKuDNMQ6Sgx506neoWKff8VH55qoEf',
        intent: 'capture'
      }
    useEffect(() => {
        const addPayPalScript = async () => {
            const { data:clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script);
        }
        if(!order || order._id !== orderId || successPay) {
            dispatch({type: ORDER_PAY_RESET});
            dispatch(getOrderDetails(orderId))
        }else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [order, orderId, dispatch, successPay]);
    
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    }
   
    if(loading)
        return <Loader />
    if(error)
        return <Message variant="danger">{error}</Message>

    return (
        <>
            
            <Row>
                <Col md={8}>
                    <h1>ORDER {orderId}</h1>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p style={{margin:"5px 0"}}>
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p style={{margin:"5px 0"}}>
                            <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p style={{margin:"5px 0 10px"}}>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode}, {' '}
                            {order.shippingAddress.country}
                        </p>
                        {   order.isDelivered ? 
                                <Message variant="success">Delivered on: {order.deliveredAt}</Message> 
                            :
                                <Message variant="danger">Not Delivered</Message> 
                        }
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p style={{margin:"10px 0"}}>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {   order.isPaid ? 
                                <Message variant="success">Paid on: {order.paidAt}</Message> 
                            :
                                <Message variant="danger">Not Paid</Message> 
                        }
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message>Your cart is empty</Message>:
                            (
                                <ListGroup variant="fluid">
                                    {
                                        order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = {item.qty*item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))
                                    }
                                </ListGroup>
                            )}
                    </ListGroup.Item>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>   
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item> 
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>    
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>            
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton
                                            paypalOptions={paypalOptions}
                                            amount={order.totalPrice}
                                            onPaymentSuccess={successPaymentHandler}
                                            />

                                        )}
                                </ListGroup.Item>
                            )}                            
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>        
    );
}

export default OrderScreen;