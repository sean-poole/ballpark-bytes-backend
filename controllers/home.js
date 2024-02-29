const supabase = require("../config/supabaseConfig");

module.exports = {
  getApi: (req, res) => {
    res.send("Welcome to the Ballpark Bytes API");
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
      return res.status(500).json({ error: "Error fetching section tables." });
    }

    // Send returned table objects to frontend.
    return res.status(200).json({ tables: data });
    } catch(err) {
      console.error(`Error fetching tables from ${section} section.`, err.message);
      return res.status(500).json({ error: "Internal server error." });
    }
  }, 

  getTableInformation: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      console.error("Invalid input data. 'id' parameter is required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Get a single table's information.
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching table ${id} information: `, error);
        return res.status(500).json({ error: "Error fetching table information." });
      }

      // Send returned table object to frontend for context storage.
      return res.status(200).json({ table: data });
    } catch(err) {
      console.error(`Error fetching table ${id} information: `, err);
      return res.status(500).json({ error: "Internal server error." });
    }
  },

  getMenu: async (req, res) => {
    const { location } = req.params;

    if (!location) {
      console.error("Invalid input data. 'location' parameter is required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Get the menu for a specified location.
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .contains("location", [location])
        .order("id", { ascending: true });

      if (error) {
        console.error(`Error fetching ${location} menu.`, error);
        return res.status(500).json({ error: "Error fetching menu." });
      }

      // Send returned menu object to frontend.
      return res.status(200).json({ menu: data });
    } catch(err) {
      console.error(`Error fetching ${location} menu.`, err);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
