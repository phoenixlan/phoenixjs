import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";
import { BasicUserWithPositions } from "../user";

export interface BasePosition {
    uuid: string,
    crew_uuid?: string,
    team_uuid?: string,
    name?: string,
    description?: string,
    chief: boolean,
    permissions: Array<Permission>,
}

export interface Permission {
    uuid: string,
    event_uuid?: string,
    permission: string,
}

export type BasicPosition = {
    users: Array<string>,
} & BasePosition

export type FullPosition = {
    users: Array<BasicUserWithPositions>,
} & BasePosition

export const getPosition = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/position/${uuid}`, {
        method: 'GET',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get position');
    }

    return (await response.json()) as FullPosition;
}

export const getPositions = async () => {
    const response = await fetch(`${getApiServer()}/position/`, {
        method: 'GET',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get positions');
    }

    return (await response.json()) as Array<BasicPosition>;
}