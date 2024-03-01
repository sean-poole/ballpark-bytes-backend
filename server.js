const express = require("express");
const app = express();
const cors = require("cors");
// const path = require("path");
const supabase = require("./config/supabaseConfig");

const homeRoutes = require("./routes/home");
const tablesRoutes = require("./routes/tables");
const paymentRoutes = require("./routes/payment");

supabase.from("menu").select("id").range(0, 0)
  .then(response => {
    if (response.data) {
      console.log(`Connected to Supabase.`);
    } else if (response.error) {
      console.error(`Error connecting to Supabase: `, response.error.message);
    }
  });

const corsOptions = {
  origin: ["https://ballparkbytes.netlify.app", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", homeRoutes);
app.use("/tables", tablesRoutes);
app.use("/payment", paymentRoutes);

// For local host
// app.use(express.static(path.join(__dirname, "frontend/build")));
// app.get("*", function(_, res) {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"), function(err) {
//     res.status(500).send(err);
//   });
// });

app.get("/", (req, res) => {
  res.send("Welcome to the Ballpark Bytes API.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT}.`);
});
