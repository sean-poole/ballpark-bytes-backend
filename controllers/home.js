const supabase = require("../config/supabaseConfig");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase
      .auth
      .signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Error logging in: ", error);
        return res.status(500).json({ success: false, error: "Invalid login credentials." });
      }

      const user = { token: data.session.access_token, email: data.user.email };

      return res.status(200).json({ success: true, msg: "Logging in...", user: user });
    } catch(err) {
      console.error("Error logging in: ", err);
      return res.status(500).json({ success: false, error: err });
    }
  },

  logout: async (req, res) => {
    try {
      // Terminate current session.
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({ success: true, msg: "Logging out..." });
    } catch(err) {
      console.error("Error logging out: ", err);
      return res.status(500).json({ success: false, error: err });
    }
  },

  getSectionTables: async (req, res) => {
    const { section } = req.params;

    if (!section) {
      console.error("Invalid input data. 'section' parameter is required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Get all table objects listed in the selected section.
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .eq("section", section)
        .order("id", { ascending: true });

    if (error) {
      console.error(`Error fetching tables from ${section} section.`, error);
      return res.status(500).json({ success: false, error: "Error fetching section tables." });
    }

    // Send returned table objects to frontend.
    return res.status(200).json({ success: true, tables: data });
    } catch(err) {
      console.error(`Error fetching tables from ${section} section.`, err.message);
      return res.status(500).json({ success: false, error: "Internal server error." });
    }
  }
}
