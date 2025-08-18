// server.js
import express from "express";
import sql from "mssql";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const config = {
  user: "sa",
  password: "tu_password",
  server: "localhost",
  database: "kehilapp",
  options: { encrypt: false }
};

app.post("/api/register", async (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input("Nombre", sql.NVarChar, nombre)
      .input("Email", sql.NVarChar, email)
      .input("Telefono", sql.NVarChar, telefono)
      .input("ContraseñaHash", sql.NVarChar, hash)
      .query(`INSERT INTO Usuarios (Nombre, Email, Telefono, ContraseñaHash) 
              VALUES (@Nombre, @Email, @Telefono, @ContraseñaHash)`);
    res.send({ success: true });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query(`SELECT * FROM Usuarios WHERE Email=@Email`);
    const user = result.recordset[0];
    if (user && await bcrypt.compare(password, user.ContraseñaHash)) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3001, () => console.log("API corriendo en http://localhost:3001"));
