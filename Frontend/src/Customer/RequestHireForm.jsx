import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { calculateVisitingCharge } from "../utils/calculateVsitingCharge";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";

import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTools,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInfoCircle,
  FaMicrophone