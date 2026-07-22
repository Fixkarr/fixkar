import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server_url } from "../App";

export default function ShortLinkRedirect() {
    const { shortCode } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        axios.get(`${server_url}/api/s/${shortCode}`)
            .then(res => {
                navigate(res.data.slug, {
                    replace: true
                });
            });

    }, [shortCode, navigate]);

    return <h3>Redirecting...</h3>;
}