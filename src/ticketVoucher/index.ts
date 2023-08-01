import { TicketType } from "../ticketType";
import { ApiGetError, ApiPostError, ApiPutError } from "../errors";
import { getApiServer } from "../meta";
import { BasicUser, Oauth } from "../user";
import { Event } from '../events';
import { BasicTicket } from "../ticket"

interface BaseTicketVoucher {
    uuid: string;

    created: number;
    used?: number;
    is_expired: boolean;
    is_used: boolean;
}

export type BasicTicketVoucher = BaseTicketVoucher & {
    recipient_user: BasicUser;
    ticket_type: TicketType;
    last_use_event: Event;

    ticket?: BasicTicket;
}

export const createTicketVoucher = async (recipient_user_uuid: string, ticket_type_uuid: string, last_use_event_uuid: string) => {
    const response = await fetch(`${getApiServer()}/ticket_voucher`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            recipient_user_uuid,
            ticket_type_uuid,
            last_use_event_uuid
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to create ticket voucher');
        }

        throw new ApiPostError(error);
    }
    return await response.json() as BasicTicketVoucher
}

export const burnTicketVoucher = async (ticket_voucher_uuid: string) => {
    const response = await fetch(`${getApiServer()}/ticket_voucher/${ticket_voucher_uuid}/burn`, {
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
            throw new ApiPostError('Unable to use ticket voucher');
        }
        throw new ApiPostError(error);
    }
    return true
}

export const getAllTicketVouchers = async (): Promise<Array<BasicTicketVoucher>> => {
	const response = await fetch(`${getApiServer()}/ticket_voucher`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get all ticket vouchers");
	}

	return (await response.json()) as Array<BasicTicketVoucher>;
};