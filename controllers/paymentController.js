import paymentService from "../Services/paymentService";

export const getPaymentBreakdown = async (req, res) => {
  try {
    const filters = req.query; // e.g. ?startDate=2025-01-01&endDate=2025-01-31
    const result = await paymentService.getPaymentBreakdown(filters);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching payment breakdown:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
