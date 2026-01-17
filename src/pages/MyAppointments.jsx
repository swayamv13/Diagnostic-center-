import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  // In a real app, appointments would come from a backend or context. 
  // For now, we'll assume empty or mock some data if we had it.
  // Let's create a placeholder that encourages booking.

  // Mock Appointments (comment out to see empty state)
  // const appointments = [
  //     { id: 1, test: "Full Body Checkup", date: "22 Jan 2024", time: "10:00 AM", status: "Scheduled", type: "Home Collection" }
  // ];
  const appointments = [];

  const navigate = useNavigate();

  return (
    <div className='bg-gray-50 min-h-screen py-10 section-padding'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>My Appointments</h1>

        {appointments.length > 0 ? (
          <div className='space-y-4'>
            {appointments.map(app => (
              <div key={app.id} className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between'>
                <div>
                  <h3 className='font-bold text-lg text-gray-800'>{app.test}</h3>
                  <p className='text-sm text-gray-500'>📅 {app.date} | ⏰ {app.time}</p>
                  <span className='inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded mt-2'>{app.type}</span>
                </div>
                <div className='flex flex-col gap-2'>
                  <button className='text-sm bg-green-100 text-green-700 font-bold px-4 py-2 rounded-lg cursor-default'>
                    {app.status}
                  </button>
                  <button className='text-sm border border-red-200 text-red-500 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors'>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-xl p-12 text-center border border-dashed border-gray-300'>
            <div className='w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-pulse'>
              📅
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>No scheduled appointments</h2>
            <p className='text-gray-500 mb-8 max-w-md mx-auto'>You haven't booked any tests yet. Take the first step towards better health today.</p>

            <button
              onClick={() => navigate('/Packages')}
              className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all'
            >
              Explore Packages
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments