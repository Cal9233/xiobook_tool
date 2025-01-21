const express = require("express");
const con = require("../utils/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const router = express.Router();


////// Employee_Info Routes ////////

// Get employee_info by ID
router.get("/employee_info/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee_info WHERE employee_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.length > 0) {
      // Data exists
      return res.json({ Status: true, Result: result });
    } else {
      // No data found
      return res.json({ Status: false, Result: null, Message: "No data found for the employee" });
    }
  });
});

/////// Add employee_info ////////
// Add employee
router.post("/add_employee_info/:employeeId", (req, res) => {
  console.log("=== Add Employee Info Route Start ===");
  console.log("Employee ID from params:", req.params.employeeId);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  let employee_id = req.params.employeeId;
  
  const sql = `INSERT INTO employees 
    (employee_id, date, check_number, gross_wages_per_week, fed_income_tax_wh, soc_sec, medicare, futa_annual_er, 
    ca_pit_wh, sdi, sui, ett, net_wages) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    employee_id,
    req.body.date,
    req.body.check_number,
    req.body.gross_wages_per_week,
    req.body.fed_income_tax_wh,
    req.body.soc_sec,
    req.body.medicare,
    req.body.futa_annual_er,
    req.body.ca_pit_wh,
    req.body.sdi,
    req.body.sui,
    req.body.ett,
    req.body.net_wages
  ];

  console.log("SQL Query:", sql);
  console.log("Values array:", values);

  // There's a potential issue here - [values] creates a nested array
  // Let's fix that and add more logging
  con.query(sql, values, (err, result) => {
    if (err) {
      console.log("=== Database Error ===");
      console.log("Error:", err);
      console.log("Error SQL State:", err.sqlState);
      console.log("Error Code:", err.code);
      console.log("Error Message:", err.message);
      return res.json({ Status: false, Error: err });
    }
    console.log("=== Success ===");
    console.log("Insert Result:", result);
    return res.json({ Status: true });
  });
});

////// Employee Routes /////////

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

// Add employee
router.post("/add_employee/:clientId", (req, res) => {
  console.log("=== Add Employee Route Start ===");
  console.log("Client ID from params:", req.params.clientId);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  let client_id = req.params.clientId;
  
  const sql = `INSERT INTO employees 
    (client_id, first_name, middle_name, last_name, ssn, street_address, city, state, date_of_birth, hire_date, job_title,
      i9_date, w4_date, dependents, marital_status, employment_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    client_id,
    req.body.first_name,
    req.body.middle_name,
    req.body.last_name,
    req.body.ssn,
    req.body.street_address,
    req.body.city,
    req.body.state,
    req.body.date_of_birth,
    req.body.hire_date,
    req.body.job_title,
    req.body.i9_date,
    req.body.w4_date,
    req.body.dependents,
    req.body.marital_status,
    req.body.employment_status,
  ];

  console.log("SQL Query:", sql);
  console.log("Values array:", values);

  // There's a potential issue here - [values] creates a nested array
  // Let's fix that and add more logging
  con.query(sql, values, (err, result) => {
    if (err) {
      console.log("=== Database Error ===");
      console.log("Error:", err);
      console.log("Error SQL State:", err.sqlState);
      console.log("Error Code:", err.code);
      console.log("Error Message:", err.message);
      return res.json({ Status: false, Error: err });
    }
    console.log("=== Success ===");
    console.log("Insert Result:", result);
    return res.json({ Status: true });
  });
});

// Get employee by ID
router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employees WHERE employee_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Update employee
router.put("/edit_employee/:id", (req, res) => {
  let employee_id = req.params.id;
  const sql = `UPDATE employees 
               SET first_name = ?, middle_name = ?, last_name = ?, ssn = ?, street_address = ?, 
               city = ?, state = ?, date_of_birth = ?, hire_date = ?, job_title = ?, i9_date = ?, w4_date = ?,
               dependents = ?, marital_status = ?, employment_status = ?
               WHERE employee_id = ?`;

  const values = [
    req.body.first_name,
    req.body.middle_name,
    req.body.last_name,
    req.body.ssn,
    req.body.street_address,
    req.body.city,
    req.body.state,
    req.body.date_of_birth,
    req.body.hire_date,
    req.body.job_title,
    req.body.i9_date,
    req.body.w4_date,
    req.body.dependents,
    req.body.marital_status,
    req.body.employment_status,
    employee_id
  ];
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true });
  });
});

// Delete employee
router.delete("/delete_employee/:id", (req, res) => {
const id = req.params.id;
const sql = "DELETE FROM employees WHERE employee_id = ?";
con.query(sql, [id], (err, result) => {
  if (err) return res.json({ Status: false, Error: "Query Error" + err });
  return res.json({ Status: true });
});
});


////// Client Routes //////////
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
  const id = req.params.id;
  const sql = `UPDATE clients 
               SET name = ?, company_name = ?, ein = ?, address = ?,
               city = ?, state = ?, entity_corp = ?, owner_address = ?,
               phone_num = ? 
               WHERE client_id = ?`;
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
