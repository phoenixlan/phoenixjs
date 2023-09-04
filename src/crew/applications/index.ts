import {getApiServer} from "../../meta";
import {BasicUser, FullUser} from "../../user";
import * as Oauth from "../../user/oauth";
import {ApiGetError, ApiPatchError, ApiPutError, ApiParameterError} from "../../errors";
import { BaseCrew } from '../'
import { Event } from "../../events"

enum ApplicationState {
    created = 1,
    accepted = 2,
    rejected = 3
}

export interface ApplicationCrewMapping {
    uuid: string;
    application_uuid: string;
    list_order: number;
    crew: BaseCrew;
    created: number;
    accepted: boolean;
}

export interface BaseApplication {
    uuid: string,
    crews: Array<ApplicationCrewMapping>,
    event: Event,
    contents: string,
    created: number,
    /* this doesnt exist yet */
    state: string,
    answer?: string
}

export type BasicApplication = BaseApplication & {
    user: BasicUser,
}
export type ApplicationWithFullUser = BaseApplication & {
    user: FullUser,
}

export const getAllApplications = async (): Promise<Array<BasicApplication>> => {
    const response = await fetch(`${getApiServer()}/application`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get applications');
    }

    return (await response.json()) as Array<BasicApplication>;
};

export const getApplication = async (uuid: string): Promise<BasicApplication> => {
    if (!uuid) {
        throw new ApiParameterError('uuid cannot be null');
    }
    const response = await fetch(`${getApiServer()}/application/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get applications');
    }

    return (await response.json()) as BasicApplication;
};

// Scream test
/*
export const getAllApplicationsByEvent = async (event: Event): Promise<Array<BasicApplication>> => {
    if (!event) {
        throw new ApiParameterError('Event cannot be null');
    }
    const response = await fetch(`${getApiServer()}/event/${event.uuid}/applications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get applications');
    }

    return (await response.json()) as Array<BasicApplication>;
};
*/

export const getUserApplications = async (): Promise<Array<BasicApplication>> => {
    const response = await fetch(`${getApiServer()}/application/my`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get applications');
    }

    return (await response.json()) as Array<BasicApplication>;
};

export const createApplication = async (crews: Array<string>, contents: string): Promise<BasicApplication> => {
    const response = await fetch(`${getApiServer()}/application`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            crews,
            contents,
        })
    })

    if(!response.ok) {
        let error = ""
        try {
            error = (await response.json() as { error: string }).error;
        } catch (e) {
            throw new ApiPutError('Unable to create application: ' + e);
        }
        throw new ApiPutError(error);
    }

    return (await response.json()) as BasicApplication;
}

export const answerApplication = async (uuid: string, crew_uuid: string, answer: string, state: ApplicationState.accepted|ApplicationState.rejected): Promise<void> => {
    if (!uuid) {
        throw new ApiParameterError('uuid cannot be null');
    }
    if(!answer) {
        throw new ApiParameterError('Answer cannot be null')
    }
    if(!crew_uuid && state == ApplicationState.accepted) {
        throw new ApiParameterError('Selected crew cannot be null')
    }
    const response = await fetch(`${getApiServer()}/application/${uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            answer,
            crew_uuid,
            state: state === ApplicationState.accepted ? "accepted" : "rejected"
        })
    });

    if (response.status !== 200) {
        throw new ApiPatchError('Unable to answer application');
    }
};

export const hideApplication = async (uuid: string): Promise<void> => {
    if (!uuid) {
        throw new ApiParameterError('uuid cannot be null');
    }
    const response = await fetch(`${getApiServer()}/application/${uuid}/hide`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if(!response.ok) {
        let error = ""
        try {
            error = (await response.json() as { error: string }).error;
        } catch (e) {
            throw new ApiPatchError('Unable to hide application: ' + e);
        }
        throw new ApiPatchError(error);
    }
};