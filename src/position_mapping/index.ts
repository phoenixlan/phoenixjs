import { ApiDeleteError } from "../errors/ApiDeleteError";
import { ApiPostError } from "../errors/ApiPostError";
import { getApiServer } from "../meta/api";
import { BasePosition } from "../position";
import { BaseUser, Oauth } from "../user";

export interface BasePositionMapping {
    uuid: string;
    created: number;
}

export type SimplePositionMapping = BasePositionMapping & {
    position_uuid: string;
    user_uuid: string;
    event_uuid: string;
}

export type PositionFacingPositionMapping = BasePositionMapping & {
    position: BasePosition;
    user_uuid: string;
    event_uuid: string;
}

export type UserFacingPositionMapping = BasePositionMapping & {
    position_uuid: string;
    user: BaseUser;
    event_uuid: string;
}

export const deletePositionMapping = async (position_mapping_uuid: string) => {
    const response = await fetch(`${getApiServer()}/position_mapping/${position_mapping_uuid}`, {
        method: 'DELETE',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiDeleteError('Unable to delete position mapping');
        }

        throw new ApiDeleteError(error);
    }

    return true;
}
export const createPositionMapping = async (user_uuid: string, position_uuid: string) => {
    const response = await fetch(`${getApiServer()}/position_mapping/`, {
        method: 'POST',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            user_uuid,
            position_uuid
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to create position mapping');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as SimplePositionMapping;
}