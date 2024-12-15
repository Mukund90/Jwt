const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const {z} = require('zod')
app.use(express.json());

const Secret_key = 'Mukund@20087';  
  var id = 1;

 const schema = z.object(
  {
    name : z.string(),
    email:z.string().email({msg:'email should required!'}),
    password:z.string().min(6,{msg:'minimum password should be 8 character!'})
 })

 let localstorage_user = [
  {  
    user_id: 1,
    name: 'Mukund Jha',
    email: 'jhamukund986@gmail.com',
    password: 'Mukund@3'
  }
];

const authenticate_users = (req, res, next) => {
  const { name, email } = schema.parse(req.body);

 
  const userExists = localstorage_user.find(
    user => user.name === name || user.email === email
  );

  if (userExists) {
    return res.status(401).send('User with this name or email already exists!');
   
  }
  next();
};

app.use(authenticate_users);
app.post('/login',authenticate_users, (req, res) => {
  const { name, email, password } = req.body;
  id++;
  const user_data = {
    user_id: id,
    name: name,
    email: email,
    password: password
  };
  localstorage_user.push(user_data);
  const token = jwt.sign({ user_id: user_data.user_id, user_name: user_data.name }, Secret_key, { expiresIn: '1h' });

  res.json({
    status: 'Successfully Registered!',
    user_data: user_data,
    token: token  
  });
});

app.get('/get', (req, res) => {
  const token = req.headers['authorization'];
  console.log(token)
  const tokenWithoutBearer = token.split(' ')[1];

  if (!token) {
    return res.status(400).send('Token not received');
  }

  jwt.verify(tokenWithoutBearer, Secret_key, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token verification failed' + err.msg);
    }
    res.status(200).json({
      msg: decoded,  
      Auth: 'Authenticated successfully!'
    });
  });
});

let port = 3000;
app.listen(port, () => {
  console.log(`Listening on port :${port}`);
});
