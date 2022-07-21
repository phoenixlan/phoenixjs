import {getApiServer} from "../../meta";
import {User} from "../../user";
import * as Oauth from "../../user/oauth";
import {ApiGetError, ApiPutError, ApiParameterError} from "../../errors";
import { Event } from "../../events"

enum ApplicationState {
    created = 1,
    accepted = 2,
    rejected = 3
}

export interface Application {
    uuid: string,
    crew_uuid: string,
    event_uuid: string,
    user: User,
    contents: string,
    created: number,
    /* this doesnt exist yet */
    state: ApplicationState
    answer?: string
}

export const getAllApplications = async (): Promise<Array<Application>> => {
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

    return (await response.json()) as Array<Application>;
};

export const getApplication = async (uuid: string): Promise<Application> => {
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

    return (await response.json()) as Application;
};

export const getAllApplicationsByEvent = async (event: Event): Promise<Array<Application>> => {
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

    return (await response.json()) as Array<Application>;
};


export const getUserApplications = async (): Promise<Array<Application>> => {
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

    return (await response.json()) as Array<Application>;
};

export const createApplication = async (crew_uuid, contents): Promise<Application> => {
    const response = await fetch(`${getApiServer()}/application`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            crew_uuid,
            contents,
        })
    })

    if(response.status !== 200) {
        throw new ApiPutError('Unable to create application');
    }

    return (await response.json()) as Application;
}

export const answerApplication = async (uuid: string, answer: string, state: ApplicationState.accepted|ApplicationState.rejected): Promise<void> => {
    if (!uuid) {
        throw new ApiParameterError('uuid cannot be null');
    }
    if(!answer) {
        throw new ApiParameterError('Answer cannot be null')
    }
    const response = await fetch(`${getApiServer()}/application/${uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            answer: answer,
            state: state === ApplicationState.accepted ? "accepted" : "rejected"
        })
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to answer application');
    }
};