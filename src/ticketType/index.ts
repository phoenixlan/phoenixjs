import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError, ApiPostError} from "../errors";

export interface TicketType {
    uuid: string;
    event_brand_uuid: string;
    name: string;
    price: number;
    refundable: boolean;
    seatable: boolean;
    grants_admission: boolean;
    description: string | null;
    grants_membership: boolean;
    requires_membership: boolean;
    transferable: boolean;
}

export const getTicketTypes = async () => {
    const response = await fetch(`${getApiServer()}/ticketType/`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get ticket types');
    }

    return (await response.json()) as Array<TicketType>;
}

export interface NewTicketType {
    name: string;
    price: number;
    description: string;
    refundable: boolean;
    seatable: boolean;
    grants_admission: boolean;
    requires_membership?: boolean;
    grants_membership?: boolean;
    transferable?: boolean;
}

export const createTicketType = async (event_brand_uuid: string, ticketType: NewTicketType) => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/ticket_type`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify(ticketType)
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to create ticket type');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as TicketType;
}