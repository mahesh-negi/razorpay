import { config } from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";

config();
const keyId = process.env.RAZORPAY_KEY;
const keySecret = process.env.RAZORPAY_SECRET;

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const paymentInit = async ({ amount, customer }) => {
  try {
    const payment = await instance.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      accept_partial: false, // true , false
      upi_link: false, // true ,false
      //   first_min_partial_amount: 100,
      description: "payment for Ride",
      customer: customer,
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        policy_name: "Cab Booking  Services",
      },
      //   callback_url: `${process.env.BASE_URL}payment/webhook`,
      //   callback_method: 'get',
      callback_url: "http://localhost:8000",
      callback_method: "get",
    });
    return payment;
  } catch (error) {
    console.log("🚀 ~ paymentInit ~ error:", error);
    throw error;
  }
};

export const webHook = (req, res) => {
  try {
    const data = crypto.createHmac("sha256", process.env.SECRET);
    data.update(JSON.stringify(req.body));
    const digest = data.digest("hex");
    if (digest === req.headers["x-razorpay-signature"]) {
      const event = req.body.event;
      console.log(event);

      console.log(req.body, "webhook body");
      switch (event) {
        case "payment_link_paid":
          break;
        default:
          console.log("ddjdjdj");
      }
    }
  } catch (error) {
    console.log("🚀 ~ webHook ~ error:", error);
    // throw error;
  }
};

export const curl = async ({ amount, customer }) => {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const payment = {
    amount: amount * 100,
    currency: "INR",
    accept_partial: false, // true , false
    upi_link: false, // true ,false
    //   first_min_partial_amount: 100,
    description: "payment for Ride",
    customer: customer,
    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: true,
    notes: {
      policy_name: "Cab Booking  Services",
    },
    //   callback_url: `${process.env.BASE_URL}payment/webhook`,
    //   callback_method: 'get',
    callback_url: "http://localhost:8000",
    callback_method: "get",
  };

  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/payment_links",
      payment,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );
    console.log(response.data, "Res");
    return response.data;
  } catch (error) {
    console.log("error::", error);
    throw error;
  }
};
