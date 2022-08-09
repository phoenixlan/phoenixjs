import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

interface TicketType{
    uuid: string,
    name: string,
    price: number,
    refundable: boolean,
    seatable: boolean,
    description: string
}

export const getTicketTypes = async () => {
    const response = await fetch(`${getApiServer()}/ticketType/`, {
        method: 'GET',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get ticket types');
    }

    return (await response.json()) as Array<TicketType>;
}