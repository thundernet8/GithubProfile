import * as moment from "moment";

const ConsoleWrapper = {
    log: (...args) => {
        console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`, ...args);
    },

    error: (...args) => {
        console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`);
        console.error(...args);
    }
};

export default ConsoleWrapper;
