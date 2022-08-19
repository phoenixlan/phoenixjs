import { ApiPostError } from "../errors";
import { getApiServer } from "../meta";
import { Oauth } from "../user";
import { SimpleSeat } from '../row';
import { TicketType } from "../ticketType";

export interface BasicTicket {
    buyer_uuid: string,
    created: number,
    owner_uuid: string,
    payment_uuid: string,
    event_uuid: string,
    seat: null | SimpleSeat,
    seater_uuid: string,
    ticket_type: TicketType,
    ticket_id: number
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
