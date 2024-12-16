const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const { z } = require('zod');
const mongoose = require('mongoose');
app.use(express.json());

mongoose.connect(.dotenv))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('user_app', UserSchema);

const Secret_key = 'Mukund';
const schema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Invalid email address!' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters!' })
});

const authenticate_users = async (req, res, next) => {
  try {
    const { name, email } = schema.parse(req.body);
   const userExists = await User.findOne({ $or: [{ name }, { email }] });
    if (userExists) {
      return res.status(401).send('User with this name or email already exists!');
    }
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).send('Server error');
  }
};

app.post('/login', authenticate_users, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User ({ name, email, password });
    await newUser.save();
    const token = jwt.sign({ user_id: newUser._id, user_name: newUser.name }, Secret_key, { expiresIn: '1h' });

    res.json({
      status: 'Successfully Registered!',
      user_data: newUser,
      token: token
    });
  } catch (err) {
    console.error('Error during user registration:', err.message);
    res.status(500).send('Error creating user: ' + err.message);
  }
});
app.get('/get', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(400).send('Token not received');
  }

  const tokenWithoutBearer = token.split(' ')[1];
  jwt.verify(tokenWithoutBearer, Secret_key, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token verification failed: ' + err.message);
    }
    res.status(200).json({
      msg: decoded,
      Auth: 'Authenticated successfully!'
    });
  });
});

let port = 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
