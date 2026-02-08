import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag, HiArrowPathRoundedSquare } from 'react-icons/hi2'

const FeaturedSection = () => {
  return (
    <section className='p-16 bg-white'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
        {/* Feature 1 */}
        <div className='flex flex-col items-center'>
          <div className='p-4 rounded-full mb-4'>
            <HiShoppingBag className="text-xl mx-auto mb-2" />
            <h4 className='tracking-tighter mb-2'>FREE INTERNATIONAL SHIPPING</h4>
            <p className='text-gray-600 text-sm tracking-tighter'>On all orders over $100.00</p>
          </div>
        </div>
        {/* Feature 2 */}
        <div className='flex flex-col items-center'>
          <div className='p-4 rounded-full mb-4'>
            <HiArrowPathRoundedSquare className="text-xl mx-auto mb-2" />
            <h4 className='tracking-tighter mb-2'>45 DAYS RETURN</h4>
            <p className='text-gray-600 text-sm tracking-tighter'>money back guarantee</p>
          </div>
        </div>
        {/* Feature 3 */}
        <div className='flex flex-col items-center'>
          <div className='p-4 rounded-full mb-4'>
            <HiOutlineCreditCard className="text-xl mx-auto mb-2" />
            <h4 className='tracking-tighter mb-2'>SECURE CHECKOUT</h4>
            <p className='text-gray-600 text-sm tracking-tighter'>100% secure checkout process</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection