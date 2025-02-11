const express = require("express")
const app=express()
const dotenv=require("dotenv")
dotenv.config()
let PORT=process.env.PORT
const {open}=require("sqlite")
const sqlite3=require("sqlite3")
const path=require("path")
const cors=require("cors")
app.use(cors({origin:"*"}))

const dbPath=path.join(__dirname,"data.db")
let db=null
app.use(express.json())
const joi=require("joi")

const contactSchema=joi.object({
    name:joi.string().min(3).max(30).required().messages({
        "string.empty":"Name is required",
        "string.min":"Name must be at least 3 characters",
        "string.max":"Name must be at most 30 characters"

    }),
    email:joi.string().email().required().messages({
        "string.empty":"Email is required",
        "string.email":"Invalid email format"
    }),
    phone_number:joi.string().pattern(/^\d{10}$/).required().messages({
        "string.empty":"Phone number is required",
        "string.pattern.base":"phone number must be exactly 10 characters"
    })
})


const idSchema=joi.object({
    contact_id:joi.number().integer().positive().required()
})

const searchSchema=joi.object({
    name:joi.string().min(3).max(30),
    email:joi.string().email()
})

const initializeDBAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        }),
        app.listen(PORT,()=>{
            console.log(`server running successfully at ${PORT}`)
        })

    }catch(e){
        console.log(`DB Erro: ${e.message}`)
        process.exit(1)
    }
}

initializeDBAndServer()

//GET REQUEST
app.get('/contacts',async(request,response)=>{
    try{
const {error}=searchSchema.validate(request.query)
if(error){
    return response.status(400).json({error:error.details[0].message})
}
const {name,email}=request.query


let contactsQuery = `SELECT * FROM contacts`;
let params = [];

if (name || email) {
    contactsQuery += " WHERE 1=1"; 
    if (name) {
        contactsQuery += " AND name LIKE ?";
        params.push(`%${name}%`);
    }
    if (email) {
        contactsQuery += " AND email LIKE ?";
        params.push(`%${email}%`);
    }
}

const contactsArray = await db.all(contactsQuery, params);

if (contactsArray.length === 0) {
    return response.status(404).json({ message: "No contacts found" });
}

response.status(200).json({ contactsList: contactsArray });
    
    }catch(e){
        console.log("Error fetching contacts :",e.message)
        response.status(404).json({error:e.message})
    }
    
})

//GET REQUEST FOR SINGLE RESOURCE
app.get('/contacts/:id',async(request,response)=>{
    try{
const {error}=idSchema.validate(request.params)
if(error){
    return response.status(400).json({error:"Invalid Contact Id"})
}

        const {id}=request.params
        const idnum=parseInt(id)
    const contactQuery=`select * from contacts 
    where
    contact_id=${idnum};`
    const contactItem=await db.get(contactQuery)
    if(!contactItem){
        return response.status(404).json({ error: "Contact not found" });
    }
    response.status(200).json({contactItem})

    }catch(e){
        console.log("Error fetching contact :",e.message)
        response.status(404).json({error:e.message})
    }
    

})

//DELETE REQUEST
app.delete('/contacts/:id',async(request,response)=>{
    try{
      const {error}=idSchema.validate(request.params) 
      if(error){
        return response.status(400).json({error:"Invalid Contact Id"})
      } 
    const {id}=request.params
    const deleteQuery=`DELETE FROM contacts where contact_id=${id}`
    const dbResponse=await db.run(deleteQuery)
    if (dbResponse.changes===0){
        return response.status(404).json({ error: "Contact not found" });
    }
    response.status(200).json({message:"Contact Deleted Successfully"})

    }catch(e){
        console.log("Error deleting contact",e.message)
        response.status(404).json({error:e.message})

    }
    
})

//POST REQUEST

app.post('/contacts',async(request,response)=>{
    try{
const {error}=contactSchema.validate(request.body)
if(error){
    return response.status(400).json({error:error.details[0].message})
}

        const {name,email,phone_number}=request.body
        const addcontactQuery=`INSERT INTO contacts (name,email,phone_number)
        values
        ('${name}','${email}','${phone_number}')
        ;`
        const dbResponse=await db.run(addcontactQuery)
        const lastId=dbResponse.lastID
        const newContactQuery=`select * from contacts where contact_id=${lastId};`;
        const newContact=await db.get(newContactQuery)
        response.status(201).json({newContact})
    }catch(e){
        console.log('Error adding contact',e.message)
        response.status(400).json({error:e.message})
    }
   
})

//PUT REQUEST

app.put('/contacts/:id',async(request,response)=>{
    try{
     const {error}=contactSchema.validate(request.body)   
     if(error){
        return response.status(400).json({error:error.details[0].message})
     }
        const {id}=request.params
    const {name,email,phone_number}=request.body
    const contactQuery=`UPDATE contacts 
    set
    name='${name}',
    email='${email}',
    phone_number='${phone_number}'
    where
    contact_id=${id}
    ;`
    const dbResponse=await db.run(contactQuery)
    if(dbResponse.changes===0){
        return response.status(404).json({ error: "Contact not found" });
    }
    response.status(200).json({contactItem:"Contact Updated Successfully"})

    }catch(e){
        console.log('Error updating contact',e.message)
        response.status(400).json({error:e.message})
    }
    
})