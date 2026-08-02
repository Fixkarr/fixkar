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
  ],
  deleteFor: { $ne: senderId } 
}).sort({ createdAt: 1 }).populate({path: "replyTo", select: "message attachments sender"});

await Message.updateMany(
  {
    sender: recieverId,
    reciever: senderId,
    status: "sent"
  },
  {
    status: "delivered",
    deliveredAt: new Date()
  }
);

// 🔹 DELIVERED → SEEN
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

  const senderSocketId = userSocketMap[recieverId];
if (senderSocketId) {
  io.to(senderSocketId).emit("messagesDelivered", {
    deliveredTo: senderId
  });
}

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
    const { message , replyTo} = req.body;
    const { recieverId } = req.params;
    const senderId = req.userId;

    let attachmentsArray = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        // allow only image & video
        if (
          !file.mimetype.startsWith("image/") &&
          !file.mimetype.startsWith("video/")&&
          !file.mimetype.startsWith("audio/")
        ) {
          return res.status(400).json({
            message: "Only image, video and audio files are allowed",
          });
        }

         let resourceType = "image";
    let folder = "chat_attachments/images";
    let fileType = "image";

    if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "chat_attachments/videos";
      fileType = "video";
    }

    if (file.mimetype.startsWith("audio/")) {
      resourceType = "video"; // cloudinary rule
      folder = "chat_attachments/audios";
      fileType = "audio";
    }

        const uploadResult = await uploadToCloudinary(
          file,
          folder,
          resourceType
        );

        attachmentsArray.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          fileType: fileType,
        });
      }
    }

    if (!message && attachmentsArray.length === 0) {
      return res.status(400).json({
        message: "Message or attachment required",
      });
    }
    // A user can have multiple tabs/devices. The Socket.IO room is the source
    // of truth; the old single socket-id map can become stale after reconnects.
    const receiverRoom = recieverId.toString();
    const senderRoom = senderId.toString();
    const isReceiverOnline = Boolean(io.sockets.adapter.rooms.get(receiverRoom)?.size);

    let newMessage = await Message.create({
      sender: senderId,
      reciever: recieverId,
      message: message || "",
      attachments: attachmentsArray,
        replyTo: replyTo || null,
        status: isReceiverOnline ? "delivered" : "sent",
        deliveredAt: isReceiverOnline ? new Date() : null,
    });

    newMessage = await newMessage.populate({
      path: "replyTo",
      select: "message attachments sender",
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
    const hasAudio = attachmentsArray.some(
        (att) => att.fileType === "audio"
      );

  const hasVideo = attachmentsArray.some(
    (att) => att.fileType === "video"
  );

   if (hasAudio) {
        notificationMessage = "🎤 Voice message";
      } else if (hasVideo) {
        notificationMessage = "🎥 Video";
      } else if (attachmentsArray.length === 1) {
        notificationMessage = "📷 Photo";
      } else {
        notificationMessage = "📎 Media";
      }
    }


    await pushNotification({
    userId: recieverId,
    title: "New message",
    message: notificationMessage,
    redirectUrl: '/',
  });


    // emit message via socket
    // Emit to user rooms so every active tab/device receives the update.
    io.to(receiverRoom).emit("newMessage", newMessage);
    io.to(senderRoom).emit("newMessage", newMessage);

    if (isReceiverOnline) {
      io.to(senderRoom).emit("messageDelivered", {
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

    // 🔹 sirf non-deleted messages
    const messages = await Message.find({
      $or: [{ sender: myId }, { reciever: myId }],
      deleteFor: { $ne: myId }
    })
      .sort({ createdAt: -1 })
      .populate("sender", "fullName profilePicture")
      .populate("reciever", "fullName profilePicture");

    const conversationsMap = {};

    for (const msg of messages) {
      const otherUser =
        msg.sender._id.toString() === myId
          ? msg.reciever
          : msg.sender;

      // 🔁 agar conversation already added hai → skip
      if (conversationsMap[otherUser._id]) continue;

      // 🟢 last message preview (WhatsApp-style)
      let lastMessagePreview = "";

      if (msg.message && msg.message.trim() !== "") {
        lastMessagePreview =
          msg.message.length > 50
            ? msg.message.substring(0, 50) + "..."
            : msg.message;
      } else if (msg.attachments?.length) {
        const hasVideo = msg.attachments.some(
          (a) => a.fileType === "video"
        );
        lastMessagePreview = hasVideo ? "🎥 Video" : "📷 Photo";
      }

      // 🟢 accurate unseen count (DB se)
      const unseenCount = await Message.countDocuments({
        sender: otherUser._id,
        reciever: myId,
        status: { $ne: "seen" },
        deleteFor: { $ne: myId }
      });

      conversationsMap[otherUser._id] = {
        user: otherUser,
        lastMessage: lastMessagePreview,
        lastMessageTime: msg.createdAt,
        unseenCount
      };
    }

    res.status(200).json({
      conversations: Object.values(conversationsMap)
    });

  } catch (error) {
    console.error(error);
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
  _id: { $in: messageIds },
  $or: [
    { sender: myId },
    { reciever: myId }
  ]
});

if (messages.length === 0) {
  return res.status(403).json({
    message: "Not authorized to delete these messages"
  });
}

    for (let msg of messages) {

      // already deleted by me?
      if (msg.deleteFor.includes(myId)) continue;

      // add myId to deletedFor
      msg.deleteFor.push(myId);
      await msg.save();


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
    await Message.deleteOne({ _id: msg._id });
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
