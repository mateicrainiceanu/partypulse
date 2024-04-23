import moment from "moment";

export function parseEventForView(data1: any) {
    const dur = `${Math.round(data1.duration)}:${Math.round((data1.duration % 1) * 60)}${Math.round((data1.duration % 1) * 60) < 10 ? "0" : ""
        }`;
    const duration = moment(dur, "HH:mm").format("HH:mm");
    const strDate = moment(data1.dateStart, "YYYY-MM-DDTHH:mm").format("YYYY-MM-DD");
    const strTime = moment(data1.dateStart, "YYYY-MM-DDTHH:mm").format("HH:mm");
    const privateev = data1.privateev !== 0;
    return { ...data1, duration: duration, date: strDate, time: strTime, privateev: privateev }
}