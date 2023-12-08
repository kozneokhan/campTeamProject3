const { Router } = require('express');
const { authRouter } = require('./auth.router.js');
const { userRouter } = require('./users.router.js');
const { lolRouter } = require('./lol.router.js');
const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/search', lolRouter);

module.exports = { apiRouter };
