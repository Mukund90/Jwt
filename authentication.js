const express = require('express')
const {z} = require('zod')
const app = express ()
app.use(express.json())

 const userSchema = z.object({
    username: z.string().min(1,{msg:"username is required!"}),
    password: z.string().regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        { message: "Password must be at least 8 characters long and include letters, numbers, and special characters" }
      ),
  });

const authenticated =  (req,res,next)=>
{     userSchema.parse(req.body);
    
    const {username,password} = req.body
    console.log(req.headers)
    console.log(req.method)
    console.log(req.url)

    if(username!== 'Mukund jha' || password !== 'Mukund@2003')
    {
     return res.json({
        msg : "invalid users!"
     })
    }
    
  
    console.log('authentication sucessfully!')

   next()
}

app.use(authenticated)

app.get('/',authenticated,(req,res)=>
{
    res.send('hello Mukund you are authenticated!')
})

// app.use(gobal_input_validation)
let port = 3000;
app.listen(port,()=>
{
    console.log(`listening on port : ${port}`)
})