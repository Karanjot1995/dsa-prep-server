const express = require('express');

const router = express.Router()
module.exports = router;
const Question = require('../models/question');
const Tag = require('../models/tag');

router.post('/create', async (req, res) => {
  if(req.body.id){
    const options = { upsert: true };
    let data = await Question.updateOne({_id:req.body.id}, {
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
        res.status(400).json({message: error.message})
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
    })
    try {
      const dataToSave = data.save();
      res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
  }
})

router.post('/update-solved', async (req, res) => {
  let data = await Question.updateOne({_id:req.body.id}, {
    $set: {
      solved: req.body.is_solved?1:0
    }
  })
  try {
    res.status(200).json(data)
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }
})

router.get('/all', async (req, res) => {
  try{
    const questions = await Question.find();
    const allTags = await Tag.find();
    let tags = {}
    allTags.map(t=>tags[t._id]={_id: t._id, title:t.title, questions:[], tag_id: t.tag_id})
    questions.map(q=>{
      q.tags.map(id=>tags[id]&&tags[id].questions.push(q))
    })

    res.send(Object.values(tags))
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})


router.get('/question/:id', async (req, res) => {
  try{
    const data = await Question.findOne({_id:req.params.id});
    res.status(200).json(data)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

router.get('/tags', async (req, res) => {
  try{
    const tags = await Tag.find();
    res.send(tags)
  }
  catch(error){
    res.status(500).json({message: error.message})
  }
})

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