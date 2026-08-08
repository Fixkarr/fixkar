import CustomerInfo from "./CustomerInfo";
import ServiceInfo from "./ServiceInfo";
import AddressInfo from "./AddressInfo";
import ActionButtons from "./ActionButtons";
import { useSelector } from "react-redux";
import PricingInfo from "./PricingInfo";


const IncomingBooking = ({request}) => {
       console.log(request)
    return (
        <section className="container-fluid bg-light min-vh-100 py-3 py-md-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                    <div className="card border-0 shadow rounded-4 overflow-hidden">
                        <span className="badge text-bg-danger rounded-pill">
                            New Request
                        </span>
                        <div className="card-body p-3 p-md-4">
                            <CustomerInfo request={request} />
                            <ServiceInfo request={request} />
                            <AddressInfo request={request} />
                            <PricingInfo request={request}/>
                           
                            <ActionButtons request={request} />

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IncomingBooking;