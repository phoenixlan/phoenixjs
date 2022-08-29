import { ApiPostError, ApiPutError } from "../errors";
import { getApiServer } from "../meta";
import { BasicUser, Oauth } from "../user";
import { SimpleSeat, TicketSeat } from '../row';
import { TicketType } from "../ticketType";

interface BaseTicket {
    ticket_id: number;
    created: number;
    ticket_type: TicketType,
    seat: null | TicketSeat,
    event_uuid: string,
    payment_uuid: string,
}

export type BasicTicket = {
    buyer_uuid: string,
    owner_uuid: string,
    seater_uuid: string,
} & BaseTicket;

export type FullTicket = {
    buyer: BasicUser,
    owner: BasicUser,
    seater?: BasicUser,
} & BaseTicket;

export const seatTicket = async (ticket_id: number, seatUuid: string) => {
    const response = await fetch(`${getApiServer()}/ticket/${ticket_id}/seat`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            seat_uuid: seatUuid
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to seat ticket');
        }

        throw new ApiPutError(error);
    }
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
