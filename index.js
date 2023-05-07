
// const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot')
const bot = new Composer()
// const bot = new Telegraf('6034344847:AAHeX6ZckGkdBOdPwu1y9hYoxnhJ9I74TTg');
const mongoose = require("mongoose");
const express = require("express");

const app = express();
// MongoDB connection string
const connectDB = async () => {
  await mongoose.connect("mongodb+srv://shivanshnema83:eCart21@cluster0.yjdiva9.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("CONNECTED TO DATABASE!");
};
connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log(`server on port 8000`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("Not Connected to database");
  });
  //Cart Schema---------------------------------------->
  const CartSchema = new mongoose.Schema({
    customer_id: Number,
    product_name: String,
    quantity: Number
  });
  const Cart=new mongoose.model('Cart',CartSchema);
  //Order Schema-------------------------------------------->

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    ref: 'Customer',
    required: true
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total_price: {
    type: Number,
    required: true
  },
  delivery_type: {
    type: String,
    enum: ['self', 'shopkeeper'],
    required: true
  },
  delivery_address: {
    type: String
  },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  order_id:{
    type:Number,
    require:true
  }
});

const Order = mongoose.model('Order', orderSchema);

// sample product data
const products = [
  {
    name: 'Bread',
    image: 'https://www.bigbasket.com/media/uploads/p/l/70001172_10-english-oven-bread-sandwich.jpg',
    price: 10,
    quantity: 5,
    weight: '500g',
    type: 'Type A',
    brand: 'Brand X'
  },
  {
    name: 'Flour',
    image: 'https://m.media-amazon.com/images/I/91SWDnldaaL._SL1500_.jpg',
    price: 180,
    quantity: 10,
    weight: '10kg',
    type: 'Type B',
    brand: 'Aashirvaad'
  },
  {
    name: 'Tooth Past',
    image: 'https://www.bigbasket.com/media/uploads/p/xxl/40029301_22-colgate-toothpaste-active-salt-neem-anticavity.jpg',
    price: 20,
    quantity: 10,
    weight: '200g',
    type: 'Type B',
    brand: 'Colgate'
  },
  {
    name: 'Rice',
    image: 'https://www.bigbasket.com/media/uploads/p/xxl/40274887_1-naga-rice-flour-chawal-ka-atta.jpg',
    price: 100,
    quantity: 10,
    weight: '500g',
    type: 'Type B',
    brand: 'Naga'
  },
  {
    name: 'Bath soap',
    image: 'https://www.jiomart.com/images/product/600x600/490915879/lux-fresh-splash-bar-soap-with-cooling-mint-water-lily-150-g-pack-of-3-product-images-o490915879-p490915879-0-202301201903.jpg',
    price: 40,
    quantity: 10,
    weight: '200g',
    type: 'Type B',
    brand: 'Lux'
  },
  {
    name: 'Tea Pack',
    image: 'https://m.media-amazon.com/images/I/61VymAnsxyL._SL1500_.jpg',
    price: 150,
    quantity: 10,
    weight: '250g',
    type: 'Type B',
    brand: 'Red Label'
  },
  {
    name: 'Coffee Pack',
    image: 'https://rukminim1.flixcart.com/image/416/416/jxz0brk0/fmcg-combo/d/n/r/rich-and-tea-500g-classic-coffee-200g-taj-mahal-original-imafg8ymuzymzgbg.jpeg?q=70',
    price: 100,
    quantity: 10,
    weight: '200g',
    type: 'Type B',
    brand: 'Nescafe'
  },
  {
    name: 'Surf Powder',
    image: 'https://m.media-amazon.com/images/I/61gHH5yLxTL._SY355_.jpg',
    price: 50,
    quantity: 10,
    weight: '500g',
    type: 'Type B',
    brand: 'Surf excel'
  },
  {
    name: 'Oil',
    image: 'https://www.jiomart.com/images/product/600x600/490012732/saffola-total-pro-heart-concious-ricebran-based-blended-oil-5-l-product-images-o490012732-p490012732-0-202204281549.jpg',
    price: 1000,
    quantity: 10,
    weight: '10kg',
    type: 'Type B',
    brand: 'saffola'
  },
  {
    name: 'Harpic',
    image: 'https://cdn01.pharmeasy.in/dam/products_otc/X61137/harpic-power-plus-orange-toilet-cleaner-bottle-of-500-ml-2-1667804682.jpg',
    price: 100,
    quantity: 10,
    weight: '500g',
    type: 'Toilet cleaner',
    brand: 'Harpic'
  }
];


// start command handler
bot.command('start', (ctx) => {
    ctx.deleteMessage();
    ctx.reply('Welcome to eCart! Please tell me who are you?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Customer', callback_data: 'customer' }, { text: 'Shop Owner', callback_data: 'Shop Owner' }]
        ]
      }
    });
  });
  bot.action('start', (ctx) => {
    ctx.deleteMessage();
    ctx.reply('Welcome to eCart! please tell me who are you?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Customer', callback_data: 'customer' }, { text: 'Shop Owner', callback_data: 'Shop Owner' }]
        ]
      }
    });
  });

// customer callback query handler
bot.action('customer', (ctx) => {
  // send the product list in separate messages
  products.forEach((product) => {
    // create a message for each product
    let message = '';
    message += `<b>${product.name}</b>\n`;
    message += `<a href="${product.image}">&#8205;</a>\n`;
    message += `Price:<b> ${product.price}</b>\n`;
    message += `Remaining quantity:<b> ${product.quantity}</b>\n`;
    message += `Weight:<b> ${product.weight}</b>\n`;
    message += `Type: <b>${product.type}</b>\n`;
    message += `Brand:<b> ${product.brand}</b>\n\n`;
    message += `<b>Press the "Add to Cart" button to add the product in your cart.</b>`;

    // send the message with a "Buy Now" button
    ctx.telegram.sendMessage(ctx.chat.id, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Add to Cart', callback_data: `buy_${product.name}` }]
        ]
      }
    });
  });
});

// add to cart callback query handler--------------------------------->
// bot.action(/^buy_(.*)/, async (ctx) => {
//     const productName = ctx.match[1];
//     const product = products.find(p => p.name === productName);
  
//     // ask the customer for the quantity they want to purchase
//     const sentMessage = await ctx.telegram.sendMessage(ctx.chat.id, `How many "${product.name}" do you want to purchase?`, {
//       reply_markup: {
//         force_reply: true
//       }
//     });
  
//     // save the product purchase information to MongoDB
//     const quantityListener = (quantityCtx) => {
//       if (quantityCtx.message.reply_to_message && quantityCtx.message.reply_to_message.message_id === sentMessage.message_id) {
//         const quantity = Number(quantityCtx.message.text);
//         if (isNaN(quantity) || quantity <= 0 || quantity > product.quantity) {
//           ctx.reply(`Please enter a valid quantity between 1 and ${product.quantity}.`);
//         } else {
//           // add the product to the cart in MongoDB
          
  
//           const newCartItem = new Cart({
//             customer_id: ctx.from.id,
//             product_name: product.name,
//             quantity: quantity
//           });
  
//           newCartItem.save().then(() => {
//             ctx.reply(`"${product.name}" has been added to your cart. Click  on "MyCart" to place order now" .`,
//               {
//                 reply_markup: {
//                   inline_keyboard: [
//                     [{ text: 'Back to Menu', callback_data: 'customer' },{ text: 'MyCart', callback_data: 'myCart' }]
//                   ]
//                 }
//               })
//               bot.hears(/^\d+$/, quantityListener, true);
//           }).catch((err) => {
//             console.error(err);
//             ctx.reply('Sorry, something went wrong while adding the item to your cart.');
//           });
          
//         }
//       }
//     }

//     bot.hears(/^\d+$/, quantityListener, true);
//     // quantityHears.remove();
//     });

bot.action(/^buy_(.*)/, async (ctx) => {
  const productName = ctx.match[1];
  const product = products.find(p => p.name === productName);

  // save the product purchase information to MongoDB
  const newCartItem = new Cart({
    customer_id: ctx.from.id,
    product_name: product.name,
    quantity: 1 // default quantity is 1
  });

  newCartItem.save().then(() => {
    ctx.reply(`"${product.name}" has been added to your cart. You may Increment or Decrement the quantity of the item by pressing "+" or "-"`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '➖', callback_data: `decrement_${newCartItem._id}` }, { text: `${newCartItem.quantity}`, callback_data: `quantity_${newCartItem._id}` }, { text: '➕', callback_data: `increment_${newCartItem._id}` }],
          [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'My Cart', callback_data: 'myCart' }]
        ]
      }
    });
  }).catch((err) => {
    console.error(err);
    ctx.reply('Sorry, something went wrong while adding the item to your cart.');
  });

});

bot.action(/^increment_(.*)/, async (ctx) => {
  const cartItemId = ctx.match[1];
  const cartItem = await Cart.findById(cartItemId);

  if (cartItem) {
    const product = products.find(p => p.name === cartItem.product_name);

    const updatedQuantity = cartItem.quantity + 1;
    if (updatedQuantity > product.quantity) {
      ctx.answerCbQuery(`You can only add up to ${product.quantity} of "${product.name}".`);
    } else {
      await Cart.findByIdAndUpdate(cartItemId, { quantity: updatedQuantity });
      ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [{ text: '➖', callback_data: `decrement_${cartItemId}` }, { text: `${updatedQuantity}`, callback_data: `quantity_${cartItemId}` }, { text: '➕', callback_data: `increment_${cartItemId}` }],
          [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'My Cart', callback_data: 'myCart' }]
        ]
      });
      ctx.answerCbQuery(`Quantity of "${product.name}" has been updated to ${updatedQuantity}.`);
    }
  } else {
    ctx.answerCbQuery('Item not found in your cart.');
  }
}
);

bot.action(/^decrement_(.*)/, async (ctx) => {
  const cartItemId = ctx.match[1];
  const cartItem = await Cart.findById(cartItemId);

  if (cartItem) {
    const updatedQuantity = cartItem.quantity - 1;
    if (updatedQuantity < 1) {
      await Cart.findByIdAndDelete(cartItemId);
      ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'My Cart', callback_data: 'myCart' }]
        ]
      });
      ctx.answerCbQuery(`"${cartItem.product_name}" has been removed from your cart.`);
    } else {
      await Cart.findByIdAndUpdate(cartItemId, { quantity: updatedQuantity });
      ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [{ text: '➖', callback_data: `decrement_${cartItemId}` }, { text: `${updatedQuantity}`, callback_data: `quantity_${cartItemId}` }, { text: '➕', callback_data: `increment_${cartItemId}` }],
          [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'My Cart', callback_data: 'myCart' }]
        ]
      });
    }
  }
});





    //My Cart---------------------------------------------->


// myCart callback query handler
bot.action('myCart', async (ctx) => {
  try {
    // find all items in user's cart
    const cartItems = await Cart.find({ customer_id: ctx.from.id });
    if (cartItems.length === 0) {
      ctx.telegram.sendMessage(ctx.chat.id, "Your Cart is Empty", {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            
            [{ text: 'Back to Menu', callback_data: 'customer' }]
          ]
        }
      });
      return;
    }

    // calculate the total price of all items
    let totalPrice = 0;
    const keyboard = [];
    for (const item of cartItems) {
      const product = products.find(p => p.name === item.product_name);
      totalPrice += product.price * item.quantity;
      keyboard.push([{ text: `Remove ${product.name}`, callback_data: `remove_${item._id}` }]);
    }

    // create a message for the cart
    let message = '';
    
    for (const item of cartItems) {
      const product = products.find(p => p.name === item.product_name);
      message += `<b>${product.name}</b>\n`;
      // message += `<a href="${product.image}">&#8205;</a>\n`;
      message += `Price: <b>${product.price}</b>\n`;
      message += `Quantity: <b>${item.quantity}</b>\n\n`;
      message += `<i>Subtotal: <b>${product.price * item.quantity}</b></i>\n\n`;
      message+=`---------------------------------------------------------------------\n\n`
    }
    message += `<b>Total Price:</b> ${totalPrice}\n\n`;
    message += `<b>Click on "Place Order" to confirm your order.</b>\n\n`;
    message += `<b>You may remove any item from your cart by pressing "Remove Item Name" button before placing order.</b>\n\n`;

    // send the cart message with 'Place Order' button and remove buttons
    ctx.telegram.sendMessage(ctx.chat.id, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          ...keyboard,
          [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'Place Order', callback_data: 'placeOrder' }]
        ]
      }
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Sorry, something went wrong while fetching your cart items.');
  }
});

// // remove callback query handler

bot.action(/^remove_(.+)/, async (ctx) => {
  try {
    const itemId = ctx.match[1];
    // find the cart item by id
    const cartItem = await Cart.findById(itemId);
    if (!cartItem) {
      ctx.telegram.sendMessage(ctx.chat.id, "Items not found in your Cart", {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
           
            [{ text: 'Back to Menu', callback_data: 'customer' }]
          ]
        }
      });
      return;
    }
    // remove the cart item
    await Cart.deleteMany({_id:itemId});

    // find all items in user's cart
    const cartItems = await Cart.find({ customer_id: ctx.from.id });
    if (cartItems.length === 0) {
      ctx.telegram.sendMessage(ctx.chat.id, "Your Cart is Empty", {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
           
            [{ text: 'Back to Menu', callback_data: 'customer' }]
          ]
        }
      });
      return;
    }

    // calculate the total price of all items
    let totalPrice = 0;
    const keyboard = [];
    for (const item of cartItems) {
      const product = products.find(p => p.name === item.product_name);
      totalPrice += product.price * item.quantity;
      keyboard.push([{ text: `Remove ${product.name}`, callback_data: `remove_${item._id}` }]);
    }

    // create a message for the cart
    let message = '';
    for (const item of cartItems) {
      const product = products.find(p => p.name === item.product_name);
      message += `<b>${product.name}</b>\n`;
      // message += `<a href="${product.image}">&#8205;</a>\n`;
      message += `Price: <b>${product.price}</b>\n`;
      message += `Quantity: <b>${item.quantity}</b>\n\n`;
      message += `<i>Subtotal: <b>${product.price * item.quantity}</b></i>\n\n`;
    }
    message += `<b>Total Price:</b> ${totalPrice}\n\n`;
    message += `<b>Click on "Place Order" to confirm your order.</b>`;

    // send the cart message with 'Place Order' button and remove buttons
    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, null, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          ...keyboard,
          [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'Place Order', callback_data: 'placeOrder' }]
        ]
      }
    });
    ctx.answerCbQuery('Item removed from your cart.');
    
  } catch (error) {
    console.error(error);
    ctx.reply('Sorry, something went wrong while removing the item from your cart.');
  }
});

//Place Order------------------------------------------------------------------------>
// place order callback query handler
bot.action('placeOrder', async (ctx) => {
  try {
    // ask user for delivery method
    ctx.reply('Please choose a delivery method:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Self Delivery', callback_data: 'selfDelivery' }],
          [{ text: 'Deliver by Shopkeeper', callback_data: 'shopkeeperDelivery' }]
        ]
      }
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Sorry, something went wrong while placing your order.');
  }
});

// self delivery callback query handler
bot.action('selfDelivery', async (ctx) => {
  try {
    // generate order ID
    const orderId = Math.floor(Math.random() * 1000000) + 1;

    // find all items in user's cart
    const cartItems = await Cart.find({ customer_id: ctx.from.id });
    if (cartItems.length === 0) {
      ctx.reply('Your cart is empty.');
      return;
    }

    // calculate the total price of all items
    let totalPrice = 0;
    let message = '';
    const productss=[];
    for (const item of cartItems) {
      const product = products.find(p => p.name === item.product_name);
      const pro={
        "name":product.name,
        "price":product.price,
        "quantity":product.quantity
      }
      productss.push(pro);
      totalPrice += product.price * item.quantity;
      message += `<b>${product.name}</b>\n`;
      message += `Price: ${product.price}\n`;
      message += `Quantity: ${item.quantity}\n\n`;
      message += `<i>Subtotal: ${product.price * item.quantity}</i>\n\n`;
      message+=`----------------------------------------------------------------\n\n`
    }
    message += `<b>Total Price:</b> ${totalPrice}\n\n`;
    message += `<b>Congratulations! Your order has been placed.</b>\n`;
    message += `<b>You can now grab your order from the shop.</b>\n`;
    message += `Your Order ID is: <b>${orderId}</b>`;

    // store the order in the database
    const order = new Order({
      customer_id: ctx.from.id,
      delivery_type: 'self',
      items: cartItems,
      order_id: orderId,
      total_price: totalPrice,
      products:productss
    });
    await order.save();

    // delete the cart items
    await Cart.deleteMany({ customer_id: ctx.from.id });

    // send the order message
    ctx.telegram.sendMessage(ctx.chat.id, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Menu', callback_data: 'customer' }]]
      }
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Sorry, something went wrong while placing your order.');
  }
});

// shopkeeper delivery callback query handler
bot.action('shopkeeperDelivery', async (ctx) => {
 try {
    // generate order ID
    const orderId = Math.floor(Math.random() * 1000000) + 1;

    // find all items in user's cart
    const cartItems = await Cart.find({ customer_id: ctx.from.id });
    if (cartItems.length === 0) {
      ctx.reply('Your cart is empty.');
      return;
    }

    // calculate the total price of all items
    let totalPrice = 0;
    let message = '';
    const productss=[];
    for (const item of cartItems) {
      const product = products.find(p => p.name === item.product_name);
      const pro={
        "name":product.name,
        "price":product.price,
        "quantity":product.quantity
      }
      productss.push(pro);
      totalPrice += product.price * item.quantity;
      message += `<b>${product.name}</b>\n`;
      message += `Price: ${product.price}\n`;
      message += `Quantity: ${item.quantity}\n\n`;
      message += `<i>Subtotal: ${product.price * item.quantity}</i>\n\n`;
    }
    message += `<b>Total Price:</b> ${totalPrice}\n\n`;
    message += `<b>Congratulations! Your order has been placed.</b>\n`;
    message += `<b>Your order will be delivered to your address soon.</b>\n`;
    message += `Your Order ID is: <b>${orderId}</b>`;

    // store the order in the database
    const order = new Order({
      customer_id: ctx.from.id,
      delivery_type: 'shopkeeper',
      items: cartItems,
      order_id: orderId,
      total_price: totalPrice,
      products:productss
    });
    await order.save();

    // delete the cart items
    await Cart.deleteMany({ customer_id: ctx.from.id });

    // send the order message
    ctx.telegram.sendMessage(ctx.chat.id, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Menu', callback_data: 'customer' }]]
      }
    });
  }catch (error) {
    console.error(error);
    ctx.reply('Sorry, something went wrong while processing your request.');
  }
});


//Shop Owner------------------------------------------------------------------------------------------------------------>


// Handle the "shop owner" command
bot.action('Shop Owner', async (ctx) => {
  // Ask for the password
  const SHOP_OWNER_PASSWORD = 'password123';

// // Define a variable to keep track of whether the shop owner is authenticated
let isShopOwnerAuthenticated = false;

// // Define a function to check if the user is the shop owner
function isShopOwner(ctx) {
  return ctx.message.text === SHOP_OWNER_PASSWORD;
}

  await ctx.reply('Please enter the shop owner password:');

  // Set the "shop owner" state
  isShopOwnerAuthenticated = false;

  // Listen for the next message from the shop owner
  bot.on('message', async (ctx) => {
    if (isShopOwner(ctx)) {
      // Show the orders
      let orders = await Order.find({ order_status: 'pending' });

      if (orders.length === 0) {
        await ctx.reply('There are no pending orders.',{
        reply_markup: {
          inline_keyboard: [
           
            [
              { text: 'Back to main manu', callback_data: `start` }
            ]
          ]
        }
      }
        );
      } else {
        for (const order of orders) {
          // Get the product details
          const productDetails = order.products.map(product => `${product.name} - ${product.quantity}`).join('\n');

          // Show the order details and buttons to accept or decline the order
          await ctx.replyWithHTML(`Order ID: <b>${order.order_id}</b>\nCustomer ID: <b>${order.customer_id}</b>\nTotal Price: <b>${order.total_price}</b>\nDelivery Type: <b>${order.delivery_type}</b>\nDelivery Address: <b>${order.delivery_address}</b>\n\nProducts - Quantity\n <b>${productDetails} </b>`, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Accept Order', callback_data: `accept_${order._id}` },
                  { text: 'Decline Order', callback_data: `decline_${order._id}` }
                ],
                [
                  { text: 'Back to main manu', callback_data: `start` }
                ]
              ]
            }
          });
        }

        // Set the "shop owner" state
        isShopOwnerAuthenticated = true;
      }

      // Listen for "accept" and "decline" callbacks for orders
      bot.action(/^accept_(.*)/, async (ctx) => {
        // Check if the shop owner is authenticated
        if (isShopOwnerAuthenticated) {
          const orderId = ctx.match[1];

          // Update the order status to "confirmed"
          await Order.updateOne({ _id: orderId }, { order_status: 'confirmed' });

          // Remove the accepted order from the orders array
          orders = orders.filter(order => order._id.toString() !== orderId);

          // Show a success message
          await ctx.answerCbQuery('Order has been accepted successfully.');
        }
      });

      bot.action(/^decline_(.*)/, async (ctx) => {
        // Check if the shop owner is authenticated
        if (isShopOwnerAuthenticated) {
          const orderId = ctx.match[1];

          // Update the order status to "cancelled"
          await Order.updateOne({ _id: orderId }, { order_status: 'cancelled' });

          // Remove the declined order from the orders array
          orders = orders.filter(order => order._id.toString() !== orderId);

          // Show a success message
          await ctx.reply('Order has been declined successfully.');

          // Notify the customer
          const order = await Order.findById(orderId);
          await ctx.telegram.sendMessage(order.customer_id, 'Sorry, your order has been declined by the shop owner.');
        }
      });
    } else {
      // Show an error message for incorrect password
      await ctx.reply('Incorrect password. Please try again.');
    }
  });
 
});

  //mycart Command ------------------------------------------------------------------------------------------>
  bot.command('mycart', async (ctx) => {
    try {
      // find all items in user's cart
      const cartItems = await Cart.find({ customer_id: ctx.from.id });
      if (cartItems.length === 0) {
        ctx.telegram.sendMessage(ctx.chat.id, "Your Cart is Empty", {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              
              [{ text: 'Back to Menu', callback_data: 'customer' }]
            ]
          }
        });
        return;
      }
  
      // calculate the total price of all items
      let totalPrice = 0;
      const keyboard = [];
      for (const item of cartItems) {
        const product = products.find(p => p.name === item.product_name);
        totalPrice += product.price * item.quantity;
        keyboard.push([{ text: `Remove ${product.name}`, callback_data: `remove_${item._id}` }]);
      }
  
      // create a message for the cart
      let message = '';
      
      for (const item of cartItems) {
        const product = products.find(p => p.name === item.product_name);
        message += `<b>${product.name}</b>\n`;
        // message += `<a href="${product.image}">&#8205;</a>\n`;
        message += `Price: <b>${product.price}</b>\n`;
        message += `Quantity: <b>${item.quantity}</b>\n\n`;
        message += `<i>Subtotal: <b>${product.price * item.quantity}</b></i>\n\n`;
        message+=`---------------------------------------------------------------------\n\n`
      }
      message += `<b>Total Price:</b> ${totalPrice}\n\n`;
      message += `<b>Click on "Place Order" to confirm your order.</b>\n\n`;
      message += `<b>You may remove any item from your cart by pressing "Remove Item Name" button before placing order.</b>\n\n`;
  
      // send the cart message with 'Place Order' button and remove buttons
      ctx.telegram.sendMessage(ctx.chat.id, message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            ...keyboard,
            [{ text: 'Back to Menu', callback_data: 'customer' }, { text: 'Place Order', callback_data: 'placeOrder' }]
          ]
        }
      });
    } catch (error) {
      console.error(error);
      ctx.reply('Sorry, something went wrong while fetching your cart items.');
    }
  });

// bot.launch();
module.exports = bot