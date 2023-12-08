const { Router } = require('express');
const lolhelper = require('../helper/lolhelper.js');
const lolRouter = Router();

lolRouter.get('/:userid', async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: '유저 아이디 입력이 필요합니다.',
      });
    }
    final = await lolhelper.getEncryptedSummonerId(userid);
    res.status(200).json({ final });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

module.exports = { lolRouter };
