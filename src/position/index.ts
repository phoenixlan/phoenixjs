import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";
import { SimplePositionMapping, UserFacingPositionMapping } from "../position_mapping";

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
    position_mappings: Array<SimplePositionMapping>,
} & BasePosition

export type FullPosition = {
    position_mappings: Array<UserFacingPositionMapping>,
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