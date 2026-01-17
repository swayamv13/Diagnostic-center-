import React from 'react'

const Contact = () => {
  return (
    <div className='bg-gray-50 min-h-screen py-12'>
      <div className='section-padding max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden md:flex'>

          {/* Info Section */}
          <div className='bg-blue-900 text-white p-10 md:w-2/5 flex flex-col justify-between'>
            <div>
              <h2 className='text-3xl font-bold mb-6'>Contact Us</h2>
              <p className='text-blue-100 mb-8'>We are committed to providing the best diagnostic services. Reach out to us for home collection or any queries.</p>

              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <span className='text-2xl'>📍</span>
                  <div>
                    <h3 className='font-bold text-lg'>Address</h3>
                    <p className='text-blue-200 text-sm'>LBSM Road, Harharguttu,<br />Jamshedpur, 831002</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <span className='text-2xl'>📞</span>
                  <div>
                    <h3 className='font-bold text-lg'>Phone</h3>
                    <p className='text-blue-200 text-sm'>+91 95083 83139</p>
                    <p className='text-blue-200 text-xs mt-1'>(Swayam Vishwakarma)</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <span className='text-2xl'>📧</span>
                  <div>
                    <h3 className='font-bold text-lg'>Email</h3>
                    <p className='text-blue-200 text-sm'>support@rspathlab.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-10'>
              <p className='text-sm text-blue-200'>Follow us on</p>
              <div className='flex gap-4 mt-2'>
                <span className='w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-blue-900 transition-colors'>🐦</span>
                <span className='w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-blue-900 transition-colors'>📸</span>
                <span className='w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-blue-900 transition-colors'>📘</span>
              </div>
            </div>
          </div>

          {/* Map/Form Section placeholder or simple text */}
          <div className='p-10 md:w-3/5 bg-white flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4'>📍</div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>Visit Our Lab</h3>
              <p className='text-gray-500 mb-6'>Walk-ins are welcome! We open at 7:00 AM.</p>
              <button className='bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg'>
                Get Directions
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact