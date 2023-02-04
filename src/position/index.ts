import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError, ApiPostError} from "../errors";
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

export const createPosition = async (name: string, description: string, crew_uuid?: string, team_uuid?: string) => {
    const response = await fetch(`${getApiServer()}/position/`, {
        method: 'POST',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            name,
            description,
            crew_uuid,
            team_uuid
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to create position');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as FullPosition;
}