import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

interface AgendaEntry {
    uuid: string;
    time: number;
    title: string;
    description: string;
}

export const getAgenda = async (): Promise<Array<AgendaEntry>> => {
    const response = await fetch(`${getApiServer()}/agenda/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get agenda');
    }

    return (await response.json()) as Array<AgendaEntry>;
};

export const getAgendaElement = async (uuid: string): Promise<AgendaEntry> => {
    const response = await fetch(`${getApiServer()}/agenda/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get agenda element');
    }

    return (await response.json()) as AgendaEntry;
};

export const createAgendaEntry = async (
        event_uuid: string, 
        title: string, 
        description: string, 
        location: string, 
        time: number, 
        state_pinned: boolean
    ) => {
    const response = await fetch(`${getApiServer()}/agenda`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Phoenix-Auth': await Oauth.getToken(),
        },
        body: JSON.stringify({
            event_uuid,
            title,
            description,
            location,
            time,
            state_pinned
        })
    })
    return response.status === 200
}

export const modifyAgendaEntry = async (
        uuid: string, 
        event_uuid: string, 
        title: string, 
        description: string, 
        time: number,
        location: string,
        deviating_time: number,
        deviating_location: string,
        deviating_information: string,
        state_pinned: boolean,
        state_deviating_time_unknown: boolean,
        state_cancelled: boolean,
    ) => {
    const response = await fetch(`${getApiServer()}/agenda`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-Phoenix-Auth': await Oauth.getToken(),
        },
        body: JSON.stringify({
            uuid,
            event_uuid,
            title,
            description,
            time,
            location,
            deviating_time,
            deviating_location,
            deviating_information,
            state_pinned,
            state_deviating_time_unknown,
            state_cancelled,
        })
    })
    return response.status === 200
}

export const deleteAgendaEntry = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/agenda/${uuid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Phoenix-Auth': await Oauth.getToken()
        }
    })
    return response.status === 200
}