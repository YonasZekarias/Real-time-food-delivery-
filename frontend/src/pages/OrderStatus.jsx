import React from 'react'

const steps=['Confirmed','Preparing','On the way','Delivered']
const currentState="Confirmed"

const OrderStatus = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
        <div className='bg-gray-100 rounded-lg p-10 shadow-lg flex flex-col items-center space-y-6'>
            <h1 className='text-3xl font-semibold text-center mb-6'>Order Status</h1>
            <div className='flex items-center mb-12'>
                {steps.map((step, index)=>(
                    
                    <div key={index} className="flex items-center">
                        <div className="flex flex-col items-center">
                            {step===currentState?<div className='flex items-center justify-center rounded-full h-12 w-12 
                            border-none bg-red-500 border-2 border-gray-500 text-black font-semibold'>
                                <i className='bx bx-check text-white text-xl'></i>
                            </div>:<div className='flex items-center justify-center rounded-full h-12 w-12
                            bg-white border-2 border-gray-500 text-black font-semibold'>
                                {index+1}
                            </div>}
                            
                            <p className='mt-2 text-sm font-semibold'>{step}</p>
                        </div>
                        {index !== steps.length - 1 && (
                            <div className="h-[2px] w-20 bg-gray-500 mx-2"></div>
                            )}
                    </div>
                    
                ))}
            </div>
            <div className='flex items-center justify-center mt-10'>
                <button className='px-10 py-3 text-white font-semibold 
                border-none rounded-3xl bg-red-500 mt-10'>View Your Order</button>
            </div>

    </div>
    </div>
  )
}

export default OrderStatus