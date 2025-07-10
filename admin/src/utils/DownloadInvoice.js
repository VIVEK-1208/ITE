import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const getBase64ImageFromURL = async (url) => {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject("Logo Load Error");
  });
};

export const downloadInvoice = async (order) => {
  if (!order || !Array.isArray(order.items)) {
    alert("Invalid order data. Cannot generate invoice.");
    console.error("🚨 Invalid order object:", order);
    return;
  }

  const doc = new jsPDF();

  // === LOGO ===
  try {
    const logo = await getBase64ImageFromURL("/img/logo.webp");
    doc.addImage(logo, "PNG", 14, 10, 25, 12); // Top-left
  } catch (err) {
    console.error("Logo error:", err);
  }

  // === INVOICE INFO (Top-right) ===
  const date = order.timestamp?.seconds
    ? new Date(order.timestamp.seconds * 1000).toLocaleDateString()
    : new Date().toLocaleDateString();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Order Invoice", 195, 14, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Invoice Number: ${order.invoiceNumber || order.orderId || "-"}`, 195, 20, { align: "right" });
  doc.text(`Order No: ${order.orderNumber || order.orderId || "-"}`, 195, 26, { align: "right" });
  doc.text(`Order Date: ${date}`, 195, 32, { align: "right" });

  // === STORE INFO (Below Logo) ===
  doc.setFont("helvetica", "bold");
  doc.text("Industrial Tools and Equipments", 14, 38);

  doc.setFont("helvetica", "normal");
  doc.text("S-TYPE Chowk, Near Adityapur Nagar Parishad Office", 14, 44);
  doc.text("Adityapur, Seraikela-Kharsawan, Jharkhand", 14, 50);

  // === ORDER SUMMARY TITLE ===
  const summaryStartY = 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Order Summary", 14, summaryStartY);
  doc.line(14, summaryStartY + 2, 195, summaryStartY + 2);

  // === SHIPPING + PAYMENT ===
  const d = order.deliveryInfo || {};
  const addressLines = [
    `${d.firstName || ""} ${d.lastName || ""}`,
    d.street || "",
    d.city || "",
    `${d.district || ""}, ${d.state || ""} - ${d.pincode || ""}`
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const addressStartY = summaryStartY + 10;
  doc.text("Shipping Address", 14, addressStartY);
  addressLines.forEach((line, idx) => {
    doc.text(line, 14, addressStartY + 6 + idx * 6);
  });

  const paymentStartY = addressStartY;
  doc.text("Payment Method", 110, paymentStartY);
  doc.text(`${order.payment?.method || "Online"} (${order.payment?.mode || "Razorpay"})`, 110, paymentStartY + 6);
  doc.text(`Txn ID: ${order.payment?.transactionId || "N/A"}`, 110, paymentStartY + 12);
  doc.text(`Paid At: ${order.payment?.paidAt ? new Date(order.payment.paidAt).toLocaleString() : "N/A"}`, 110, paymentStartY + 18);

  // === ORDER ITEMS TABLE ===
  const itemsStartY = Math.max(addressStartY + 6 * addressLines.length + 12, paymentStartY + 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Order Items", 14, itemsStartY);
  doc.line(14, itemsStartY + 2, 195, itemsStartY + 2);

  autoTable(doc, {
    startY: itemsStartY + 6,
    head: [["Item", "Price", "Qty", "Total"]],
    body: (order.items || []).map((item) => [
      `${item.name}\nSKU: ${item.sku || "N/A"}`,
      `₹${item.price.toFixed(2)}`,
      `${item.quantity}`,
      `₹${(item.price * item.quantity).toFixed(2)}`
    ]),
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [245, 245, 245], textColor: 0 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 25, halign: 'right' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' }
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  const rightAlignX = 180;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Items Subtotal: ₹${order.subtotal?.toFixed(2) || "0.00"}`, rightAlignX, finalY, { align: "right" });
  doc.text(`Shipping: ₹${order.deliveryFee?.toFixed(2) || "0.00"}`, rightAlignX, finalY + 6, { align: "right" });
  doc.text(`Tax: ₹${order.tax?.toFixed(2) || "0.00"}`, rightAlignX, finalY + 12, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Grand Total: ₹${order.total?.toFixed(2) || "0.00"}`, rightAlignX, finalY + 22, { align: "right" });

  // === FOOTER ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Thank you for shopping with us!", 14, finalY + 40);
  doc.text("If you have any questions about your order, please contact:", 14, finalY + 46);
  doc.setTextColor(0, 0, 200);
  doc.text("industrialtoolsandequipments@gmail.com", 14, finalY + 52);

  doc.save(`Invoice_${order.orderId || "receipt"}.pdf`);
};
