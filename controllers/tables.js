const supabase = require("../config/supabaseConfig");

module.exports = {
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
  }, 

  addItem: async (req, res) => {
    const { tableInfo, itemId } = req.body;

    if (!tableInfo || !itemId) {
      console.error("Invalid input data. 'tableInfo' and 'itemId' parameters are required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Get the selected menu item's details (id, name, price).
      const { data: itemData, error: itemError } = await supabase
        .from("menu")
        .select("id, name, price")
        .eq("id", itemId)
        .single();

      if (itemError) {
        console.error(`Error getting menu item ${itemId}.`, itemError);
        return res.status(500).json({ error: "Error getting menu item." });
      }

      if (!itemData) {
        console.error("Menu item not found.");
        return res.status(404).json({ error: "Menu item not found." });
      }

      // Check if the item to be added already exists in tableInfo.
      const existingItem = tableInfo.items.findIndex(item => item.id == itemData.id);

      if (existingItem !== -1) {
        // If the item exists, increment quantity by 1.
        tableInfo.items[existingItem].quantity += 1;
      } else {
        // Else, add the item to tableInfo and initialize "quantity" property at 1.
        tableInfo.items.push({ ...itemData, quantity: 1 });
      }

      // Update ordered items in table data.
      const { data: tableData, error: tableError } = await supabase
        .from("tables")
        .update({ items: tableInfo.items })
        .eq("id", tableInfo.id)
        .single();

      if (tableError) {
        console.error("Error storing menu item in table.", tableError);
        return res.status(500).json({ error: "Error storing menu item in table." });
      }

      console.log(`Successfully added item to Table ${tableInfo.id}.`);

      // Get the updated table information.
      const { data: updatedTable, error: updatedError } = await supabase
        .from("tables")
        .select("*")
        .eq("id", tableInfo.id)
        .single();

      if (updatedError) {
        console.error("Error fetching updated table.", updatedError);
        return res.status(500).json({ error: "Error fetching updated table." });
      }

      // Send the updated table to frontend for context storage.
      return res.status(200).json({ table: updatedTable, msg: "Successfully added item." });
    } catch(err) {
      console.error("Error adding item to table.", err);
      return res.status(500).json({ error: "Error adding item to table." });
    }
  },

  removeItem: async (req, res) => {
    const { tableInfo, itemId } = req.body;

    if (!tableInfo || !itemId) {
      console.error("Invalid input data. 'tableInfo' and 'itemId' parameters are required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      // Find the item to be removed in tableInfo's items.
      const itemIndex = tableInfo.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        console.error("Item not found in table.");
        return res.status(404).json({ error: "Item not found in table." });
      }
      
      if (tableInfo.items[itemIndex].quantity > 1) {
        // If item to be removed has a quantity > 1, decrement quantity by 1.
        tableInfo.items[itemIndex].quantity -= 1;
      } else {
        // If item to be removed has a quantity <= 1, delete the item from tableInfo.
        tableInfo.items.splice(itemIndex, 1);
      }

      // Update ordered items in table data.
      const { data, error } = await supabase
        .from("tables")
        .update({ items: tableInfo.items })
        .eq("id", tableInfo.id)
        .single();

      if (error) {
        console.error("Error removing menu item from table.", error);
        return res.status(500).json({ error: "Error removing menu item from table." });
      }

      console.log(`Successfully removed item from Table ${tableInfo.id}.`);

      // Get updated table information.
      const { data: updatedTable, error: updatedError } = await supabase
        .from("tables")
        .select("*")
        .eq("id", tableInfo.id)
        .single();

      if (updatedError) {
        console.log("Error fetching updated table.", updatedError);
        return res.status(500).json({ error: "Error fetching updated table." });
      }

      // Send the updated table to frontend for context storage.
      return res.status(200).json({ table: updatedTable, msg: "Successfully removed item." });
    } catch(err) {
      console.log("Error removing item from table.", err);
      return res.status(500).json({ error: "Error removing item from table." });
    }
  },

  applyDiscount: async (req, res) => {
    const { tableInfo, discount } = req.body;

    if (!tableInfo || !discount) {
      console.error("Invalid input data. 'tableInfo' and 'discount' parameters are required.");
      return res.status(400).json({ error: "Invalid input data." });
    }

    try {
      const { data, error } = await supabase
        .from("tables")
        .update({ discount: discount })
        .eq("id", tableInfo.id)
        .single();

      if (error) {
        console.log(`Error applying discount to table ${tableInfo.tableNumber}.`, error);
        return res.status(500).json({ error: "Error applying discount to table." });
      }

      console.log(`Successfully applied ${discount}% discount to table ${tableInfo.tableNumber}.`);

      // Get updated table information.
      const { data: updatedTable, error: updatedError } = await supabase
        .from("tables")
        .select("*")
        .eq("id", tableInfo.id)
        .single();

      if (updatedError) {
        console.log("Error fetching updated table.", updatedError);
        return res.status(500).json({ error: "Error fetching updated table." });
      }

      // Send the updated table to frontend for context storage.
      return res.status(200).json({ table: updatedTable, msg: "Successfully applied discount." });
    } catch(err) {
      console.log("Error applying discount.", err);
      return res.status(500).json({ error: "Error applying discount." });
    }
  }
}
