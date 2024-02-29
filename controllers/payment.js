// const path = require("path");
const supabase = require("../config/supabaseConfig");
// require("dotenv").config({ path: path.resolve(__dirname, ".env")});
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  getConfig: (req, res) => {
    res.status(200).json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  },

  createPayment: async (req, res) => {
    const { tableInfo, total } = req.body;

    console.log(`Total: `, total);

    if (!tableInfo || !total || isNaN(Number(total))) {
      console.error("Invalid input data. 'tableInfo' and 'total' parameters are required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    // Round total to 2 decimal places.
    const roundedTotal = parseFloat(total).toFixed(2);

    // Convert total to cents for stripe method compatibility.
    const totalCents = Math.floor(Number(roundedTotal) * 100);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: totalCents,
        automatic_payment_methods: {
          enabled: true
        }
      });

      console.log("Payment successful.");
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch(err) {
      console.error("Error creating payment intent.", err);
      return res.status(500).json({ error: "Error creating payment intent. Please try again later." });
    }
  },

  createReceipt: async (req, res) => {
    const { tableInfo, total } = req.body;

    if (!tableInfo || !total || isNaN(Number(total))) {
      console.error("Invalid input data. 'tableInfo' and 'total' parameters are required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Store tableInfo object and total price in 'receipts' table.
      const { data, error } = await supabase
        .from("receipts")
        .insert([
          {
            section: tableInfo.section,
            tableNumber: tableInfo.tableNumber,
            order: tableInfo.items,
            total: total
          }
        ])
        .single();

      if (error) {
        console.error("Error creating receipt.", error);
        return res.status(500).json({ error: "Error creating recipt." });
      }

      return res.status(200).json({ success: true, msg: "Successfully created receipt." });
    } catch(err) {
      console.error("Error creating receipt.", err);
      return res.status(500).json({ error: "Error creating receipt." });
    }
  },

  deleteTableInfo: async (req, res) => {
    const { tableInfo } = req.body;

    if (!tableInfo) {
      console.error("Invalid input data. 'tableInfo' parameter is required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Get table info to be deleted.
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .eq("id", tableInfo.id)
        .single();

      if (error) {
        console.error("Error fetching table.", err);
        return res.status(500).json({ error: "Error fetching table information." });
      }

      // Clear fields of current table.
      const { data: deletedTable, error: deletedError } = await supabase
        .from("tables")
        .update({ items: [], discount: null })
        .eq("id", tableInfo.id)
        .single();

      if (deletedError) {
        console.error("Error clearing table.", err);
        return res.status(500).json({ error: "Error clearing table." });
      }

      console.log("Successfully cleared table.");

      return res.status(200).json({ msg: "Successfully cleared table." });
    } catch(err) {
      console.error("Error deleting table info.", err);
      return res.status(500).json({ error: "Error deleting table info." });
    }
  }
}
