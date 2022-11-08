// utils
const makeValidation = require('@withvoid/make-validation');
// models
const  {ChatRoomModel, CHAT_ROOM_TYPES } = require('../models/ChatRoom.js');
const ChatMessageModel = require('../models/ChatMessage.js');
const UserModel = require('../model/user.js');

export default {
  writeMessage: async (req, res) => {
    try {
      const { username, message } = req.body;
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          messageText: { type: types.string },
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.userId;
      const post = await ChatMessageModel.createPostInChatRoom(messagePayload, currentLoggedUser);
      global.io.sockets.in(roomId).emit('new message', { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  getallConversation: async (req, res) => {
    try {
      const allUsers = req.body;
      const mymessages = await ChatMessageModel.getallConversation(
        options, allUsers
      );
      return res.status(200).json({ success: true, conversation: mymessages });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  }
}