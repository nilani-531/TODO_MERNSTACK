//Using Express
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

//create instance of express
const app=express(); 
app.use(express.json())
app.use(cors())

//sample in-memory storage for todo items
//let todos=[];

//Connecting Mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('DB Connected !')
})
.catch((err) =>{
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String
})

//create model
const todoModel = mongoose.model('Todo',todoSchema);

//Create a new todo item
app.post('/todos',async (req,res) => {
    const {title,description} = req.body;
    //const newTodo={
    //    id:todos.length + 1,
    //    title,
       // description
   // };
   // todos.push(newTodo);
   // console.log(todos);
   try
   {
    const newTodo = new todoModel({title,description});
    await newTodo.save();
    res.status(201).json(newTodo);
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:error.message});
   }
 
  
})
//Get all items from Mongodb
app.get('/todos',async (req,res) => {
    try {
       const todos = await todoModel.find();
       res.json(todos);
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }    
})

//Update a todo item
app.put("/todos/:id",async (req,res) =>{
    try {
        const {title,description} = req.body;
    const id = req.params.id; //this id refers to the parameter which you declared in put if there change  change here also
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
    if(!updatedTodo){
        return res.status(404).json({message:"Todo not found"})
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
    
})

//Delete a todo Item
app.delete('/todos/:id',async (req,res) =>
{
    try {
        const id=req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
    
})


//start the server
const port=8000;
app.listen(port,() => {
    console.log("Server is listening to port "+port);
})