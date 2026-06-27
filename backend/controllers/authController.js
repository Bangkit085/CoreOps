const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {

  try {

    const {
      username,
      email,
      password,
      role
    } = req.body;

    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      async (err, result) => {

        if (err) {
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email sudah digunakan"
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users
          (username,email,password,role)
          VALUES (?,?,?,?)`,
          [
            username,
            email,
            hashedPassword,
            role || "Customer"
          ],
          (err, result) => {

            if (err) {
              return res.status(500).json(err);
            }

            res.json({
              message: "Register berhasil"
            });

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// LOGIN
exports.login = (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan"
        });
      }

      const user = result[0];

      const valid =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!valid) {
        return res.status(401).json({
          message: "Password salah"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    }
  );

};