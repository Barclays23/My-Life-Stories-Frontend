// import React, { useEffect, useState } from 'react';
// import apiCalls from '../../../utils/api';





// const AllMoments = () => {
//   const [moments, setMoments] = useState([]);

//   useEffect(() => {
//     const loadMoments = async () => {
//       const res = await apiCalls.getAllMoments();
//       setMoments(res.data || []);
//     };
//     loadMoments();
//   }, []);

//   return (
//     <section className='p-6'>
//       <h1 className='text-2xl font-bold mb-6'>All Moments</h1>
//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//         {moments.map(moment => (
//           <div key={moment._id} className='border rounded shadow p-4'>
//             {moment.momentImage && (
//               <img src={moment.momentImage} alt={moment.momentTitle} className='w-full h-48 object-cover rounded mb-4' />
//             )}
//             <h2 className='font-semibold text-lg mb-2'>{moment.momentTitle}</h2>
//             <p className='text-sm text-gray-600'>{moment.momentContent.slice(0, 100)}...</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default AllMoments;
