import paymentModel from "../models/paymentModel";
import appointmentService from "./appointmentService";

class PaymentService {

    async makePayment(appointmentId, totalAmount, method) {

        const currentDate = new Date();

        const paymentDate = currentDate.toISOString().split('T')[0];

        const payment = new paymentModel({
            appointmentId,
            totalAmount,
            paymentStatus: "Pending",
            method,
            paymentDate
        });

        payment.paymentStatus = "Paid";

        await payment.save();

        await appointmentService.markAsCompleted(appointmentId);

        return payment;

    };



};

export default new PaymentService();