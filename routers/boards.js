const express=require("express");
const router=express.Router();
const { Boards } = require("../models");
const { Op } = require("sequelize");
const {needSignin}=require("../middlewares/need-signin.middleware.js");



// 게시글 전체 조회
router.get('/boards', async (req, res) => {
  
    const boards = await Boards.findAll({
      attributes: ["id","userName", "title", "createdAt", "updatedAt"]
    });
  
    res.status(200).json({ data: boards });
  });

// 게시글 상세 조회
router.get('/boards/:id', async (req, res) => {
    const { id } = req.params;
    const boards = await Boards.findOne({
      attributes: ["id", "userName","title", "text", "createdAt", "updatedAt"],
      where: { id }
    });
  
    res.status(200).json({ data: boards });
  });

// 게시글 생성
router.post('/boards', async (req, res) => {
  const userName = res.locals.user.name;
    const {  title, text } = req.body;
    const boards = await Boards.create({ userName,title, text});
  
    res.status(201).json({ data: boards });
 
  });


// 게시글 수정
router.put('/boards/:id', async (req, res) => {
  const { id } = req.params;
  
  const { title,text } = req.body;

  const boards = await Boards.findOne({ where: { id } });
  if (!boards) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }  

  await Boards.update(
    { title, text },
    {
      where: {
        [Op.and]: [{ id },[{userName}]],
      }
    }
  );
  res.status(200).json({ data: "게시글이 수정되었습니다." });
});

// 게시글 삭제
router.delete('/boards/:id', async (req, res) => {
  const { id } = req.params;

  const boards = await Boards.findOne({ where: { id } });
  if (!boards) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }

  await Boards.destroy({ where: { id } });

  res.status(200).json({ data: "게시글이 삭제되었습니다." });
});

module.exports = router;