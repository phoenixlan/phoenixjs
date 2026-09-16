import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import * as Statistics from "./statistics";
import {ApiGetError, ApiPostError, ApiPutError} from "../errors";
import { BasicPosition } from "../position";
import { BaseCrew, FullCrew } from "../crew";

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

export const getPositions = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/event_brand/${uuid}/positions`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get positions');
    }

    return (await response.json()) as Array<BasicPosition>;
}

export const getCrews = async (uuid: string): Promise<Array<BaseCrew>> => {
    const response = await fetch(`${getApiServer()}/event_brand/${uuid}/crews/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get crews');
    }

    return (await response.json()) as Array<BaseCrew>;
};

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

export const createCrew = async (name: string, description: string, hex_color: string, event_brand_uuid: string): Promise<EventBrand> => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/crew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            name,
            description,
            hex_color
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPutError('Unable to create crew');
        }

        throw new ApiPutError(error);
    }

    return (await response.json()) as FullCrew;
}


export { Statistics }
