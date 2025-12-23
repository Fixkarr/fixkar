// get all messages from selected user

import { Message } from "../models/messageModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { io, userSocketMap } from "../server.js"

export const getMessages = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.userId;

    const messages = await Message.find({
      $or: [
        { sender: senderId, reciever: recieverId },
        { sender: recieverId, reciever: senderId }
      ]
    })


    res.status(200).json({
      message: "Messages fetched successfully",
      messages
    })

  } catch (error) {
    console.log(error.message)
    return res.status(500).json(
      { message: "Internal server error" }
    )
  }
}


// send message to selected user


export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { recieverId } = req.params;
    const senderId = req.userId;

    let attachmentsArray = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        // allow only image & video
        if (
          !file.mimetype.startsWith("image/") &&
          !file.mimetype.startsWith("video/")
        ) {
          return res.status(400).json({
            message: "Only image and video files are allowed",
          });
        }

        const isVideo = file.mimetype.startsWith("video/");
        const resourceType = isVideo ? "video" : "image";
        const folder = isVideo
          ? "chat_attachments/videos"
          : "chat_attachments/images";

        const uploadResult = await uploadToCloudinary(
          file,
          folder,
          resourceType
        );

        attachmentsArray.push({
          url: uploadResult.secure_url,
          fileType: resourceType,
        });
      }
    }

    if (!message && attachmentsArray.length === 0) {
      return res.status(400).json({
        message: "Message or attachment required",
      });
    }
    const isReceiverOnline = userSocketMap[recieverId];
    const newMessage = await Message.create({
      sender: senderId,
      reciever: recieverId,
      message: message || "",
      attachments: attachmentsArray,
        status: isReceiverOnline ? "delivered" : "sent",
        deliveredAt: isReceiverOnline ? new Date() : null,
    });

    // emit message via socket
    const recieverSocketId = userSocketMap[recieverId];
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    // sender ko bhi bhejo (multi-tab case)
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

      if (recieverSocketId && senderSocketId) {
      io.to(senderSocketId).emit("messageDelivered", {
        messageId: newMessage._id,
      });
    }

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("Send message error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const getMyConversations = async (req, res) => {
  try {
    const myId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: myId }, { reciever: myId }]
    })
      .sort({ createdAt: -1 })
      .populate("sender", "fullName profilePicture")
      .populate("reciever", "fullName profilePicture");

    const conversationsMap = {};

    messages.forEach(msg => {
      const otherUser =
        msg.sender._id.toString() === myId
          ? msg.reciever
          : msg.sender;

      if (!conversationsMap[otherUser._id]) {
        conversationsMap[otherUser._id] = {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unseenCount: 0,
        };
      }

      // unseen messages (only received ones)
      if (
        msg.reciever._id.toString() === myId &&
        msg.status !== 'seen'
      ) {
        conversationsMap[otherUser._id].unseenCount += 1;
      }
    });

    res.status(200).json({
      conversations: Object.values(conversationsMap)
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

