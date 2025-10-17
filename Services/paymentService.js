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

    // Method for payment breakdown
    async getPaymentBreakdown(filters = {}) {
        const matchStage = {};

        // Optional filtering (by date range, department, etc.)
        if (filters.startDate && filters.endDate) {
            matchStage.paymentDate = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }

        if (filters.department && filters.department !== "All") {
            // Assuming Appointment or Doctor references department
            matchStage.department = filters.department;
        }

        // Aggregate payments grouped by paymentMethod
        const breakdown = await paymentModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$paymentMethod",
                    totalAmount: { $sum: "$totalAmount" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    amount: "$totalAmount",
                    count: 1,
                },
            },
            {
                $sort: { amount: -1 },
            },
        ]);

        return breakdown;
    }

};

export default new PaymentService();