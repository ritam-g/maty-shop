import React, { useEffect, useState } from 'react'
import { UseProduct } from '../hooks/useProduct'
import { useParams } from 'react-router-dom'

function ProductDetailPage() {
   const { getProductByIdHandeller } = UseProduct()
   const [producnt, setproducnt] = useState(null)
   const { productId } = useParams()
   useEffect(()=>{
    
    setproducnt(getProductByIdHandeller(productId))
    console.log('====================================');
    console.log(producnt);
    console.log('====================================');
   })
  return (
    <div>
      
    </div>
  )
}

export default ProductDetailPage
