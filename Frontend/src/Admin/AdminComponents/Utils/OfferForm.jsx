import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaToggleOn } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { server_url } from "../../../App";
import { toast } from "react-toastify";

const initialForm = {
  couponCode: "",
  offerTitle: "",
  description: "",
  serviceId: [],
  discountType: "percentage",
  discountValue: "",
  minBookingAmount: "",
  maxDiscount: "",
  startDate: "",
  endDate: "",
  usageLimit: