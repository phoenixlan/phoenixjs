import * as Applications from './applications';
import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";
import {User} from "../user";

export interface Team {
    uuid: string,
    name: string,
    description: string,
    crew: string,
}

export interface Permission {
    uuid: string,
    event_uuid?: string,
    permission: string,
}

export interface BasePosition {
    uuid: string,
    crew?: string,
    team?: string,
    name?: string,
    description?: string,
    chief: boolean,
    permissions: Array<Permission>,
}

export type BasicPosition = {
    users: Array<string>,
} & BasePosition

export type FullPosition = {
    users: Array<User>,
} & BasePosition

export interface Crew {
    uuid: string,
    name: string,
    description: string,
    active: boolean,
    is_applyable: boolean,
    hex_color: string,
    teams: Array<Team>,
}

export const getCrews = async (): Promise<Array<Crew & {positions: Array<BasicPosition>}>> => {
    const response = await fetch(`${getApiServer()}/crew/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Infected-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get crews');
    }

    return (await response.json()) as Array<Crew & {positions: Array<BasicPosition>}>;
};

export const getCrew = async (uuid: string): Promise<Crew & {positions: Array<FullPosition>}> => {
    const response = await fetch(`${getApiServer()}/crew/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Infected-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError(`Unable to get crew: ${uuid}`);
    }

    return (await response.json()) as Crew & {positions: Array<FullPosition>}
};

export { Applications }