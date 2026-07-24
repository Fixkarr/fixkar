import axios from "axios";

export const sendWhatsAppMessage = async (phone, customerName, address, bookingId) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
         name: "new_booking",
          language: {
            code: "en",
          },
          components : [
            { type: "body",
                  parameters: [
                     {
                  type: "text",
                  text: customerName,
                },
                {
                  type: "text",
                  text: address,
                },
                 {
                  type: "text",
                  text: bookingId,
                },
                
                  ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                {
                  type: "text",
                  text: bookingId,
                },
              ],
            },

          ]
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (error) { 
    console.log(error.response?.data || error.message);
  }
};