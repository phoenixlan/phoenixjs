import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError, ApiPostError} from "../errors";

export interface EventBrand {
    uuid: string;
    name: string;
}

export const getEventBrands = async (): Promise<Array<EventBrand>> => {
    const response = await fetch(`${getApiServer()}/event_brand`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get event brands');
    }

    return (await response.json()) as Array<EventBrand>;
}

export const getEventBrand = async (uuid: string): Promise<EventBrand> => {
    const response = await fetch(`${getApiServer()}/event_brand/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get the event brand');
    }

    return (await response.json()) as EventBrand;
}

export const createEventBrand = async (name: string): Promise<EventBrand> => {
    const response = await fetch(`${getApiServer()}/event_brand`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            name
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to create event brand');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as EventBrand;
}
