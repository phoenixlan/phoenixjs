import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiDeleteError, ApiGetError, ApiPatchError, ApiPostError} from "../errors";
import { BasicUser } from "../user";

export type CardOrderState = 'CREATED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';

export interface CardOrder {
    uuid: string;
    event_uuid: string;
    subject_user: BasicUser;
    creator_user: BasicUser;
    updated_by_user: BasicUser | null;
    last_updated: number;
    created: number;
    state: CardOrderState;
}

export const createCardOrder = async (event_uuid: string, user_uuid: string): Promise<CardOrder> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/card_order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            user_uuid
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to create card order');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as CardOrder;
}

export const getEventCardOrders = async (event_uuid: string): Promise<Array<CardOrder>> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/card_orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get card orders');
    }

    return (await response.json()) as Array<CardOrder>;
}

export const getCardOrder = async (uuid: string): Promise<CardOrder> => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get card order');
    }

    return (await response.json()) as CardOrder;
}

export const generateCardOrder = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}/generate`, {
        method: 'PATCH',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    return response;
}

export const finishCardOrder = async (uuid: string): Promise<CardOrder> => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}/finish`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPatchError('Unable to finish card order');
        }

        throw new ApiPatchError(error);
    }

    return (await response.json()) as CardOrder;
}

export const cancelCardOrder = async (uuid: string): Promise<CardOrder> => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}/cancel`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiDeleteError('Unable to cancel card order');
        }

        throw new ApiDeleteError(error);
    }

    return (await response.json()) as CardOrder;
}
