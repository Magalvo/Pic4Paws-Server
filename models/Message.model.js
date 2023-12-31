import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Message = model('Message', MessageSchema);
export default Message;
