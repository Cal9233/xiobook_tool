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

// Admin login
// router.post("/adminlogin", (req, res) => {
//   const sql = "SELECT * FROM users WHERE email = ?";
//   con.query(sql, [req.body.email], (err, result) => {
//     if (err) return res.json({ loginStatus: false, Error: "Query error" });
    
//     if (result.length > 0) {
//       const user = result[0];
      
//       // Compare hashed password from the database with the input password
//       bcrypt.compare(req.body.password, user.password, (err, response) => {
//         if (err || !response)
//           return res.json({ loginStatus: false, Error: "Wrong email or password" });

//         const token = jwt.sign(
//           { role: user.role, email: user.email, id: user.id },
//           "jwt_secret_key",
//           { expiresIn: "1d" }
//         );
//         res.cookie("token", token);
//         return res.json({ loginStatus: true });
//       });
//     } else {
//       return res.json({ loginStatus: false, Error: "Wrong email or password" });
//     }
//   });
// });


// router.post("/adminlogin", async (req, res) => {
//     try {
//       console.log("Login attempt with email:", req.body.email);
  
//       // Step 1: Query the database to get the user based on email
//       const sql = "SELECT user_id, email, password, roleid FROM users WHERE email = ? LIMIT 1";
      
//       const [results] = await new Promise((resolve, reject) => {
//         con.query(sql, [req.body.email], (err, results) => {
//           if (err) reject(err);
//           resolve(results);
//         });
//       });
  
//       if (!results || results.length === 0) {
//         console.log("No user found with email:", req.body.email);
//         return res.json({ loginStatus: false, Error: "Wrong email or password" });
//       }
  
//       const user = results[0];
//       console.log("User found:", user);
  
//       // For first-time setup: How to properly hash a password
//       // const hashedPassword = await bcrypt.hash('mysecurepassword', 10);
//       // Then store hashedPassword in database
  
//       // Step 2: Compare the password
//       const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
//       if (!passwordMatch) {
//         console.log("Password comparison failed");
//         return res.json({ loginStatus: false, Error: "Wrong email or password" });
//       }
  
//       // Step 3: Generate JWT token
//       const token = jwt.sign(
//         { 
//           role: user.roleid, 
//           email: user.email, 
//           id: user.user_id 
//         },
//         "jwt_secret_key",
//         { expiresIn: "1d" }
//       );
  
//       // Set cookie and send response
//       res.cookie("token", token, { 
//         httpOnly: true, 
//         secure: process.env.NODE_ENV === 'production', 
//         sameSite: 'Strict'
//       });
  
//       return res.json({ loginStatus: true });
  
//     } catch (error) {
//       console.error("Login error:", error);
//       return res.status(500).json({ loginStatus: false, Error: "Internal server error" });
//     }
//   });
  

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
router.get("/employees", (req, res) => {
    // Assuming user_id is available from the logged-in session or JWT token
    const userId = req.user_id;  // You can set this from the session or JWT
  
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
router.get("/clients", (req, res) => {
  const sql = "SELECT * FROM clients";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Get client by ID
router.get("/client/:id", (req, res) => {
    const id = req.params.id;
    console.log(id)
    const sql = "SELECT * FROM clients WHERE user_id = ?";
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    });
  });




  router.post("/add_client", (req, res) => {
    const { name, company_name, ein, address, city, entity_corp, state, owner_address, phone_num } = req.body;
  
    // Step 1: Insert the new user into the users table
    const insertUserSql = `
      INSERT INTO users (name) 
      VALUES (?);
    `;
  
    con.query(insertUserSql, [name], (err, userResult) => {
      if (err) return res.json({ Status: false, Error: err });
  
      // Get the newly inserted user_id
      const newUserId = userResult.insertId;
  
      // Step 2: Insert the new client using the generated user_id and company_id
      const insertClientSql = `
        INSERT INTO clients 
          (user_id, company_id, name, company_name, ein, address, city, entity_corp, state, owner_address, phone_num)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      
      const values = [
        newUserId,  // The new user_id
        req.body.company_id, // Assuming company_id is passed in the request body
        name,
        company_name,
        ein,
        address,
        city,
        entity_corp,
        state,
        owner_address,
        phone_num
      ];
  
      con.query(insertClientSql, values, (err, clientResult) => {
        if (err) return res.json({ Status: false, Error: err });
  
        return res.json({
          Status: true,
          user_id: newUserId,
          message: "Client and user created successfully!"
        });
      });
    });
  });  

// Update client
router.put("/edit_client/:id", (req, res) => {
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
      return res.json({ Status: true });
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
