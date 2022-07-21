import {getApiServer} from "../meta";
import {ApiGetError} from "../errors";

export const getTosRules = async (): Promise<string> => {
    const response = await fetch(`${getApiServer()}/static/tos/rules.md`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError(`Unable to get TOS rules`);
    }

    return (await response.text()) as string;
};

export const getTosPayment = async (): Promise<string> => {
    const response = await fetch(`${getApiServer()}/static/tos/payment.md`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError(`Unable to get TOS payment`);
    }

    return (await response.text()) as string;
};