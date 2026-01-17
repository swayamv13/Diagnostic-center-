import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

const Appointment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext)

  const [bookingType, setBookingType] = useState('home') // 'home' or 'lab'
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDate, setSelectedDate] = useState(0) // Index of date
  const [itemsToBook, setItemsToBook] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    notes: ''
  })

  // Address Suggestions Mock Data
  const addressSuggestions = [
    "Home: 123, Green Valley, MG Road, Bangalore",
    "Office: Tech Park, Block B, Whitefield",
    "Parents: 45, Old Lane, Indiranagar"
  ]
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Initialize from navigation state or Cart
  useEffect(() => {
    window.scrollTo(0, 0)

    if (location.state?.type === 'cart') {
      // Came from Cart
      setItemsToBook(cartItems)
      // Default to Home Collection for Cart (common use case) but allow toggle
      setBookingType('home')
    } else if (location.state?.type) {
      // Direct Booking
      setBookingType(location.state.type)
      if (location.state.package) {
        setItemsToBook([location.state.package])
      }
    } else {
      // Fallback or Direct Access
      navigate('/')
    }
  }, [location.state, cartItems, navigate])

  const calculateTotal = () => {
    return itemsToBook.reduce((total, item) => total + (item.discountedPrice || 0), 0)
  }

  const handleAddressSelect = (addr) => {
    setFormData({ ...formData, address: addr })
    setShowSuggestions(false)
  }

  // Mock Date & Time Slots
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      day: d.toLocaleString('default', { weekday: 'short' }),
      date: d.getDate(),
      fullDate: d
    }
  })

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]

  const handleBooking = (e) => {
    e.preventDefault()
    // Validation
    if (!selectedSlot) {
      alert("Please select a time slot")
      return
    }
    if (bookingType === 'home' && !formData.address) {
      alert("Please provide an address for home collection")
      return
    }

    // Mock Success
    const testNames = itemsToBook.map(i => i.name).join(", ")
    alert(`Booking Confirmed!\n\nType: ${bookingType === 'home' ? 'Home Collection' : 'Lab Visit'}\nTests: ${testNames}\nDate: ${dates[selectedDate].fullDate.toDateString()}\nTime: ${selectedSlot}`)

    // Clear cart if booking resulted from cart
    if (location.state?.type === 'cart') {
      clearCart()
    }

    navigate('/')
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-8 pb-20'>
      <div className='section-padding max-w-4xl mx-auto'>

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Book Appointment</h1>
          <p className='text-gray-500'>Complete your booking for <span className='font-semibold text-blue-900'>{itemsToBook.length} Test(s)</span></p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* Left Col: Booking Form */}
          <div className='lg:col-span-2 space-y-6'>

            {/* 1. Booking Type Selection */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs'>1</span>
                Choose Booking Type
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  onClick={() => setBookingType('home')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${bookingType === 'home' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <span className='text-2xl'>🏠</span>
                  <span className='font-bold'>Home Collection</span>
                  <span className='text-xs text-gray-500'>We come to you</span>
                </button>
                <button
                  onClick={() => setBookingType('lab')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${bookingType === 'lab' ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-200 hover:border-emerald-200'}`}
                >
                  <span className='text-2xl'>🏥</span>
                  <span className='font-bold'>Visit Lab</span>
                  <span className='text-xs text-gray-500'>Nearest Center</span>
                </button>
              </div>
            </div>

            {/* 2. Slot Selection */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs'>2</span>
                Select Date & Time
              </h2>

              {/* Dates Row */}
              <div className='flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide'>
                {dates.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`min-w-[70px] p-3 rounded-lg border text-center transition-all ${selectedDate === index ? 'border-blue-900 bg-blue-900 text-white' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <p className='text-xs opacity-75'>{item.day}</p>
                    <p className='font-bold text-lg'>{item.date}</p>
                  </button>
                ))}
              </div>

              {/* Time Grid */}
              <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(time)}
                    className={`py-2 px-1 rounded-md text-sm font-medium border transition-all ${selectedSlot === time ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Patient Details Form */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs'>3</span>
                Patient Details
              </h2>

              <form onSubmit={handleBooking} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                    <input
                      type="text"
                      required
                      className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                      placeholder="Patient Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                    <input
                      type="tel"
                      required
                      className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Address - Only for Home Collection */}
                {bookingType === 'home' && (
                  <div className='space-y-4 animate-fadeIn'>
                    <div className='relative'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                      <textarea
                        required
                        rows="3"
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                        placeholder="Full address with landmarks"
                        value={formData.address}
                        onFocus={() => setShowSuggestions(true)}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      ></textarea>

                      {/* Address Suggestions Dropdown */}
                      {showSuggestions && (
                        <div className='absolute z-10 w-full left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                          <div className='p-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500'>SUGGESTED ADDRESSES</div>
                          {addressSuggestions.map((addr, i) => (
                            <div
                              key={i}
                              onClick={() => handleAddressSelect(addr)}
                              className='p-3 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 text-gray-700'
                            >
                              {addr}
                            </div>
                          ))}
                          <div
                            onClick={() => setShowSuggestions(false)}
                            className='p-2 text-center text-xs text-blue-600 cursor-pointer hover:underline'
                          >
                            Close Suggestions
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Pincode</label>
                      <input
                        type="text"
                        required
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                        placeholder="Area Pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Note for Lab Visit */}
                {bookingType === 'lab' && (
                  <div className='bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-800 text-sm'>
                    <p><strong>Note:</strong> Please arrive 10 minutes before your scheduled slot at our nearest center.</p>
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Right Col: Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-xl shadow-lg border border-blue-100 sticky top-24'>
              <h3 className='font-bold text-gray-900 mb-4'>Order Summary</h3>

              {/* Item List */}
              <div className='mb-4 max-h-60 overflow-y-auto pr-1'>
                {itemsToBook.map((item, idx) => (
                  <div key={idx} className='flex justify-between items-start py-2 border-b border-gray-100 last:border-0'>
                    <div>
                      <p className='font-medium text-gray-800 text-sm'>{item.name}</p>
                      <p className='text-xs text-gray-500'>{bookingType === 'home' ? 'Home Collection' : 'Lab Visit'}</p>
                    </div>
                    <p className='font-bold text-gray-900 text-sm'>₹{item.discountedPrice}</p>
                  </div>
                ))}
              </div>

              <div className='bg-gray-50 p-3 rounded-lg mb-6'>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='text-gray-500'>Date</span>
                  <span className='font-medium'>{dates[selectedDate].fullDate.toLocaleDateString()}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Time</span>
                  <span className='font-medium'>{selectedSlot || 'Select Slot'}</span>
                </div>
              </div>

              <div className='flex justify-between items-center mb-6 pt-2 border-t border-gray-100'>
                <span className='font-bold text-lg'>Total</span>
                <span className='font-black text-2xl text-blue-900'>₹{calculateTotal()}</span>
              </div>

              <button
                onClick={handleBooking}
                className='w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20'
              >
                Confirm Booking
              </button>

              <p className='text-center text-xs text-gray-400 mt-4'>
                By booking, you agree to our Terms & Conditions
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Appointment