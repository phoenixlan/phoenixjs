import { ApiPostError } from "../errors";
import { getApiServer } from "../meta";
import { Oauth } from "../user";

export interface Ticket {
    uuid: string;
}

export const createTicket = async (recipient: string, ticketType: string) => {
    const response = await fetch(`${getApiServer()}/ticket`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            recipient,
            ticket_type: ticketType
        })
    });

    if (!response.ok) {
        throw new ApiPostError('Unable to create ticket');
    }
    return true;
}