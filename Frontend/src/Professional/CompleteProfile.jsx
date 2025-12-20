
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/customerhome.css";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "../redux/user.slice";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

// export default function CompleteProfile() {
//   const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const [loading, setLoading] = useState(false)
//   const formik = useFormik({
//     initialValues: {
//       description: "",
//       pricingType: "multiple",
//       hourly: "",
//       daily: "",
//       contractMin: "",
//       contractMax: "",
//       amountDesc: "",
//     },

//     validationSchema: Yup.object({
//       description: Yup.string()
//         .min(20, "Description must be at least 20 characters.")
//         .required("Description is required."),

//       hourly: Yup.number()
//         .nullable()
//         .min(0, "Hourly rate must be a positive number."),
//       daily: Yup.number()
//         .nullable()
//         .min(0, "Daily rate must be a positive number."),
//       contractMin: Yup.number()
//         .nullable()
//         .min(0, "Contract min must be a positive number."),
//       contractMax: Yup.number()
//         .nullable()
//         .min(0, "Contract max must be a positive number.")
//         .when("contractMin", (contractMin, schema) => {
//           if (contractMin) {
//             return schema.min(
//               contractMin,
//               "Max price must be greater than or equal to min price."
//             );
//           }
//           return schema;
//         }),
//     }),

//     onSubmit: async (values, {resetForm}) => {
//       const payload = {
//         description: values.description,
//         amountDesc: values.amountDesc,
//           pricingType: values.pricingType,
//           hourly: values.hourly ? { amount: Number(values.hourly) } : undefined,
//           daily: values.daily ? { amount: Number(values.daily) } : undefined,
//           contract:
//             values.contractMin || values.contractMax
//               ? {
//                   minPrice: Number(values.contractMin),
//                   maxPrice: Number(values.contractMax),
//                 }
//               : undefined,
//       };

//       try {
//         setLoading(true)
//         const result = await axios.post(`${server_url}/api/user/professional/complete-profile`, payload , {withCredentials : true})
//         dispatch(setCurrentUserData(result.data))
//         navigate("/")
//         setLoading(false)
//       } catch (error) {
//         console.log("Error in complete Profile",error)
//         setLoading(false)
//       }

//       resetForm()
//     },
//   });

//   return (
//     <div className="p-2 completeProfile">
//       <div className="bg-white rounded-2xl p-6">
//         <h2 className="text-xl font-semibold mb-3 welcome text-primary">
//           <span onClick={()=>navigate("/")}><IoMdArrowRoundBack /></span> <br />
//           Complete Your Profile
//         </h2>
//              <p className="text-sm text-gray-600">Provide your details to make your profile more attractive to customers.</p>
//         <form onSubmit={formik.handleSubmit} className="space-y-5">

//           {/* DESCRIPTION */}
//           <div>
//             <label className="block text-sm font-medium mb-1 fs-5 text-primary">
//               Tell customers about you!
//             </label>
//             <textarea
//               rows={4}
//               className="w-full border rounded-lg p-2 text-sm"
//               {...formik.getFieldProps("description")}
//               placeholder="Describe your experience, skills and services..."
//             />
//             {formik.touched.description && formik.errors.description && (
//               <p className="text-danger small">{formik.errors.description}</p>
//             )}
//           </div>

//           {/* PRICING TYPE */}
//           <div className="w-full d-flex flex-column">
//             <label className="block text-sm font-medium mb-1 fs-5 text-primary">
//               Select Pricing Method
//             </label>
//             <select
//               className="w-full border rounded-lg p-2 text-sm"
//               {...formik.getFieldProps("pricingType")}
//             >
//               <option value="hourly">Hourly</option>
//               <option value="daily">Daily</option>
//               <option value="contract">Contract Based</option>
//               <option value="multiple">Multiple</option>
//             </select>
//           </div>

//           {/* HOURLY */}
//           {(formik.values.pricingType === "hourly" ||
//             formik.values.pricingType === "multiple") && (
//             <div className="w-full d-flex flex-column">
//               <label className="block text-sm font-medium mb-1">
//                 Hourly Rate (₹)
//               </label>
//               <input
//                 type="number"
//                 className="w-full border rounded-lg p-2 text-sm"
//                 {...formik.getFieldProps("hourly")}
//                 placeholder="e.g. 200"
//               />
//             </div>
//           )}
//            {formik.touched.hourly && formik.errors.hourly && (
//               <p className="text-danger small">{formik.errors.hourly}</p>
//             )}

//           {/* DAILY */}
//           {(formik.values.pricingType === "daily" ||
//             formik.values.pricingType === "multiple") && (
//             <div className="w-full d-flex flex-column">
//               <label className="block text-sm font-medium mb-1">
//                 Daily Rate (₹)
//               </label>
//               <input
//                 type="number"
//                 className="w-full border rounded-lg p-2 text-sm"
//                 {...formik.getFieldProps("daily")}
//                 placeholder="e.g. 1500"
//               />
//                {formik.touched.daily && formik.errors.daily && (
//               <p className="text-danger small">{formik.errors.daily}</p>
//             )}
//             </div>
//           )}
            
//           {/* CONTRACT */}
//           {(formik.values.pricingType === "contract" ||
//             formik.values.pricingType === "multiple") && (
//             <div>
//                  <label className="block text-sm font-medium mb-1">
//                 Contract Rate (₹)
//               </label>
//                 <div className="d-flex gap-3">
//               <input
//                 type="number"
//                 className="w-full border rounded-lg p-2 text-sm"
//                 {...formik.getFieldProps("contractMin")}
//                 placeholder="Min (₹)"
//               />
              
//               <input
//                 type="number"
//                 className="w-full border rounded-lg p-2 text-sm"
//                 {...formik.getFieldProps("contractMax")}
//                 placeholder="Max (₹)"
//               />
              
//             </div>
//              {formik.touched.contractMin && formik.errors.contractMin && (
//               <p className="text-danger small">{formik.errors.contractMin}</p>
//             )}
//              {formik.touched.contractMax && formik.errors.contractMax && (
//               <p className="text-danger small">{formik.errors.contractMax}</p>
//             )}
//             </div>
//           )}

//           {/* AMOUNT DESCRIPTION */}
//           <div>
//             <label className="block text-sm font-medium mb-1 fs-5 text-primary">
//               About your pricing
//             </label>
//             <textarea
//               rows={3}
//               className="w-full border rounded-lg p-2 text-sm"
//               {...formik.getFieldProps("amountDesc")}
//               placeholder="Please describe the method you use to charge your customers."
//             />
//           </div>

//           <button type="submit" disabled={loading} className="btn btn-primary rounded-pill w-100 py-2 mt-3">
//            { loading ? (<ClipLoader size={20}/>):("Save")}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      description: "",
      pricingType: "multiple",
      hourly: "",
      daily: "",
      contractMin: "",
      contractMax: "",
      amountDesc: "",
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .min(20, "Description must be at least 20 characters.")
        .required("Description is required."),
      hourly: Yup.number().nullable().min(0),
      daily: Yup.number().nullable().min(0),
      contractMin: Yup.number().nullable().min(0),
      contractMax: Yup.number()
        .nullable()
        .min(0)
        .when("contractMin", (contractMin, schema) =>
          contractMin
            ? schema.min(contractMin, "Max must be ≥ Min")
            : schema
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        description: values.description,
        amountDesc: values.amountDesc,
        pricingType: values.pricingType,
        hourly: values.hourly ? { amount: Number(values.hourly) } : undefined,
        daily: values.daily ? { amount: Number(values.daily) } : undefined,
        contract:
          values.contractMin || values.contractMax
            ? {
                minPrice: Number(values.contractMin),
                maxPrice: Number(values.contractMax),
              }
            : undefined,
      };

      try {
        setLoading(true);
        const result = await axios.post(
          `${server_url}/api/user/professional/complete-profile`,
          payload,
          { withCredentials: true }
        );
        dispatch(setCurrentUserData(result.data));
        navigate("/");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
      resetForm();
    },
  });

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="text-primary mb-1">
                <IoMdArrowRoundBack
                  role="button"
                  className="me-2"
                  onClick={() => navigate("/")}
                />
                Complete Your Profile
              </h4>
              <p className="text-muted mb-4">
                Provide details to attract more customers
              </p>

              <form onSubmit={formik.handleSubmit}>
                {/* DESCRIPTION */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tell customers about you
                  </label>
                  <textarea
                    rows="4"
                    className={`form-control ${
                      formik.touched.description && formik.errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("description")}
                  />
                  <div className="invalid-feedback">
                    {formik.errors.description}
                  </div>
                </div>

                {/* PRICING TYPE */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Pricing Method
                  </label>
                  <select
                    className="form-select"
                    {...formik.getFieldProps("pricingType")}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="contract">Contract</option>
                    <option value="multiple">Multiple</option>
                  </select>
                </div>

                {/* HOURLY */}
                {(formik.values.pricingType === "hourly" ||
                  formik.values.pricingType === "multiple") && (
                  <div className="mb-3">
                    <label className="form-label">Hourly Rate (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      {...formik.getFieldProps("hourly")}
                    />
                    {formik.touched.hourly && formik.errors.hourly && (
                      <small className="text-danger">
                        {formik.errors.hourly}
                      </small>
                    )}
                  </div>
                )}

                {/* DAILY */}
                {(formik.values.pricingType === "daily" ||
                  formik.values.pricingType === "multiple") && (
                  <div className="mb-3">
                    <label className="form-label">Daily Rate (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      {...formik.getFieldProps("daily")}
                    />
                  </div>
                )}

                {/* CONTRACT */}
                {(formik.values.pricingType === "contract" ||
                  formik.values.pricingType === "multiple") && (
                  <div className="mb-3">
                    <label className="form-label">Contract Rate (₹)</label>
                    <div className="row g-2">
                      <div className="col">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Min"
                          {...formik.getFieldProps("contractMin")}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Max"
                          {...formik.getFieldProps("contractMax")}
                        />
                      </div>
                    </div>
                    {(formik.errors.contractMin ||
                      formik.errors.contractMax) && (
                      <small className="text-danger">
                        {formik.errors.contractMin ||
                          formik.errors.contractMax}
                      </small>
                    )}
                  </div>
                )}

                {/* AMOUNT DESC */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    About your pricing
                  </label>
                  <textarea
                    rows="3"
                    className="form-control"
                    {...formik.getFieldProps("amountDesc")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 rounded-pill py-2"
                >
                  {loading ? <ClipLoader size={20} /> : "Save Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
