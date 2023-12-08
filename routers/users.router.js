const { Router } = require('express');
const { needSignin } = require('../middlewares/need-signin.middleware.js');
const {
  PASSWORD_HASH_SALT_ROUNDS,
} = require('../constants/security.constant.js');
const { Users } = require('../models/');
const userRouter = Router();
const bcrypt = require('bcrypt');

// 마이페이지 정보 조회하는 API
userRouter.get('/me', needSignin, async (req, res) => {
  try {
    const name = res.locals.user.name;
    const id = res.locals.user.id;
    const userInformation = await Users.findOne({
      where: { id },
    });
    const { nickname, oneLiner } = userInformation;
    res.status(200).json({
      name,
      nickname: nickname ?? '롤 닉네임을 적어주세요',
      oneLiner: oneLiner ?? '자기소개를 해주세요',
      success: true,
      message: '내 정보 조회에 성공하였습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

// 내정보 수정하는 API
userRouter.put('/me', needSignin, async (req, res) => {
  try {
    const { nickname, oneLiner, password, passwordconfirm } = req.body;
    const id = res.locals.user.id;

    const userPassword = res.locals.user.password;
    const hashPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);
    const userNickname = await Users.findOne({
      where: { nickname },
    });
    // 닉네임 중복 확인
    if (userNickname) {
      res.status(409).json({
        message: '해당 닉네임은 이미 존재하거나 기존 닉네임과 동일합니다.',
      });
      return;
    }
    // 입력값이 없을 경우
    if (!nickname || !oneLiner) {
      res.status(400).json({ message: '닉네임 또는 자기소개를 작성해주세요' });
      return;
    }
    if (!password || !passwordconfirm) {
      res.status(400).json({ message: '비밀번호를 입력해주세요' });
      return;
    }
    // 비밀번호 제한사항
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자리 이상 입력해야합니다.',
      });
    }
    // 비밀번호 일치확인
    if (password !== passwordconfirm) {
      res
        .status(400)
        .json({ message: 'password가 confirmPassword와 일치하지 않습니다.' });
      return;
    }
    await Users.update(
      { nickname, oneLiner, password: hashPassword },
      { where: { id } },
    );
    res.send({
      nickname: nickname,
      oneLiner: oneLiner,
      success: true,
      message: '프로필을 수정하였습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

module.exports = { userRouter };
