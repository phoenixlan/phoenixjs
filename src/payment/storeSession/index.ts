/*
 * @created 31/05/2021 - 15:43
 * @project phoenixjs-1.0
 * @author andreasjj
 */

import {getApiServer} from "../../meta";
import * as Oauth from "../../user/oauth";
import {ApiGetError, ApiPutError} from "../../errors";
import {TicketType} from "../../ticketType";

export interface Cart {
    cart: Array<{
        uuid: string,
        qty: number,
    }>
}

export interface CartEntry {
    amount: number,
    store_session_uuid: string,
    ticket_type: TicketType,
}

export interface StoreSession {
    created: number,
    entries: Array<CartEntry>,
    expires: number,
    total: number,
    user_uuid: string,
    uuid: string,
}

export const getActiveStoreSessions = async () => {
    const response = await fetch(`${getApiServer()}/store_session/active`, {
        method: 'GET',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get active store sessions');
    }

    return (await response.json()) as Array<StoreSession>;
}

export const createStoreSession = async (data: Cart) => {
    const response = await fetch(`${getApiServer()}/store_session`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify(data)
    });

    if(response.status !== 200) {
        throw new ApiPutError("Unable to create store session");
    }

    return await response.json() as StoreSession;
}