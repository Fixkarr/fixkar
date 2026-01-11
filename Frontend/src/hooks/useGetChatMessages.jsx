import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { server_url } from "../App";
import { setChatMessages } from "../redux/chatMessages.slice";

const useGetMyMessages = (otherUserId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!otherUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${server_url}/api/messages/get-messages/${otherUserId}`,
          { withCredentials: true }
        );

        dispatch(setChatMessages(res.data.messages));
      } catch (error) {
        
      }
    };

    fetchMessages();
  }, [otherUserId, dispatch]);
};

export default useGetMyMessages;
