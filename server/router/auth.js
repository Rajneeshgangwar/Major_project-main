
const express=require('express');
const jwt=require('jsonwebtoken');
const User = require('../model/userSchema');
const router=express.Router();
const bcrypt=require('bcryptjs');
const authenticate =require('../middleware/authenticate');
const otpGenerator = require('otp-generator')
const Worker = require("../model/userSchema");
const moment=require('moment');
const nodemailer=require('nodemailer');

const multer=require('multer');

// image upload routes
// image storage path

const imageconfig=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        callback(null,`image=${Date.now()}.${file.originalname}`)
    }
})

// image filter
const isImage=(req,file,callback)=>{
     if(file.mimetype.startsWith("image")){
        callback(null,true)
     }else{
        callback(new Error("Only image is allowed"))
     }
}

const upload=multer({
    storage:imageconfig,
    fileFilter:isImage
})

router.get('/',(req,res) =>{
    res.send(`Hello world from router`);
});
let one_time_password;
router.post('/register', async (req,res) =>{
     const {name,email,password,cpassword}= req.body;
       if ( !name || !email|| !password || !cpassword ){
          return res.status(422).json({error:"Error Please Fill The Details"});
          
       }
       try{
        const userExist= await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"User Already Exist"});
        }else if(password!=cpassword){
            return res.status(422).json({error:"Password Not matched"});
        }
        else{

            const user=new User({name,email,password,cpassword});
            const userRegister=await user.save();
            if(userRegister){
                res.status(201).json({message:"User Registered Successfully"});
            }
        }

       }catch(err){
        console.log(err);
       }
      
});
// login route generate the token to user login
let ex;
router.post('/login',async(req,res)=>{
       try{
        let token;
         const {email,password}=req.body;
         if(!email || !password){
            return res.status(400).json({error:"Please Fill The Details"});
         }

         const userLogin= await User.findOne({email:email}); 
         
         
         if(userLogin){
             
             const isMatch= await bcrypt.compare(password,userLogin.password);
             
             token= await userLogin.generateAuthToken();
             res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+2589000000),
                httpOnly:true
             });
        
          if(!isMatch){
             res.status(400).json({error:"Invalid Crediantials"});
            }
        else{
             res.json({message:"User Login Successfully"});
             console.log("successfull login");
         }
        }
        else{
            res.status(400).json({error:"Invalid Crediantials"});
        }
     
       }catch(err){
              console.log(err);
       }
    
});

router.get('/about',authenticate,(req,res) =>{
    res.send(req.rootUser);
});
// edit User Details just like location and other details
router.patch('/edit/:id',(req,res,next)=>{
    console.log(req.params.id)
    User.findOneAndUpdate({_id:req.params.id},{
        $set:{
           name: req.body.name,
           address: req.body.address,
           

        }
    })
    .then(result=>{
        res.status(200).json({
            updatedUser:result
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})


router.get('/getdata',authenticate,(req,res) =>{
    res.send(req.rootUser);
});

router.get('/logout', (req, res) => {
    console.log(`Hello my logout`);
    res.clearCookie('jwtoken', { path:'/' });
    res.status(200).send('user logout');
});
///......dashboard

let s_no;
let id,result;
router.get('/dashboard', authenticate, (req, res) => {
    id=req.rootUser.email;
            const getcall = async () => {
                try{
                     result = await Worker.find({email : id}).countDocuments();
                    //  s_no= await MGNREGA.Worker.countDocuments();
                    
                    
                     

                }catch (err) {
                    console.log(err);
                }
            }
            getcall();
            //res.json({ message:"user signin success" });
    
            Worker.count(function(err,countData){
                s_no=countData;
                //you will get the count of number of documents in mongodb collection in the variable 
                console.log(countData);                
                });
    const data = {
        result: result,
        a: req.rootUser.email,
        b: req.rootUser.name,
        rootUser: req.rootUser
      };

    res.send(data);
});
  // user registration 
router.post('/signup',upload.single("photo"), async (req, res) => {
    const {name, email, password, cpassword, phone_number,age, address, district,pincode,state,gender,blood_group} = req.body;
    
    const {filename}=req.file;
 

    if( !filename ||!name || !email || !password || !cpassword || !phone_number || !age || !address || !district || !pincode || !state || !gender || !blood_group)
    {
        return res.status(422).json({error: "please filled"});
    }

    try{
        const userExist = await Worker.findOne({ email: email })
        //
        if(userExist) {
            return res.status(422).json({error: "ID exist"});
        }
        else{
      
            // const user = new Worker({ name, email, password, cpassword, phone_number,age, address, district,pincode,state,gender,blood_group});
             var user=new Worker({
               
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                cpassword:req.body.cpassword,
                phone_number:req.body.phone_number,
                age:req.body.age,
                address:req.body.address,
                district:req.body.district,
                pincode:req.body.pincode,
                state:req.body.state,
                gender:req.body.gender,
                blood_group:req.body.blood_group,
                photo:filename
             })
            let mailTranporter = nodemailer.createTransport({
                service: "gmail",
                auth:{
                    user: "switch.case7105@gmail.com",
                    pass: "pqocmgyrvhculjen"
                    
                }
            })
            one_time_password = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            let details = {
                from:"switch.case7105@gmail.com",
                to : email,
                subject : "testing our nodemailer",
                text: "Thank you for joining us , Your one time password for registration in Blood Bank is : "+one_time_password
            }
            
            //one_time_password = otp;
            console.log( one_time_password);
            
            
            email_validation = () => {
                mailTranporter.sendMail(details,(err)=>{
                    if(err){
                        console.log("it has an error",err);
                    }
                    else{
                        console.log("email has sent!");
                    }
                    
                })
            }
            
            const getcall = async () => {
                // try{
                    //      result = await Worker.find({reff_id : id}).countDocuments();
                    // }catch (err) {
                        //     console.log(err);
                        // }
                    }
                    email_validation();
                    getcall();
                    const userRegister = await user.save();
                    res.json({ message:"user signin success" });
                    
            // otp validation.....................................................
           
        if(userRegister){
            res.status(201).json({ message: "Worker register successfuly"});
        }

    }
        
    } catch(err) {
        console.log(err);
    }

    
});
/////.............

/// otp validation..............................................
router.post('/otp_validator', async (req, res) => {
    const { otp} = req.body;
   // console.log(one_time_password);
    console.log(otp);
    

    if(!otp)
    {
        return res.status(422).json({error: "please filled"});
    }

    try{
        //const userExist = await User.findOne({ userid: userid })

        if(otp === one_time_password) {
              res.status(201).json({ message: "user Signin successfuly"});
        }
        else{
        //     const user = new User({ name, userid, password, cpassword });

         res.status(422).json({message: "email exist"});
        // const userRegister = await user.save();
       
        

        }

        
    } catch(err) {
        console.log(err);
    }

});

/// otp validation...........................................

module.exports=router;
