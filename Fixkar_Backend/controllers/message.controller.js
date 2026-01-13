// get all messages from selected user

import { Message } from "../models/messageModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { io, userSocketMap } from "../server.js"
import cloudinary from "../config/cloudinary.js"
import { pushNotification } from "../services/pushNotification.js";

export const getMessages = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.userId;

    const messages = await Message.find({
      $or: [
        { sender: senderId, reciever: recieverId },
        { sender: recieverId, reciever: senderId }
      ]
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      {
        sender: recieverId,
        reciever: senderId,
        status: { $ne: "seen" }
      },
      {
        status: "seen",
        seenAt: new Date()
      }
    );

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
    const isReceiverOnline = Boolean(userSocketMap[recieverId]);

    const newMessage = await Message.create({
      sender: senderId,
      reciever: recieverId,
      message: message || "",
      attachments: attachmentsArray,
        status: isReceiverOnline ? "delivered" : "sent",
        deliveredAt: isReceiverOnline ? new Date() : null,
    });

    let notificationMessage = "";

// TEXT has highest priority
if (message && message.trim() !== "") {
  notificationMessage =
    message.length > 80
      ? message.substring(0, 80) + "..."
      : message;
}

// ONLY MEDIA
else if (attachmentsArray.length > 0) {
  const hasVideo = attachmentsArray.some(
    (att) => att.fileType === "video"
  );

  if (hasVideo) {
    notificationMessage = "🎥 Video";
  } else if (attachmentsArray.length === 1) {
    notificationMessage = "📷 Photo";
  } else {
    notificationMessage = "📎 Media";
  }
}

await pushNotification({
  userId: recieverId,              // 👈 receiver
  title: "New message",
  message: notificationMessage,    // 👈 correct preview
  redirectUrl: `/`, // chat open
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

    if (recieverSocketId) {
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
   const myId = req.userId.toString();

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
          lastMessage:
  msg.message ||
  (msg.attachments?.length ? "📎 Attachment" : ""),
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
    res.status(500).json({ message: "Server error" });
  }
};

export const markMessagesSeen = async(req,res)=>{
    try {
    const { senderId } = req.body;
    const myId = req.userId;

    await Message.updateMany(
      {
        sender: senderId,
        reciever: myId,
        status: { $ne: "seen" }
      },
      {
        status: "seen",
        seenAt: new Date()
      }
    );

    // sender ko notify (ticks update)
    const senderSocket = userSocketMap[senderId];
    if (senderSocket) {
      io.to(senderSocket).emit("messagesSeen", {
        seenBy: myId
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark seen" });
  }
}


export const deleteMessagesForMe = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const myId = req.userId;

    const messages = await Message.find({
      _id: { $in: messageIds }
    });

    for (let msg of messages) {

      // already deleted by me?
      if (msg.deleteFor.includes(myId)) continue;

      // add myId to deletedFor
      msg.deleteFor.push(myId);
      await msg.save();

      // 🔥 CHECK: both sender & receiver deleted?
      const senderDeleted = msg.deleteFor.includes(msg.sender.toString());
      const receiverDeleted = msg.deleteFor.includes(msg.reciever.toString());

      if (senderDeleted && receiverDeleted) {
        // 🧹 CLEANUP CLOUDINARY
        if (msg.attachments?.length) {
          for (let att of msg.attachments) {
            if (att.publicId) {
              await cloudinary.uploader.destroy(
                att.publicId,
                { resource_type: att.fileType }
              );
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Messages deleted for you",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete messages",
    });
  }
};
