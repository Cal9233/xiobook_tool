const express = require("express");
const con = require("../utils/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

// Employee login
router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employees WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err || !response)
          return res.json({ loginStatus: false, Error: "Wrong email or password" });

        const employee = result[0];
        const token = jwt.sign(
          { role: "employee", email: employee.email, id: employee.id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true, id: employee.id });
      });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

// Get employee details by ID
router.get("/detail/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT e.*, c.name AS client_name
    FROM employees e
    JOIN clients c ON e.client_id = c.id
    WHERE e.id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "Employee not found" });
    }
  });
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

module.exports = router;