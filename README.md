# 🛍️ ITE - eCommerce Web App

**ITE** is a modern full-stack eCommerce platform built with **React**, **Firebase**, and **Razorpay**. It provides full customer and admin functionality including browsing, filtering, cart management, orders, payments, invoice generation, and backend admin control.

---

## 🚀 Features

### 🧑‍💼 Customer Side

* 🔍 Product search (name, brand, description, keywords)
* 🧩 Brand & price filtering
* 📦 Stock-aware cart
* 🛒 Cart summary + checkout
* 📬 Dynamic delivery fee based on pincode and weight
* 💳 Razorpay integration
* 🧾 Auto-generated PDF invoice
* 📜 Order history with status tracking
* ❌ Cancel order + refund logic

### 🛠️ Admin Panel

* 🔐 Firebase Auth with role-based access (`admin`)
* 🧮 Add / edit / delete products
* ☁️ Upload images to Cloudinary or Firebase
* 📦 View and update order statuses
* 📁 Invoice download
* 🔍 Order filtering & status line

---

## 🛠 Tech Stack

| Layer    | Tools/Libraries               |
| -------- | ----------------------------- |
| Frontend | React, CSS Modules            |
| Backend  | Firebase Functions (optional) |
| Database | Firebase Firestore            |
| Auth     | Firebase Auth                 |
| Payments | Razorpay API                  |
| PDF      | jsPDF                         |

---

## 📁 Project Structure

```
ITE/
├── client/               # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── data/
│   │   ├── firebase.js
│   │   ├── App.js
│   │   └── index.js
├── admin-panel/          # Admin dashboard
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── adminRoutes.js
├── server/               # Optional backend APIs
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── index.js
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/VIVEK-1208/ITE.git
cd ITE
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Firebase Setup

* Go to [Firebase Console](https://console.firebase.google.com/)
* Create a project
* Enable:

  * Firestore Database
  * Authentication (Email/Password or Google)
  * Firebase Storage (if using image upload)

Update `firebase.js`:

```js
export const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "xxxxxxx",
  appId: "xxxxxxx"
};
```

### 4. Razorpay Setup

* Create account on [razorpay.com](https://razorpay.com/)
* Use test or live API keys in payment module

---

## 📦 Running Locally

```bash
cd client
npm start
```

> App will start on `http://localhost:3000`

---

## 📜 Firebase Firestore Structure

### Products Collection

```json
{
  "name": "Drill Machine",
  "brand": "Brislay",
  "type": "Power Tool",
  "price": 3999,
  "quantity": 10,
  "weight": 2.5,
  "keywords": ["drill", "electric"]
}
```

### Orders Collection

```json
{
  "userId": "abc123",
  "items": [
    { "productId": "p1", "name": "Drill", "price": 3999, "qty": 2 }
  ],
  "status": "Processing",
  "deliveryInfo": {
    "name": "John",
    "pincode": "831013",
    "state": "Jharkhand"
  },
  "total": 7998,
  "createdAt": "timestamp"
}
```

### Users Collection

```json
{
  "uid": "abc123",
  "email": "admin@example.com",
  "role": "admin"
}
```

---

## 🧾 PDF Invoices

After successful Razorpay payment, the app auto-generates a downloadable PDF invoice using `jsPDF`. Invoice includes:

* Customer name and contact
* Product list and quantities
* Price breakdown
* Delivery charges
* Order ID and timestamp

---

## 🔐 Admin Credentials

> Admins must be manually flagged in Firestore Users collection with:

```json
{
  "role": "admin"
}
```

---

## 🙋 Support & Contribution

If you find bugs or want to contribute:

* Fork this repo
* Create a feature branch
* Make a pull request

---

## 📝 License

This project is licensed under [MIT License](LICENSE).

---

**Made with ❤️ by Vivek**
