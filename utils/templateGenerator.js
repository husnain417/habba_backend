class TemplateGenerator {
    static generateOrderEmailHtml(order) {
        return `
            <h1>Your Order Confirmation</h1>
            <p>Thank you for your order, ${order.firstName} ${order.lastName}!</p>
            <h3>Phone Number: ${order.phone}</h3>
            <h2>Order Details:</h2>
            <ul>
                ${order.items.map(item => `
                    <li>${item.name} - Quantity: ${item.quantity} - Price: Rs ${item.price * item.quantity}</li>
                `).join('')}
            </ul>
            <p><strong>Total Amount:</strong> Rs ${order.totalAmount}</p>
            <h2>Shipping Details:</h2>
            <p>${order.address}, ${order.city}, ${order.country}, Postal Code: ${order.postalCode}</p>
            <p>Payment Method: ${order.paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}</p>
            `;
    }

    static generateAdminOrderEmailHtml(order) {
        return `
            <h1>New Order Placed</h1>
            <p>Order was placed by, ${order.firstName} ${order.lastName}!</p>
            <h3>Phone Number: ${order.phone}</h3>
            <h2>Order Details:</h2>
            <ul>
                ${order.items.map(item => `
                    <li>${item.name} - Quantity: ${item.quantity} - Price: Rs ${item.price * item.quantity}</li>
                `).join('')}
            </ul>
            <p><strong>Total Amount:</strong> Rs ${order.totalAmount}</p>
            <h2>Shipping Details:</h2>
            <p>${order.address}, ${order.city}, ${order.country}, Postal Code: ${order.postalCode}</p>
            <p>Payment Method: ${order.paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}</p>
            `;
    }

    static generateWhatsAppMessage(order) {
        return `
            📦 *New Order Placed*

            Order was placed by, *${order.firstName} ${order.lastName}*!

            *Phone Number:* ${order.phone}

            🛍️ *Order Details:*
            ${order.items.map(item => `- ${item.name} (x${item.quantity}) - Rs ${item.price * item.quantity}`).join('\n')}

            💰 *Total Amount:* Rs ${order.totalAmount}

            🚚 *Shipping Address:*
            ${order.address}, ${order.city}, ${order.country}, Postal Code: ${order.postalCode}

            💳 *Payment Method:* ${order.paymentMethod}
        `.trim();
    }
}

module.exports = TemplateGenerator;
