import { ApiGetError, ApiPostError, ApiPutError } from "../errors";
import { getApiServer } from "../meta";
import { BasicUser, Oauth } from "../user";
import { SimpleSeat, TicketSeat } from '../row';
import { Event } from '../events';
import { TicketType } from "../ticketType";

interface BaseTicket {
    ticket_id: number;
    created: number;
    ticket_type: TicketType,
    checked_in: number | null;
    seat: null | TicketSeat,
    payment_uuid: string,
    event: Event,
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

interface BaseTicketTransfer {
    uuid: string;
    reverted: boolean;
    created: number;
    expires: number;
    expired: boolean;
}

export type FullTicketTransfer = {
    from_user: BasicUser;
    to_user: BasicUser;
    ticket: FullTicket;
} & BaseTicketTransfer;

export const getTicket = async (ticket_id: number): Promise<FullTicket> => {
    const response = await fetch(`${getApiServer()}/ticket/${ticket_id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiGetError('Unable to get ticket');
        }

        throw new ApiGetError(error);
    }
    return await response.json() as FullTicket
}

export const transferTicket = async (ticket_id: number, userEmail: string) => {
    const response = await fetch(`${getApiServer()}/ticket/${ticket_id}/transfer`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            user_email: userEmail
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to transfer ticket');
        }

        throw new ApiPostError(error);
    }
}


export const revertTransfer = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/ticket_transfer/${uuid}/revert`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to revert transfer');
        }

        throw new ApiPostError(error);
    }
}

export const checkInTicket = async (ticket_id: number) => {
    const response = await fetch(`${getApiServer()}/ticket/${ticket_id}/check_in`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to check in ticket');
        }

        throw new ApiPostError(error);
    }
}
export const setTicketSeater = async (ticket_id: number, userEmail: string | undefined) => {
    const response = await fetch(`${getApiServer()}/ticket/${ticket_id}/seater`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            user_email: userEmail
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPutError('Unable to set seater');
        }

        throw new ApiPutError(error);
    }
}

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
