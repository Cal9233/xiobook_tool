const express = require("express");
const con = require("../utils/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Update password route - for existing users
router.post("/update-password", async (req, res) => {
    try {
      const { userId, newPassword } = req.body;
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const sql = "UPDATE users SET password = ? WHERE user_id = ?";
      
      con.query(sql, [hashedPassword, userId], (err, result) => {
        if (err) {
          console.error("Password update error:", err);
          return res.json({ Status: false, Error: "Password update failed" });
        }
        return res.json({ Status: true, Message: "Password updated successfully" });
      });
      
    } catch (error) {
      console.error("Password update error:", error);
      return res.status(500).json({ Status: false, Error: "Internal server error" });
    }
  });

  // Registration route - for new users
router.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
      
      con.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Registration error:", err);
          return res.json({ Status: false, Error: "Registration failed" });
        }
        return res.json({ Status: true, Message: "Registration successful" });
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ Status: false, Error: "Internal server error" });
    }
  });

  // Login route
  router.post("/adminlogin", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", { email, password });

        // Input validation
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ 
                loginStatus: false, 
                Error: "Email and password are required" 
            });
        }

        // Query to find user
        const sql = "SELECT user_id, email, password, roleid FROM users WHERE email = ? LIMIT 1";
        console.log("SQL Query:", sql);
        console.log("Searching for email:", email);
        
        const user = await new Promise((resolve, reject) => {
            con.query(sql, [email], (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    reject(err);
                }
                console.log("Database results:", results);
                resolve(results[0]); // Get first user or undefined
            });
        });

        // Check if user exists
        if (!user) {
            console.log("No user found with email:", email);
            return res.status(401).json({ 
                loginStatus: false, 
                Error: "Invalid email or password" 
            });
        }

        console.log("Found user:", { 
            id: user.user_id, 
            email: user.email,
            hashedPassword: user.password 
        });

        // Compare password
        console.log("Comparing passwords...");
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", passwordMatch);

        if (!passwordMatch) {
            console.log("Password comparison failed");
            return res.status(401).json({ 
                loginStatus: false, 
                Error: "Invalid email or password" 
            });
        }

        // Rest of your login logic...
        const token = jwt.sign(
            {
                userId: user.user_id,
                email: user.email,
                role: user.roleid
            },
            process.env.JWT_SECRET || "your-jwt-secret-key",
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
            loginStatus: true,
            message: "Login successful",
            user: {
                id: user.user_id,
                email: user.email,
                role: user.roleid
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            loginStatus: false, 
            Error: "Internal server error" 
        });
    }
});
  
  // Middleware to verify token
  const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ Error: "Access denied" });
    }
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret-key");
      req.user = verified;
      next();
    } catch (error) {
      res.status(401).json({ Error: "Invalid token" });
    }
  };
  
  // Logout route
  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: true, message: "Logged out successfully" });
  });
  
  // Example protected route
  router.get("/protected", verifyToken, (req, res) => {
    res.json({ Status: true, user: req.user });
  });

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Add employee
router.post("/add_employee", upload.single("image"), (req, res) => {
  const sql = `INSERT INTO employees 
    (name, position, salary, client_id, image) 
    VALUES (?)`;
  const values = [
    req.body.name,
    req.body.position,
    req.body.salary,
    req.body.client_id,
    req.file.filename,
  ];
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

// Get all employees
// router.get("/employees", (req, res) => {
//   const sql = `SELECT e.*, c.name AS client_name 
//                FROM employees e 
//                JOIN clients c ON e.client_id = c.id`;
//   con.query(sql, (err, result) => {
//     if (err) return res.json({ Status: false, Error: "Query Error" });
//     return res.json({ Status: true, Result: result });
//   });
// });
router.get("/employees/all/:userId", (req, res) => {
    const userId = req.params.userId; 
    // SQL query to fetch employees linked to the clients that the user has access to
    const sql = `
      SELECT e.*, c.name AS client_name 
      FROM employees e 
      JOIN clients c ON e.client_id = c.client_id
      WHERE c.user_id = ?`;
  
    con.query(sql, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Status: false, Error: "Query Error" });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  

// Get employee by ID
router.get("/employees/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employees WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Update employee
router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employees 
               SET name = ?, position = ?, salary = ?, client_id = ? 
               WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.position,
    req.body.salary,
    req.body.client_id,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true });
  });
});

// Delete employee
router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employees WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true });
  });
});

// Get all clients
router.get("/clients/all/:userId", (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM clients WHERE user_id = ?";
    con.query(sql, [userId], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    });
  });

  // Get client by ID
router.get("/client/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM clients WHERE client_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// add client
router.post("/add_client/:id", (req, res) => {
  const id = req.params.id;
  const { name, company_name, ein, address, city, entity_corp, state, owner_address, phone_num } = req.body;

  const cidSql = "SELECT * FROM clients WHERE user_id = ? ORDER BY CAST(company_id AS UNSIGNED) DESC LIMIT 1;";

  con.query(cidSql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });

    let largestId = result[0]?.company_id || '000'; // Default to '000' if no rows exist
    let updateId = String(parseInt(largestId) + 1).padStart(3, '0'); // Increment and pad with leading zeros

    const sql = `INSERT INTO clients 
    (name, user_id, company_id, company_name, ein, address, city, entity_corp, state, owner_address, phone_num) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      name,
      id,
      updateId,
      company_name,
      ein,
      address,
      city,
      entity_corp,
      state,
      owner_address,
      phone_num,
    ];

    con.query(sql, values, (err, clientResult) => {
      if (err) return res.json({ Status: false, Error: err });

      return res.json({
        Status: true,
        client_id: clientResult.insertId, // Retrieve the auto-incremented client_id
        message: "Client created successfully!",
      });
    });
  });
});

// Update client
router.put("/edit_client/:id", (req, res) => {
  console.log('hit edit client route')
    const id = req.params.id;
    const sql = `UPDATE clients 
                 SET name = ?, company_name = ?, ein = ?, address = ?,
                 city = ?, state = ?, entity_corp = ?, owner_address = ?,
                 phone_num = ? 
                 WHERE user_id = ?`;
    const values = [
      req.body.name,
      req.body.company_name,
      req.body.ein,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.entity_corp,
      req.body.owner_address,
      req.body.phone_num
    ];
    con.query(sql, [...values, id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
      console.log({result})
      return res.json({ Status: true });
    });
});

// delete client
router.delete("/delete_client/:id", (req, res) => {
  let id = req.params.id
  
  // First delete employees
  const deleteEmployees = "DELETE FROM employees WHERE client_id = ?";
  con.query(deleteEmployees, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    
    // Then delete client
    const deleteClient = "DELETE FROM clients WHERE client_id = ?";
    con.query(deleteClient, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" + err });
      return res.json({ Status: true });
    });
  });
});

// Register
// Example for hashing password during user registration
router.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return res.json({ Error: "Error hashing password" });
  
      const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
      const values = [req.body.email, hashedPassword, req.body.role];
      con.query(sql, values, (err, result) => {
        if (err) return res.json({ Error: "Database error" });
        res.json({ message: "User registered successfully" });
      });
    });
  });
  

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

module.exports = router;
