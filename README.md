🛍️ ITE - eCommerce Platform
This is a modern full-stack eCommerce web application built with React.js, Firebase, and Razorpay. It allows customers to browse products, manage cart, place orders, and for admins to manage products, orders, and refunds.

🚀 Features
🧑‍💼 Customer Side
🔍 Browse products with filters (Brand, Price, Search)

📦 View product details with stock info

🛒 Add to cart and checkout

🚚 Calculate dynamic delivery fee based on pincode

💳 Pay using Razorpay (with live payment tracking)

🧾 Auto-generated invoice (PDF download)

📜 Order history with status (Processing, Shipped, Delivered)

🔁 Cancel order + refund system

🛠️ Admin Panel
🔐 Role-based admin access (via Firebase Auth)

➕ Add / 📝 Edit / 🗑️ Delete products

🖼 Upload images (Cloudinary or Firebase Storage)

📋 View and update orders (with status control)

📁 Download invoices

🔍 Filter and manage orders with progress tracking

🛠 Tech Stack
Frontend	Backend	Database	Payments	Auth
React + CSS	Firebase Functions (or Express)	Firebase Firestore	Razorpay	Firebase Auth

📁 Project Structure
php
Copy
Edit
ITE/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── firebase.js
│   │   ├── App.js
│   │   └── index.js
│   └── public/
├── admin-panel/            # Admin interface
├── server/                 # Optional backend logic (refunds, cron jobs, etc)
└── README.md
🔧 Setup Instructions
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/VIVEK-1208/ITE.git
cd ITE
2. Install dependencies
bash
Copy
Edit
cd client
npm install
3. Setup Firebase
Create a Firebase project at https://console.firebase.google.com

Enable Authentication → Email/Password & optionally Google

Setup Firestore and Storage

Add your Firebase config in client/src/firebase.js

js
Copy
Edit
// Example
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
4. Enable Razorpay
Go to https://razorpay.com and get test keys

Use Razorpay API to handle payment checkout and optionally refunds

🧪 Run the App Locally
bash
Copy
Edit
cd client
npm start
App runs at http://localhost:3000

🧾 Invoices
After order confirmation, a PDF invoice is automatically generated using jsPDF. Users can download this invoice from the order page.

🗂 Firebase Firestore Structure
products Collection
json
Copy
Edit
{
  "name": "Drill Machine",
  "brand": "Brislay",
  "type": "Power Tool",
  "price": 3999,
  "quantity": 10,
  "weight": 2.5,
  "keywords": ["drill", "electric", "machine"]
}
orders Collection
json
Copy
Edit
{
  "userId": "uid123",
  "items": [ { productId, name, qty, price } ],
  "total": 4999,
  "deliveryInfo": { name, address, pincode },
  "status": "Processing",
  "createdAt": timestamp
}
users Collection
json
Copy
Edit
{
  "email": "user@example.com",
  "role": "admin" // or "user"
}
📦 Deployment
You can deploy using:

🔥 Firebase Hosting

🪄 Vercel / Netlify

Or a custom server (if using Express backend)

📸 Screenshots
Home Page	Product Details	Admin Panel

🙋‍♂️ Author
Vivek
GitHub: @VIVEK-1208
