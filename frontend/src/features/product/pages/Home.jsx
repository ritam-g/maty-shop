import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { UseProduct } from '../hooks/useProduct';

function Home() {
    const product = useSelector(state => state.product)
    const { getAllProductHandeller } = UseProduct()

    useEffect(() => {
        getAllProductHandeller()
    }, [])
    //! checks the state
    console.log(product.allProducts);

    return (
        <div>
            <h1>i am Home </h1>
        </div>
    )
}

export default Home
