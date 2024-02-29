const express = require('express');

const router = express.Router()
const Question = require('../models/question');
const Tag = require('../models/tag');
const requireAuth = require("../middlewares/requireAuth");


router.post('/create',requireAuth, async (req, res) => {
  if(req.body.id){
    const options = { upsert: true };
    let data = await Question.updateOne({_id:req.body.id, uid:req.user._id}, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        tags: req.body.tags,
        language: req.body.language,
        difficulty: req.body.difficulty,
        solved:1,
        version: req.body.version,
      },
    }, options);
    try {
      res.status(200).json(data)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
  }else{
    let data = new Question({
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      tags: req.body.tags,
      language: req.body.language,
      difficulty: req.body.difficulty,
      solved:1,
      version: req.body.version,
      uid: req.user._id
    })
    try {
      const dataToSave = data.save();
      res.status(200).json(data)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
  }
})

router.post('/update-solved',requireAuth, async (req, res) => {
  let data = await Question.updateOne({_id:req.body.id, uid:req.user._id}, {
    $set: {
      solved: req.body.is_solved?1:0
    }
  })
  try {
    res.status(200).json(data)
  }
  catch (error) {
      res.status(400).json({error: error.message})
  }
})

router.get('/all', requireAuth, async (req, res) => {
  try{
    const questions = await Question.find({uid:req.user._id, uid:req.user._id});
    // await Question.updateMany({solved: 1}, {$set:{uid: "65de63ab8b1962e13f2f1c97"}})
    const allTags = await Tag.find();
    let tags = {}
    allTags.map(t=>tags[t._id]={_id: t._id, title:t.title, questions:[], tag_id: t.tag_id})
    questions.map(q=>{
      q.tags.map(id=>tags[id]&&tags[id].questions.push(q))
    })
    res.send(Object.values(tags))
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
})


router.get('/question/:id',requireAuth, async (req, res) => {
  try{
    const data = await Question.findOne({_id:req.params.id, uid:req.user._id});
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
})

router.get('/tags', async (req, res) => {
  try{
    const tags = await Tag.find();
    res.send(tags)
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
})

//Delete by ID Method
router.delete('/delete/',requireAuth, async (req, res) => {
  let result = await Question.deleteOne({_id: req.body.id, uid:req.user._id});
  try{
    if (result.deletedCount === 1) {
      res.status(200).json('Successfully Deleted')
    }else{
      res.status(200).json('No records found')
    }
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
})


module.exports = router;

// router.get('/hello', (req, res) => {
//   res.send('Hello')
// })


// router.get('/hello', (req, res) => {
//   const data = new Question({
//     title: "Graph Valid Tree",
//     description: "Graph Valid Tree",
//     code: "",
//     tags: [3],
//     language: "python",
//     difficulty: "Medium",
//     solved:1,
//     version: "",
//   })
//   const allTags = [
//     {id:5, title:'Two Pointers'},
//     {id:6, title:'Sliding Window'},
//     {id:7, title:'Stack'},
//     {id:8, title:'Binary Search'},
//     {id:9, title:'Heap/Priority Queue'},
//     {id:10, title:'Tries'},
//     {id:11, title:'Backtracking'},
//     {id:12, title:'Advanced Graphs'},
//     {id:13, title:'Greedy'},
//     {id:14, title:'Bit Manipulation'},
//   ]
//   let tags = []
//   allTags.map(t=>{
//     let tag = new Tag({title: t.title, tag_id:t.id})
//     tag.save()
//   })

//   try {
//     // const dataToSave = data.save();
//     const dataToSave =allTags;
//     res.status(200).json(dataToSave)
//   }
//   catch (error) {
//       res.status(400).json({message: error.message})
//   }
// })

// //Get by ID Method
// router.get('/getOne/:id', (req, res) => {
//   res.send('Get by ID API')
// })

// //Update by ID Method
// router.patch('/update/:id', (req, res) => {
//   res.send('Update by ID API')
// })

// //Delete by ID Method
// router.delete('/delete/:id', (req, res) => {
//   res.send('Delete by ID API')
// })