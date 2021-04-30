import React, { useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { listProducts } from '../actions/productActions';

import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';

const HomeScreen = () => {
    const dispatch = useDispatch(); 
    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);
    const { loading, error, products } = useSelector(state => state.productList);
    return (
        <>
            <h1>Latest Products</h1>
            {
                loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : <Row>
                    {
                        products.map((product, i) => {
                            return (<Col key={i} sm={12} md={6} lg={3}>
                            <Product product={product} />
                            </Col>);
                        })
                    }
                </Row>
            }
            
        </>
    );
}

export default HomeScreen;