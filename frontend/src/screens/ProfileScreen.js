import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';

import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrder } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';


const RegisterScreen = ({history, location}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderListMy = useSelector(state => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
    useEffect(() => {
        if(!userInfo){
            history.push('/login');
        }else{
            if(!user || !user.name || success){
                dispatch({type: USER_UPDATE_PROFILE_RESET});
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrder())
            }else{
                setName(user.name);
                setEmail(user.email);
            }
        }
    },[history, userInfo, dispatch, user, success]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(password === ""){
            setMessage("Password is required");
            return;
        }
        if(password !== confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(updateUserProfile({_id: user._id, name, email, password}));
        }
    }
    return (
           <Row>
               <Col md={3}>
                    <>
                        <h2>User Profile</h2>
                        {message && <Message variant="danger">{message}</Message>}
                        {error && !message && <Message variant="danger">{error}</Message>}
                        {success && <Message varient="success">Success</Message>}
                        {loading && <Loader />}
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="name" placeholder="Enter name"
                                    value={name} onChange={(e) => setName(e.target.value)} >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} >
                                </Form.Control>                    
                            </Form.Group>
                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} >
                                </Form.Control>                    
                            </Form.Group>
                            <Button type="submit" variant="primary">
                                Update
                            </Button>
                        </Form>                
                    </>
               </Col>
               <Col md={9}>
                   <h2>My Orders</h2>
                   {loadingOrders ? <Loader /> : errorOrders ? <Message variant="danger">{errorOrders}</Message>: (<Table striped bordered hover responsive className="table-sm">
                       <thead>
                           <tr>
                               <th>
                                   ID
                               </th>
                               <th>Date</th>
                               <th>Total</th>
                               <th>Paid</th>
                               <th>Delivered</th>
                               <th></th>
                           </tr>
                       </thead>
                       <tbody>
                           {orders.map(o => (
                               <tr key={o._id}>
                                   <td>{o._id}</td>
                                   <td>{o.createdAt}</td>
                                   <td>{o.totalPrice}</td>
                                   <td>{o.isPaid ? (o.paidAt.substring(0, 10)) : (
                                       <i className="fas fas-times" style={{color: 'red'}}></i>
                                   )}</td>
                                   <td>{o.isDelivered ? (o.deliveredAt.substring(0, 10)) : (
                                       <i className="fas fas-times" style={{color: 'red'}}></i>
                                   )}</td>
                                    <td>
                                        <LinkContainer to={`/order/${o._id}`}>
                                            <Button className="btn-sm" variant="light">Details</Button>
                                        </LinkContainer>
                                    </td>
                               </tr>
                           ))}
                       </tbody>
                   </Table>)}
               </Col>
           </Row>
    );
}

export default RegisterScreen;