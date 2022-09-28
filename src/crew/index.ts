import * as Applications from './applications';
import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";
import { FullPosition } from '../position';

export interface Team {
    uuid: string,
    name: string,
    description: string,
    crew: string,
}

export interface BaseCrew {
    uuid: string,
    name: string,
    description: string,
    application_prompt: string|null,
    active: boolean,
    is_applyable: boolean,
    hex_color: string,
}

export type FullCrew = {
    teams: Array<Team>,
    positions: Array<FullPosition>
} & BaseCrew

export const getCrews = async (): Promise<Array<BaseCrew>> => {
    const response = await fetch(`${getApiServer()}/crew/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get crews');
    }

    return (await response.json()) as Array<BaseCrew>;
};

export const getCrew = async (uuid: string): Promise<FullCrew> => {
    const response = await fetch(`${getApiServer()}/crew/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError(`Unable to get crew: ${uuid}`);
    }

    return (await response.json()) as FullCrew
};

export { Applications }