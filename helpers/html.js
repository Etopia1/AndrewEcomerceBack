const signUpTemplate = (verifyLink, fullName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Foodapi!</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background-color: #fff;
          }
          .header {
            background: linear-gradient(90deg, #ff6600, #00cc66);
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: #fff;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 20px;
            color: #333;
          }
          .footer {
            background: #333;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #ccc;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background-color: #ff9900;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Foodapi!</h1>
          </div>
          <div class="content">
            <p>Hello, ${fullName},</p>
            <p>Thank you for joining our community! We're thrilled to have you on board.</p>
            <p>Please click the button below to verify your account:</p>
            <p>
              <a href="${verifyLink}" class="button">Verify My Account</a>
            </p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,<br>Foodapi Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Groceria. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
    
    
  const verifyTemplate = (verifyLink, fullName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background-color: #fff;
          }
          .header {
            background: linear-gradient(90deg, #ff6600, #00cc66);
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: #fff;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 20px;
            color: #333;
          }
          .footer {
            background: #333;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #ccc;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background-color: #ff9900;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Account</h1>
          </div>
          <div class="content">
            <p>Hello, ${fullName},</p>
            <p>We're excited to have you on board! Please click the button below to verify your account:</p>
            <p>
              <a href="${verifyLink}" class="button">Verify My Account</a>
            </p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,<br>Groceria Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Groceria. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  const forgotPasswordTemplate = (resetLink, fullName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background-color: #fff;
          }
          .header {
            background: linear-gradient(90deg, #ff6600, #00cc66);
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: #fff;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 20px;
            color: #333;
          }
          .footer {
            background: #333;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #ccc;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background-color: #ff9900;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hello, ${fullName},</p>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
            <p>Click the button below to reset your password:</p>
            <p>
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>Best regards,<br>Groceria Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Groceria. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  const passwordChangeTemplate = (fullName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successfully</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            background-color: #fff;
          }
          .header {
            background: linear-gradient(90deg, #ff6600, #00cc66);
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            color: #fff;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 20px;
            color: #333;
          }
          .footer {
            background: #333;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #ccc;
            border-radius: 0 0 10px 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Changed Successfully</h1>
          </div>
          <div class="content">
            <p>Hello, ${fullName},</p>
            <p>We received a request to reset your password, and your password has been successfully changed.
            If you did not approve this change kindly reach out to the Admin.</p>
            <p>Best regards,<br>Groceria Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Groceria. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  // const newOrderNotificationTemplate = (merchantName, userName, userEmail, userAddress, userOrderId, orderDate, items, totalPrice) => {
  //   return `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <title>New Order Notification</title>
  //       <style>
  //         body {
  //           font-family: Arial, sans-serif;
  //           line-height: 1.6;
  //           color: #333;
  //           background-color: #f7f7f7;
  //           margin: 0;
  //           padding: 0;
  //         }
  //         .container {
  //           max-width: 600px;
  //           margin: 40px auto;
  //           padding: 20px;
  //           border: 1px solid #ddd;
  //           border-radius: 10px;
  //           box-shadow: 0 0 10px rgba(0,0,0,0.1);
  //           background-color: #fff;
  //         }
  //         .header {
  //           background: linear-gradient(90deg, #ff6600, #00cc66);
  //           padding: 10px;
  //           text-align: center;
  //           border-bottom: 1px solid #ddd;
  //           color: #fff;
  //           border-radius: 10px 10px 0 0;
  //         }
  //         .content {
  //           padding: 20px;
  //           color: #333;
  //         }
  //         .order-details {
  //           width: 100%;
  //           border-collapse: collapse;
  //           margin-bottom: 20px;
  //         }
  //         .order-details th, .order-details td {
  //           padding: 8px;
  //           border: 1px solid #ddd;
  //         }
  //         .order-details th {
  //           text-align: left;
  //           background-color: #f2f2f2;
  //         }
  //         .footer {
  //           background: #333;
  //           padding: 10px;
  //           text-align: center;
  //           font-size: 0.9em;
  //           color: #ccc;
  //           border-radius: 0 0 10px 10px;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <div class="header">
  //           <h1>New Order Notification</h1>
  //         </div>
  //         <div class="content">
  //           <p>Hello, ${merchantName},</p>
  //           <p>We are pleased to inform you that a new order has been placed by ${userName}, contact information: (${userEmail}).</p>
  //           <p>Order Details:</p>
  //           <table class="order-details">
  //             <thead>
  //               <tr>
  //                 <th>Order ID</th>
  //                 <th>Order Date</th>
  //                 <th>Total Price</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>${userOrderId}</td>
  //                 <td>${orderDate}</td>
  //                 <td>₦${totalPrice}</td>
  //               </tr>
  //             </tbody>
  //           </table>
  
  //           <h2>Items Ordered</h2>
  //           <table class="order-details">
  //             <thead>
  //               <tr>
  //                 <th>Product Name</th>
  //                 <th>Quantity</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               ${items.map(item => `
  //                 <tr>
  //                   <td>${item.productName}</td>
  //                   <td>${item.quantity}</td>
  //                 </tr>
  //               `).join('')}
  //             </tbody>
  //           </table>
  
  //           <h2>Shipping Address</h2>
  //           <p>${userAddress}</p>
  
  //           <p>Please take necessary actions to process this order.</p>
  //           <p>Best regards,<br>Groceria Team</p>
  //         </div>
  //         <div class="footer">
  //           <p>&copy; ${new Date().getFullYear()} Groceria. All rights reserved.</p>
  //         </div>
  //       </div>
  //     </body>
  //     </html>
  //   `;
  // };
//   const orderConfirmationTemplate = (fullName, userOrderId, orderDate, items, totalAmount, deliveryCharge) => {
//     return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Order Confirmation</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 line-height: 1.6;
//                 color: #333;
//                 background-color: #f7f7f7;
//                 margin: 0;
//                 padding: 0;
//             }
//             .container {
//                 max-width: 600px;
//                 margin: 40px auto;
//                 padding: 20px;
//                 border: 1px solid #ddd;
//                 border-radius: 10px;
//                 box-shadow: 0 0 10px rgba(0,0,0,0.1);
//                 background-color: #fff;
//             }
//             .header {
//                 background: linear-gradient(90deg, #00cc66, #ff6600);
//                 padding: 10px;
//                 text-align: center;
//                 border-bottom: 1px solid #ddd;
//                 color: #fff;
//                 border-radius: 10px 10px 0 0;
//             }
//             .content {
//                 padding: 20px;
//                 color: #333;
//             }
//             .order-details {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-bottom: 20px;
//             }
//             .order-details th, .order-details td {
//                 padding: 8px;
//                 border: 1px solid #ddd;
//             }
//             .order-details th {
//                 text-align: left;
//                 background-color: #f2f2f2;
//             }
//             .items-ordered {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-bottom: 20px;
//             }
//             .items-ordered th, .items-ordered td {
//                 padding: 8px;
//                 border: 1px solid #ddd;
//             }
//             .items-ordered th {
//                 text-align: left;
//                 background-color: #f2f2f2;
//             }
//             .footer {
//                 background: #333;
//                 padding: 10px;
//                 text-align: center;
//                 font-size: 0.9em;
//                 color: #ccc;
//                 border-radius: 0 0 10px 10px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 <h1>Order Confirmation</h1>
//             </div>
//             <div class="content">
//                 <p>Hello, ${fullName},</p>
//                 <p>We are pleased to confirm that your order has been successfully placed. Below are the details of your order:</p>
//                 <table class="order-details">
//                     <thead>
//                         <tr>
//                             <th>Order ID</th>
//                             <th>Order Date</th>
//                             <th>Total Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>${userOrderId}</td>
//                             <td>${orderDate}</td>
//                             <td>₦${totalAmount}</td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 <h2>Items Ordered</h2>
//                 <table class="items-ordered">
//                     <thead>
//                         <tr>
//                             <th>Product Name</th>
//                             <th>Quantity</th>
//                             <th>Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${items.map(item => `
//                             <tr>
//                                 <td>${item.productName}</td>
//                                 <td>${item.quantity}</td>
//                                 <td>₦${item.price}</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>

//                 <h2>Order Summary</h2>
//                 <table class="order-details">
//                     <tbody>
//                         <tr>
//                             <td>Subtotal:</td>
//                             <td>₦${totalAmount - deliveryCharge}</td>
//                         </tr>
//                         <tr>
//                             <td>Shipping Cost:</td>
//                             <td>₦${deliveryCharge}</td>
//                         </tr>
//                         <tr>
//                             <td><strong>Total:</strong></td>
//                             <td><strong>₦${totalAmount}</strong></td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 <p>Thank you for shopping with us!</p>
//                 <p>Best regards,<br>Groceria Team</p>
//             </div>
//             <div class="footer">
//                 <p>&copy; ${new Date().getFullYear()} Groceria. All rights reserved.</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
// }
const newOrderNotificationTemplate = (merchantName, userName, userEmail, userAddress, userOrderId, orderDate, items, totalPrice) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          background: linear-gradient(90deg, #007bff, #00ccff);
          padding: 20px;
          text-align: center;
          color: #fff;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          margin-top: 20px;
          color: #007bff;
          font-size: 20px;
        }
        .order-details, .items-ordered {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .order-details th, .order-details td,
        .items-ordered th, .items-ordered td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .order-details th, .items-ordered th {
          background-color: #f2f2f2;
        }
        .items-ordered td img {
          max-width: 50px;
          height: auto;
          border-radius: 5px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          padding: 10px;
          font-size: 0.9em;
          color: #777;
          border-top: 1px solid #ddd;
        }
           @media (max-width: 480px) {
              .header h1 {
                  font-size: 20px;
              }
              .content h2 {
                  font-size: 18px;
              }
              .order-details th, .order-details td,
              .items-ordered th, .items-ordered td {
                  font-size: 14px;
                  padding: 8px;
              }
          }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Notification</h1>
        </div>
        <div class="content">
          <p>Hello, <strong>${merchantName}</strong>,</p>
          <p>We are pleased to inform you that a new order has been placed by <strong>${userName}</strong> (Contact: ${userEmail}).</p>
          
          <h2>Order Details</h2>
          <table class="order-details">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${userOrderId}</td>
                <td>${orderDate}</td>
                <td>₦${totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <h2>Items Ordered</h2>
          <table class="items-ordered">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td><img src="${item.productImage}" alt="${item.productName}"></td>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Shipping Address</h2>
          <p>${userAddress}</p>

          <p>Please take necessary actions to process this order.</p>
          <p>Best regards,<br><strong> Eto Shopping Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()}  Eto Shopping. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

// const newOrderNotificationTemplate = (sellerName, userOrderId, orderDate, items, totalAmount) => {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>New Order Notification</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               line-height: 1.6;
//               color: #333;
//               background-color: #f7f7f7;
//               margin: 0;
//               padding: 0;
//           }
//           .container {
//               max-width: 600px;
//               width: 90%;
//               margin: 20px auto;
//               padding: 20px;
//               border-radius: 10px;
//               box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//               background-color: #fff;
//           }
//           .header {
//               background: linear-gradient(90deg, #28a745, #85e085);
//               padding: 20px;
//               text-align: center;
//               color: #fff;
//               border-radius: 10px 10px 0 0;
//           }
//           .header h1 {
//               margin: 0;
//               font-size: 24px;
//           }
//           .content {
//               padding: 20px;
//           }
//           .content h2 {
//               margin-top: 20px;
//               color: #28a745;
//               font-size: 20px;
//           }
//           .order-details, .items-ordered {
//               width: 100%;
//               border-collapse: collapse;
//               margin-bottom: 20px;
//           }
//           .order-details th, .order-details td,
//           .items-ordered th, .items-ordered td {
//               padding: 10px;
//               border: 1px solid #ddd;
//               text-align: left;
//           }
//           .order-details th, .items-ordered th {
//               background-color: #f2f2f2;
//           }
//           .items-ordered td img {
//               max-width: 50px;
//               height: auto;
//               border-radius: 5px;
//           }
//           .footer {
//               margin-top: 20px;
//               text-align: center;
//               padding: 10px;
//               font-size: 0.9em;
//               color: #777;
//               border-top: 1px solid #ddd;
//           }

//           /* Responsive Design */
//           @media (max-width: 480px) {
//               .header h1 {
//                   font-size: 20px;
//               }
//               .content h2 {
//                   font-size: 18px;
//               }
//               .order-details th, .order-details td,
//               .items-ordered th, .items-ordered td {
//                   font-size: 14px;
//                   padding: 8px;
//               }
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="header">
//               <h1>New Order Notification</h1>
//           </div>
//           <div class="content">
//               <p>Hello, <strong>${sellerName}</strong>,</p>
//               <p>You have received a new order! Below are the details:</p>

//               <h2>Order Details</h2>
//               <table class="order-details">
//                   <thead>
//                       <tr>
//                           <th>Order ID</th>
//                           <th>Order Date</th>
//                           <th>Total</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       <tr>
//                           <td>${userOrderId}</td>
//                           <td>${orderDate}</td>
//                           <td>₦${totalAmount}</td>
//                       </tr>
//                   </tbody>
//               </table>

//               <h2>Items Ordered</h2>
//               <table class="items-ordered">
//                   <thead>
//                       <tr>
//                           <th>Image</th>
//                           <th>Product Name</th>
//                           <th>Quantity</th>
//                           <th>Price</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       ${items.map(item => `
//                           <tr>
//                               <td><img src="${item.productImage}" alt="${item.productName}"></td>
//                               <td>${item.productName}</td>
//                               <td>${item.quantity}</td>
//                               <td>₦${item.price}</td>
//                           </tr>
//                       `).join('')}
//                   </tbody>
//               </table>

//               <p>We hope you deliver promptly to ensure customer satisfaction.</p>
//               <p>Best regards,<br><strong> Eto Shopping Team</strong></p>
//           </div>
//           <div class="footer">
//               &copy; ${new Date().getFullYear()} Eto Shopping. All rights reserved.
//           </div>
//       </div>
//   </body>
//   </html>
//   `;
// };


const orderConfirmationTemplate = (fullName, userOrderId, orderDate, items, totalAmount, deliveryCharge) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              background-color: #fff;
          }
          .header {
              background: linear-gradient(90deg, #007bff, #00ccff);
              padding: 20px;
              text-align: center;
              color: #fff;
              border-radius: 10px 10px 0 0;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
          }
          .content h2 {
              margin-top: 20px;
              color: #007bff;
              font-size: 20px;
          }
          .order-details, .items-ordered {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
          }
          .order-details th, .order-details td,
          .items-ordered th, .items-ordered td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
          }
          .order-details th, .items-ordered th {
              background-color: #f2f2f2;
          }
          .items-ordered td img {
              max-width: 50px;
              height: auto;
              border-radius: 5px;
          }
          .summary {
              margin-top: 20px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .footer {
              margin-top: 20px;
              text-align: center;
              padding: 10px;
              font-size: 0.9em;
              color: #777;
              border-top: 1px solid #ddd;
          }
               @media only screen and (max-width: 600px) {
              .container {
                  width: 90%;
                  margin: 10px auto;
                  padding: 10px;
              }
              .header h1 {
                  font-size: 20px;
              }
              .content h2 {
                  font-size: 18px;
              }
              .order-details th, .order-details td,
              .items-ordered th, .items-ordered td {
                  font-size: 14px;
                  padding: 8px;
              }
              .items-ordered td img {
                  max-width: 40px;
              }
              .summary p {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Order Confirmation</h1>
          </div>
          <div class="content">
              <p>Hello, <strong>${fullName}</strong>,</p>
              <p>Your order has been successfully placed! Below are the details:</p>

              <h2>Order Details</h2>
              <table class="order-details">
                  <thead>
                      <tr>
                          <th>Order ID</th>
                          <th>Order Date</th>
                          <th>Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${userOrderId}</td>
                          <td>${orderDate}</td>
                          <td>₦${totalAmount}</td>
                      </tr>
                  </tbody>
              </table>

              <h2>Items Ordered</h2>
              <table class="items-ordered">
                  <thead>
                      <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${items.map(item => `
                          <tr>
                              <td><img src="${item.productImage}" alt="${item.productName}"></td>
                              <td>${item.productName}</td>
                              <td>${item.quantity}</td>
                              <td>₦${item.price}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>

              <h2>Order Summary</h2>
              <div class="summary">
                  <p><strong>Subtotal:</strong> ₦${totalAmount - deliveryCharge}</p>
                  <p><strong>Shipping:</strong> ₦${deliveryCharge}</p>
                  <p><strong>Total:</strong> ₦${totalAmount}</p>
              </div>

              <p>Thank you for shopping with us!</p>
              <p>Best regards,<br><strong> Eto Shopping Team</strong></p>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()}  Eto Shopping. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};
// const orderConfirmationTemplate = (fullName, userOrderId, orderDate, items, totalAmount, deliveryCharge) => {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Order Confirmation</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               line-height: 1.6;
//               color: #333;
//               background-color: #f7f7f7;
//               margin: 0;
//               padding: 0;
//           }
//           .container {
//               max-width: 600px;
//               margin: 20px auto;
//               padding: 20px;
//               border-radius: 10px;
//               box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//               background-color: #fff;
//           }
//           .header {
//               background: linear-gradient(90deg, #007bff, #00ccff);
//               padding: 20px;
//               text-align: center;
//               color: #fff;
//               border-radius: 10px 10px 0 0;
//           }
//           .header h1 {
//               margin: 0;
//               font-size: 24px;
//           }
//           .content {
//               padding: 20px;
//           }
//           .content h2 {
//               color: #007bff;
//               font-size: 20px;
//               margin-bottom: 10px;
//           }
//           .order-details, .items-ordered {
//               width: 100%;
//               border-collapse: collapse;
//               margin-bottom: 20px;
//           }
//           .order-details th, .order-details td,
//           .items-ordered th, .items-ordered td {
//               padding: 10px;
//               border: 1px solid #ddd;
//               text-align: left;
//           }
//           .items-ordered td img {
//               max-width: 50px;
//               height: auto;
//               border-radius: 5px;
//           }
//           .summary {
//               background-color: #f9f9f9;
//               padding: 15px;
//               border-radius: 5px;
//               box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//               margin-bottom: 20px;
//           }
//           .footer {
//               text-align: center;
//               font-size: 0.9em;
//               color: #777;
//               padding: 10px;
//               border-top: 1px solid #ddd;
//           }
//           @media only screen and (max-width: 600px) {
//               .container {
//                   width: 90%;
//                   margin: 10px auto;
//                   padding: 10px;
//               }
//               .header h1 {
//                   font-size: 20px;
//               }
//               .content h2 {
//                   font-size: 18px;
//               }
//               .order-details th, .order-details td,
//               .items-ordered th, .items-ordered td {
//                   font-size: 14px;
//                   padding: 8px;
//               }
//               .items-ordered td img {
//                   max-width: 40px;
//               }
//               .summary p {
//                   font-size: 14px;
//               }
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="header">
//               <h1>Order Confirmation</h1>
//           </div>
//           <div class="content">
//               <p>Hello, <strong>${fullName}</strong>,</p>
//               <p>Your order has been successfully placed! Below are the details:</p>
//               <h2>Order Details</h2>
//               <table class="order-details">
//                   <tr><th>Order ID</th><td>${userOrderId}</td></tr>
//                   <tr><th>Order Date</th><td>${orderDate}</td></tr>
//                   <tr><th>Total</th><td>₦${totalAmount}</td></tr>
//               </table>
//               <h2>Items Ordered</h2>
//               <table class="items-ordered">
//                   <thead>
//                       <tr>
//                           <th>Image</th>
//                           <th>Product Name</th>
//                           <th>Quantity</th>
//                           <th>Price</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       ${items.map(item => `
//                           <tr>
//                               <td><img src="${item.productImage}" alt="${item.productName}"></td>
//                               <td>${item.productName}</td>
//                               <td>${item.quantity}</td>
//                               <td>₦${item.price}</td>
//                           </tr>
//                       `).join('')}
//                   </tbody>
//               </table>
//               <h2>Order Summary</h2>
//               <div class="summary">
//                   <p><strong>Subtotal:</strong> ₦${totalAmount - deliveryCharge}</p>
//                   <p><strong>Shipping:</strong> ₦${deliveryCharge}</p>
//                   <p><strong>Total:</strong> ₦${totalAmount}</p>
//               </div>
//               <p>Thank you for shopping with us!</p>
//           </div>
//           <div class="footer">
//               &copy; ${new Date().getFullYear()} Eto Shopping. All rights reserved.
//           </div>
//       </div>
//   </body>
//   </html>
//   `;
// };


const paymentReceiptTemplate = (emailData) => {
  return ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 400px;
                margin: 40px auto;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #54a6fdb2;
                color: #fff;
                padding: 15px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .header h2 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                background-color: #fafafa;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
            }
            .payment-details, .summary-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .payment-details th, .payment-details td, .summary-table th, .summary-table td {
                padding: 10px;
                text-align: left;
                border: 1px solid #ddd;
            }
            .payment-details th, .summary-table th {
                background-color: #338ff1b6;
                color: white;
            }
            .payment-details td, .summary-table td {
                background-color: #f9f9f9;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #aaa;
                background-color: #f4f4f4;
                border-radius: 0 0 8px 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Payment Confirmation</h2>
            </div>
            <div class="content">
                <p>Dear ${emailData.userName},</p>
                <p>We are happy to inform you that your payment has been successfully processed. Below are the details of your payment:</p>

                <table class="payment-details">
                    <tr>
                        <th>Payment Reference</th>
                        <td>${emailData.paymentReference}</td>
                    </tr>
                    <tr>
                        <th>Amount Paid</th>
                        <td>${emailData.amountPaid}</td>
                    </tr>
                    <tr>
                        <th>Transaction Date</th>
                        <td>${emailData.transactionDate}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>Success</td>
                    </tr>
                </table>

              

                <p>If you have any questions regarding this payment, feel free to contact our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()}  Eto Shopping. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`
};



// module.exports = { paymentReceiptTemplate };



    module.exports = { signUpTemplate, paymentReceiptTemplate, verifyTemplate, forgotPasswordTemplate, passwordChangeTemplate, orderConfirmationTemplate, newOrderNotificationTemplate};
    