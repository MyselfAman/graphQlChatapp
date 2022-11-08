const express = require("express");
const auth = require('../middleware/auth');
// controllers
const chat = require('../controllers/chat');

const router = express.Router();

router
  .get('/getallmessages', auth, chat.getallConversation)
  .post('/message', auth, chat.writeMessage)


module.exports = router;
