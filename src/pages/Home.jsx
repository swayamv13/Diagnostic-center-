
import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, healthPackages } from '../assets/assets'
import { CartContext } from '../context/CartContext'
import StepCarousel from '../components/StepCarousel'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  // Data for 'Most Prescribed Tests' (duplicating for infinite scroll later)
  const prescribedTestsRaw = [
    { id: 't1', name: 'TYPHI DOT/ SALMONELLA TYPHI IGM', prep: 'No special preparation required', freq: 'Daily', params: '1 parameter(s) covered', price: 440 },
    { id: 't2', name: 'DENGUE FEVER NS1 ANTIGEN, EIA', prep: 'No special preparation required', freq: 'Sample Daily by 12 noon; Report Same day', params: '1 parameter(s) covered', price: 750 },
    { id: 't3', name: 'COMPLETE BLOOD COUNT (CBC)', prep: 'No special preparation required', freq: 'Daily', params: '20 parameter(s) covered', price: 340 },
    { id: 't4', name: 'THYROID PROFILE TOTAL', prep: 'Fasting preferred', freq: 'Daily', params: '3 parameter(s) covered', price: 550 },
    { id: 't5', name: 'LIPID PROFILE', prep: 'Fasting 12 hrs required', freq: 'Daily', params: '8 parameter(s) covered', price: 600 },
    { id: 't6', name: 'HbA1c', prep: 'No special preparation required', freq: 'Daily', params: '2 parameter(s) covered', price: 440 },
  ];
  // Duplicate for infinite scroll
  const prescribedTests = [...prescribedTestsRaw, ...prescribedTestsRaw];

  // Infinite Scroll Logic (now applied to Prescribed Tests)
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollSpeed = 1; // Pixels per tick
    const delay = 20; // ms per tick

    const scrollInterval = setInterval(() => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
          scrollContainer.scrollLeft = 0;
        }
      }
    }, delay);

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  // Search Logic
  useEffect(() => {
    if (searchQuery.length > 1) { // Start searching after 1 char
      const results = healthPackages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.details && pkg.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setFilteredResults(results.slice(0, 5)); // Limit to 5 results
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'

  const showNotification = (message, type = 'success') => {
    setToastMsg(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle Home Visit Form Submit
  const handleHomeVisitSubmit = async (e) => {
    e.preventDefault();
    const form = e.target; // Store form reference
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const city = formData.get('city');

    try {
      // 1. Save to Firestore for "Call by Owner"
      await addDoc(collection(db, 'home_visits'), {
        name,
        phone,
        city,
        timestamp: serverTimestamp(),
        status: 'pending' // pending, contacted, completed
      });

      // 2. Open WhatsApp for "Real-time Messaging"
      const message = `Hi RS Path Lab, I would like to book a Home Visit.%0A%0A*Name*: ${name}%0A*Phone*: ${phone}%0A*City*: ${city}`;
      const whatsappUrl = `https://wa.me/919508383139?text=${message}`;
      window.open(whatsappUrl, '_blank');

      // Success Feedback
      showNotification("Request sent successfully! Our team will call you shortly.", "success");
      form.reset(); // Clear the form

    } catch (error) {
      console.error("Error submitting home visit request:", error);
      showNotification("Failed to submit request. Please try again.", "error");
    }
  };

  // Render Functions
  const renderWellnessCard = (pkg) => (
    <div key={pkg.id} className='bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300 flex flex-col relative group h-full'>
      {/* Image Placeholder */}
      <div className='h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden relative'>
        <div className='absolute bottom-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded z-10'>
          {pkg.discount}% discount
        </div>
        <img src={assets.header_img} className='w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-500 group-hover:scale-110' alt={pkg.name} />
      </div>

      <h3 className='font-bold text-gray-800 text-sm mb-1 uppercase truncate'>{pkg.name}</h3>
      <p className='text-xs text-gray-500 mb-3 truncate'>{pkg.details[2]}</p>

      <div className='flex items-center gap-2 mb-4 text-xs font-medium'>
        <button
          onClick={() => navigate(`/book/${pkg.id}`)}
          className='text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1'
        >
          Read More <span className='text-[10px]'>▶</span>
        </button>
      </div>

      <div className='mt-auto'>
        <div className='flex items-center gap-3 mb-4'>
          <span className='text-gray-400 line-through text-sm'>₹{pkg.originalPrice}</span>
          <span className='text-xl font-bold text-gray-900'>₹{pkg.discountedPrice}</span>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <button
            onClick={() => addToCart(pkg)}
            className='bg-blue-900 text-white text-xs font-bold py-2.5 rounded hover:bg-blue-800 transition-colors'
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(`/book/${pkg.id}`)}
            className='border border-gray-300 text-gray-700 text-xs font-bold py-2.5 rounded hover:bg-gray-50 transition-colors'
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderTestCard = (test, index) => (
    <div key={`${test.id}-${index}`} className='min-w-[300px] md:min-w-[350px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 flex flex-col flex-shrink-0'>
      {/* Header */}
      <div className='bg-[#FFC107] p-4 min-h-[60px] flex items-center mb-2'>
        <h3 className='font-bold text-gray-900 text-sm leading-tight uppercase'>{test.name}</h3>
      </div>

      {/* Body */}
      <div className='p-5 flex-1 flex flex-col gap-3 text-xs text-gray-600'>
        <div className='flex items-start gap-3'>
          <span className='text-gray-400 text-sm'>ⓘ</span>
          <span>{test.prep}</span>
        </div>
        <div className='flex items-start gap-3'>
          <span className='text-gray-400 text-sm'>📅</span>
          <span>{test.freq}</span>
        </div>
        <div className='flex items-start gap-3'>
          <span className='text-gray-400 text-sm'>🧪</span>
          <span>{test.params}</span>
        </div>

        {/* Price */}
        <div className='mt-auto pt-4'>
          <span className='text-xl font-bold text-blue-700'>₹{test.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className='px-5 pb-5 flex items-center justify-between'>
        <button
          onClick={() => {
            addToCart({ ...test, discountedPrice: test.price, details: [test.params] });
            showNotification("Added to Cart!", "success");
          }}
          className='bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-blue-800 transition-colors'
        >
          Book Now
          <div className='w-4 h-4 bg-[#FFC107] rounded-full flex items-center justify-center text-blue-800 text-[8px]'>
            ▶
          </div>
        </button>

        <button
          onClick={() => navigate(`/book/${test.id}`)}
          className='text-blue-600 text-xs font-medium hover:underline'
        >
          Know More
        </button>
      </div>
    </div>
  );

  return (
    <div className='bg-gray-50 relative overflow-x-hidden'>
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-down ${toastType === 'success' ? 'bg-green-600' : 'bg-red-500'} text-white`}>
          <span className='text-xl'>{toastType === 'success' ? '✅' : '❌'}</span>
          <span className='font-bold text-sm'>{toastMsg}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className='bg-gradient-to-r from-blue-50 via-white to-blue-50 relative pb-20 pt-10 md:pt-16'>
        {/* ... (Hero Content - unchanged) ... */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
          <div className='absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse-slow'></div>
          <div className='absolute top-40 right-0 w-80 h-80 bg-yellow-100 rounded-full blur-3xl opacity-50 '></div>
        </div>

        <div className='section-padding z-20 relative mb-8'>
          {/* SMART SEARCH BAR */}
          <div className='max-w-3xl mx-auto bg-white rounded-full shadow-lg border border-gray-200 flex items-center p-2 relative z-50'>
            <span className='pl-4 text-gray-400 text-xl'>🔍</span>
            <input
              type="text"
              placeholder="Search for tests, packages, or health checkups..."
              className='w-full px-4 py-2.5 outline-none text-gray-700 font-medium rounded-full bg-transparent'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className='bg-blue-900 text-white px-8 py-2.5 rounded-full font-bold hover:bg-blue-800 transition-colors hidden sm:block'>
              Search
            </button>

            {/* Autocomplete Dropdown */}
            {filteredResults.length > 0 && (
              <div className='absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up'>
                <div className='bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider'>Recommended Tests</div>
                <ul>
                  {filteredResults.map(pkg => (
                    <li
                      key={pkg.id}
                      onClick={() => navigate(`/book/${pkg.id}`)}
                      className='px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold'>
                          🧪
                        </div>
                        <div>
                          <p className='text-sm font-bold text-gray-800'>{pkg.name}</p>
                          <p className='text-[10px] text-gray-500'>Includes {pkg.details.length} Tests</p>
                        </div>
                      </div>
                      <span className='text-sm font-bold text-blue-900'>₹{pkg.discountedPrice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className='section-padding flex flex-col md:flex-row gap-12 items-center justify-between relative z-10'>

          {/* Left Content */}
          <div className='flex-1 space-y-8 animate-slide-up'>
            <div className='inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border border-yellow-200'>
              <span className='animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-600 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-yellow-600'></span>
              Healthkind Offer
            </div>

            <h1 className='text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-900 leading-[1.1]'>
              GET FULL BODY <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>HEALTH CHECKUP</span>
            </h1>

            <div className='flex items-center gap-6'>
              <div className='bg-red-500 text-white font-black text-3xl px-6 py-3 rounded-xl shadow-lg shadow-red-200 -rotate-3 hover:rotate-0 transition-transform cursor-default'>
                1+1
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-800 leading-tight'>FREE <span className='font-normal text-gray-500 text-lg'>on Advance &</span></p>
                <p className='text-xl font-bold text-gray-800'>Platinum Packages*</p>
              </div>
            </div>

            <p className='text-gray-500 max-w-lg text-lg leading-relaxed'>
              Join millions of satisfied families. Experience accurate reports, home collection convenience, and world-class care.
            </p>

            <button onClick={() => navigate('/Packages')} className='group bg-blue-900 text-white px-8 py-4 rounded-xl hover:bg-blue-800 transition-all font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2'>
              View All Packages
              <span className='group-hover:translate-x-1 transition-transform'>→</span>
            </button>
          </div>

          {/* Right Content (Glassmorphism Form) */}
          <div className='w-full md:w-[420px]'>
            <div className='relative'>
              {/* Decorative form border/glow */}
              <div className='absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur opacity-30'></div>

              <div className='relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 animate-fade-in duration-700 delay-200'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-xl font-extrabold text-gray-900'>Book Home Visit</h3>
                  <span className='bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase'>Safe & Hygienic</span>
                </div>

                <form className='space-y-5' onSubmit={handleHomeVisitSubmit}>
                  <div className='group'>
                    <input name="name" type="text" placeholder="Patient Name *" className='w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-700 shadow-sm group-hover:border-gray-300' required />
                  </div>
                  <div className='group'>
                    <input name="phone" type="tel" placeholder="Mobile Number *" className='w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-700 shadow-sm group-hover:border-gray-300' required />
                  </div>
                  <div className='group'>
                    <select name="city" className='w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-500 shadow-sm group-hover:border-gray-300 appearance-none'>
                      <option value="">Select City for Collection</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Jamshedpur">Jamshedpur</option>
                    </select>
                  </div>

                  <div className='flex items-start gap-3 mt-2'>
                    <div className='flex items-center h-5'>
                      <input id="agree" type="checkbox" className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500' required defaultChecked />
                    </div>
                    <label htmlFor="agree" className='text-xs text-gray-500 leading-snug'>
                      I authorize RS Path Lab to contact me via Call/SMS/WhatsApp. <span className='text-blue-600 font-bold'>T&C Apply.</span>
                    </label>
                  </div>

                  <button type="submit" className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 text-lg tracking-wide'>
                    Get a Call Back / WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className='section-padding mt-8'>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-gray-200/60 py-10'>
            {[
              { icon: '🛡️', title: 'Most Trusted', sub: 'by Doctors' },
              { icon: '📝', title: 'Over 1 Crore', sub: 'Satisfied Customers' },
              { icon: '🏅', title: 'NABL Approved', sub: 'Certified Labs' },
              { icon: '🏠', title: 'Home Collection', sub: 'On Time ✨' },
              { icon: '🧪', title: '3000+ Centres', sub: 'Pan India' },
            ].map((item, index) => (
              <div key={index} className='flex items-center gap-4 group cursor-default'>
                <span className='text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110'>{item.icon}</span>
                <div>
                  <p className='font-bold text-gray-800 text-sm group-hover:text-blue-900 transition-colors'>{item.title}</p>
                  <p className='text-xs text-gray-500 font-medium'>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. TOP WELLNESS PACKAGES (STEP CAROUSEL) */}
      <StepCarousel
        title="Top Wellness Packages"
        data={healthPackages}
        renderCard={renderWellnessCard}
        onViewAll={() => navigate('/Packages')}
        navigat={navigate}
      />

      {/* 3. MOST PRESCRIBED TESTS (INFINITE SCROLL) */}
      <section className='section-padding py-16 bg-white'>
        <div className='flex justify-between items-end mb-10'>
          <h2 className='text-3xl font-bold text-gray-900'>Most Prescribed Tests</h2>
          <button onClick={() => navigate('/Packages')} className='hidden md:block text-primary font-semibold hover:underline'>View All</button>
        </div>

        <div
          ref={scrollContainerRef}
          className='flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {prescribedTests.map(renderTestCard)}
        </div>
      </section>

      {/* FLOATING ACTION BUTTONS */}
      <div className='fixed bottom-8 right-8 z-40 flex flex-col gap-4'>
        {/* Call Button */}
        <a href="tel:919508383139" className='bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-bounce-slow delay-100'>
          <span className='text-2xl'>📞</span>
        </a>

        {/* WhatsApp Button */}
        <a href="https://wa.me/919508383139" target="_blank" rel="noreferrer" className='bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-bounce-slow'>
          <span className='text-3xl'>💬</span> {/* or real icon */}
        </a>
      </div>

    </div>
  )
}
