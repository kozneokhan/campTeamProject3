const express = require('express');
const { SERVER_PORT } = require('./constants/app.constant.js');
const { apiRouter } = require('./routers/index.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const boardsRouter = require('./routers/boards.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('test'));

app.use('/api', [apiRouter, boardsRouter]);

app.listen(SERVER_PORT, () => {
  console.log(`App listening on port ${SERVER_PORT}`);
});
// test중입니다.
