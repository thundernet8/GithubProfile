export const isEmail = (email: string) => {
    email = email ? email.toString() : "";
    let reg = new RegExp(/[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/);
    return reg.test(email);
};

export const isNumberic = (str: string) => {
    return str != null && str !== "" && !isNaN(str as any);
};

export const isIntNumberic = (str: string) => {
    return str != null && str.match(/[0-9]+/);
};

export const lowerCaseFirst = (str: string) => {
    if (!str) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
};
