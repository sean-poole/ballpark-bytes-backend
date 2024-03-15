const { createClient } = require("@supabase/supabase-js");
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, ".env")});
require("dotenv").config();

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseURL, supabaseKey);

module.exports = supabase;
