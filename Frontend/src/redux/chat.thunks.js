import { useDispatch } from "react-redux";
import { server_url } from "../App";
import axios from 'axios'

export const fetchMyConversations = () => async (dispatch) => {
    const dispatch = useDispatch();
  const res = await axios.get(
    `${server_url}/api/messages/get-my-conversations`,
    { withCredentials: true }
  );

  dispatch(setConversations(res.data.conversations));
};