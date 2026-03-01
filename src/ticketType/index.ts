import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

export interface TicketType {
    uuid: string;
    name: string;
    price: number;
    refundable: boolean;
    seatable: boolean;
    grants_admission: boolean;
    description: string | null;
    grants_membership: boolean;
    requires_membership: boolean;
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