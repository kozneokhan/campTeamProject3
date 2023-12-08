const { Router } = require('express');
//const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index.js');

const {
  PASSWORD_HASH_SALT_ROUNDS,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
} = require('../constants/security.constant.js');

const cookieParser = require('cookie-parser');

const { Users } = db;
//const { Users } = require('../models');

const authRouter = Router();
authRouter.use(cookieParser());

// 회원가입
authRouter.post('/signup', async (req, res) => {
  try {
    const { account, password, passwordconfirm, name } = req.body;

    if (!account) {
      return res.status(400).json({
        success: false,
        message: '이메일 입력이 필요합니다.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 입력이 필요합니다.',
      });
    }

    if (!passwordconfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 확인 입력이 필요합니다.',
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: '이름 입력이 필요합니다.',
      });
    }

    if (password !== passwordconfirm) {
      return res.status(400).json({
        success: false,
        message: '입력한 비밀번호가 서로 일치하지 않습니다.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자리 이상 입력해야합니다.',
      });
    }

    const existUser = await Users.findOne({ where: { account } });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: '이미 가입 된 이메일 입니다.',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = (
      await Users.create({ account, password: hashedPassword, name })
    ).toJSON();
    delete newUser.password;
    return res.status(201).json({
      success: true,
      message: '회원가입에 성공했습니다.',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

// 로그인
authRouter.post('/signin', async (req, res) => {
  try {
    const { account, password } = req.body;
    if (!account) {
      return res.status(400).json({
        success: false,
        message: '이메일 입력이 필요합니다.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 입력이 필요합니다.',
      });
    }

    const user = (await Users.findOne({ where: { account } }))?.toJSON();
    const hashedPassword = user?.password;
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);
    const isCorrectUser = user && isPasswordMatched;
    if (!isCorrectUser) {
      return res.status(401).json({
        success: false,
        message: '일치하는 인증 정보가 없습니다.',
      });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    res.cookie('accessToken', accessToken, { httpOnly: true });

    return res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다.',
      data: { accessToken },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

// 로그아웃
authRouter.post('/signout', (req, res) => {
  try {
    console.log(req.cookies);

    res.clearCookie('accessToken');

    return res.status(200).json({
      success: true,
      message: '로그아웃 되었습니다.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

module.exports = { authRouter };
