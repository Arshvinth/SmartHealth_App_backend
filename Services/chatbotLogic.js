import { getUserState, resetUserState } from "../utils/chatbotState";
import appointmentService from "./appointmentService";
import doctorService from "./doctorService";
import scheduleService from "./scheduleService";

export const chatbotLogic = async (message, patientName) => {

    const text = message.toLowerCase();
    const state = getUserState(patientName);


    if (text.includes("book") || text.includes("appointment")) {
        const doctorMatch = message.match(/dr\.?\s+\w+/i);
        if (!doctorMatch)
            return "Please mention the doctor's name (e.g. 'Book Dr. Silva').";

        const doctorName = doctorMatch[0].replace(/dr\.?\s+/i, "").trim();
        const doctor = await doctorService.findDoctorByName(doctorName);

        if (!doctor)
            return `Sorry, I couldn't find Dr. ${doctorName}.`;


        const chargeReccord = await doctorService.getDoctorHospitals(doctor._id);
        if (chargeReccord.length === 0)
            return `Dr. ${doctor.name} has no available hospitals.`;


        const hospitalList = chargeReccord.map(c =>
            `${c.hospitalId.name} (Doctor: Rs.${c.doctorCharge}, Hospital: Rs.${c.hospitalCharge})`
        ).join("\n");

        state.data.doctorId = doctor._id;
        state.data.doctorName = doctor.name;
        state.data.hospitals = chargeRecords;
        state.step = 1;

        return `Dr. ${doctor.name} is available at:\n${hospitalList}\n\nPlease type the hospital name you prefer.`;
    }

    if (state.step === 1) {
        const selected = state.data.hospitals.find(h =>
            h.hospitalId.name.toLowerCase() === text
        );
        if (!selected)
            return `Please choose a valid hospital: ${state.data.hospitals
                .map(h => h.hospitalId.name)
                .join(", ")}`;

        state.data.hospitalId = selected.hospitalId._id;
        state.data.hospitalName = selected.hospitalId.name;
        state.data.totalAmount = selected.hospitalCharge + selected.doctorCharge;
        state.step = 2;

        const schedules = await scheduleService.getSchedules(
            state.data.doctorId,
            state.data.hospitalId
        );

        if (!schedules.length)
            return `No schedules available for Dr. ${state.data.doctorName} at ${state.data.hospitalName}.`;

        const scheduleList = schedules
            .map(s => `${s.dayOfWeek} (${s.startTime} - ${s.endTime})`)
            .join("\n");

        state.data.schedules = schedules;

        return `Here are available schedules:\n${scheduleList}\n\nPlease type your preferred day (e.g. Monday).`;
    }

    if (state.step === 2) {

        const selectedSchedule = state.data.schedules.find(
            s => s.dayOfWeek.toLowerCase() === text
        );
        if (!selectedSchedule)
            return `Please choose a valid day from: ${state.data.schedules
                .map(s => s.dayOfWeek)
                .join(", ")}`;

        state.data.scheduleId = selectedSchedule._id;
        state.data.scheduleDay = selectedSchedule.dayOfWeek;
        state.step = 3;

        return "Nice! How would you like to pay — Card 💳 or Cash 💵?";

    }

    if (state.step === 3) {
        const method = text.includes("card") ? "Card" : "Cash";
        const patientId = "68efe6401c0f65de24140471";

        const { appointment } = await appointmentService.createAppointment({
            patientId,
            doctorId: state.data.doctorId,
            hospitalId: state.data.hospitalId,
            scheduleId: state.data.scheduleId,
            charges: state.data.totalAmount,

        });

        resetUserState(patientName);

        return method === "Card"
            ? `✅ Appointment confirmed with Dr. ${state.data.doctorName} at ${state.data.hospitalName} on ${state.data.scheduleDay}.\nPayment successful 💳.`
            : `🕒 Appointment pending with Dr. ${state.data.doctorName} at ${state.data.hospitalName} on ${state.data.scheduleDay}.\nPlease pay Rs.${state.data.totalAmount} at the hospital to confirm.`;
    }

    return "Hi 👋 I can help you book, view, or cancel appointments. Try 'Book Dr. Silva'.";

}