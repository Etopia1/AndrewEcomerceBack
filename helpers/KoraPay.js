// // "pk_test_htjJVR9pkM4NVDhx39vB8meFVyYJzxvP345Vsrpk";

// // sk_test_p6GYbTbvnS1Wbzi7zUoypdMdJUe8wYCPoetEcQ1b
// // "sk_test_p6GYbTbvnS1Wbzi7zUoypdMdJUe8wYCPoetEcQ1b"
// const KORAPAY_API_KEY = "pk_test_htjJVR9pkM4NVDhx39vB8meFVyYJzxvP345Vsrpk"
// const axios = require('axios');

// const KORAPAY_API_URL = 'https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js';

// // const initializePayment = async ({ amount, currency, customer }) => {
// //     try {
// //         const response = await axios.post(
// //             `${KORAPAY_API_URL}/transactions/initialize`,
// //             {
// //                 amount,
// //                 currency,
// //                 customer,
// //                 reference: `ref_${Date.now()}` // Unique reference for the transaction
// //             },
// //             {
// //                 headers: {
// //                     Authorization: `Bearer ${KORAPAY_API_KEY}`,
// //                     'Content-Type': 'application/json'
// //                 }
// //             }
// //         );

// //         return { success: true, data: response.data.data };
// //     } catch (error) {
// //         console.error('Error initializing payment:', error.response?.data || error.message);
// //         return { success: false, error: error.response?.data || error.message };
// //     }
// // };

// const initializePayment = async ({ amount, currency, customer }) => {
//     try {
//         const response = await axios.post(
//             `${KORAPAY_API_URL}/transactions/initialize`,
//             {
//                 amount,
//                 currency,
//                 customer,
//                 reference: `ref_${Date.now()}`, // Unique reference for the transaction
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${KORAPAY_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         // Log the response to inspect the structure
//         console.log('KoraPay Response:', response.data);

//         // Ensure we are correctly accessing the paymentUrl
//         return { success: true, data: response.data.data };
//     } catch (error) {
//         console.error('Error initializing payment:', error.response?.data || error.message);
//         return {
//             success: false,
//             error: error.response?.data || error.message,
//         };
//     }
// };


// const verifyPayment = async (reference) => {
//     try {
//         const response = await axios.get(
//             `${KORAPAY_API_URL}/transactions/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${KORAPAY_API_KEY}`
//                 }
//             }
//         );

//         const { data } = response.data;
//         if (data.status === 'success') {
//             return { success: true, data };
//         } else {
//             return { success: false, message: 'Payment verification failed.' };
//         }
//     } catch (error) {
//         console.error('Error verifying payment:', error.response?.data || error.message);
//         return { success: false, error: error.response?.data || error.message };
//     }
// };

// module.exports = {
//     initializePayment,
//     verifyPayment
// };


