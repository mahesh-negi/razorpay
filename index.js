import express from "express";
import { config } from "dotenv";
import { curl, paymentInit, webHook } from "./payment.js";
config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 9000;

app.post("/payment-init", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.amount) {
      throw new Error("amount is required");
    }
    const payment = await paymentInit(req.body);
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/payment-curl", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.amount) {
      throw new Error("amount is required");
    }
    console.log(req.body);
    const payment = await curl(req.body);
    res.status(200).json({ payment });
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);
    res.status(400).json({ error });
  }
});

app.post("/webhook", (req, res) => {
  webHook(req, res);
});

app.listen(PORT, () => {
  console.log(`server is runnig http:localhost:${PORT}`);
});
