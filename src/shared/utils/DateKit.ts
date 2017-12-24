import moment from "moment";

export const getTimeDiff = (targetTime: moment.Moment, sourceTime?: moment.Moment) => {
    sourceTime = sourceTime || moment();
    const tail = targetTime < sourceTime ? " ago" : " after";
    const seconds = Math.abs(
        Number(((targetTime.valueOf() - sourceTime.valueOf() + 8 * 3600000) / 1000).toFixed(0))
    );

    if (seconds < 60) {
        return "just now";
    }

    if (seconds < 3600) {
        return Math.floor(seconds / 60).toString() + " minutes" + tail;
    }

    if (seconds < 3600 * 24) {
        return Math.floor(seconds / 3600).toString() + " hours" + tail;
    }

    if (seconds < 3600 * 24 * 30) {
        return Math.floor(seconds / (3600 * 24)).toString() + " days" + tail;
    }

    if (seconds < 3600 * 24 * 30 * 12) {
        return Math.floor(seconds / (3600 * 24 * 30)).toString() + " months" + tail;
    }

    return Math.floor(seconds / (3600 * 24 * 365)).toString() + " years" + tail;

    // return targetTime.format("YYYY-MM-DD");
};
