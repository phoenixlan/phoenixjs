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

export const createAgendaEntry = async (title: string, description: string, event_uuid: string, time: number) => {
    const response = await fetch(`${getApiServer()}/agenda`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Phoenix-Auth': await Oauth.getToken(),
        },
        body: JSON.stringify({
            title,
            description,
            event_uuid,
            time
        })
    })
    return response.status === 200
}

export const modifyAgendaEntry = async (uuid: string, title: string, description: string, event_uuid: string, newLocation: string, newTime: number, modifyReason: string, sticky: boolean) => {
    const response = await fetch(`${getApiServer()}/agenda`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-Phoenix-Auth': await Oauth.getToken(),
        },
        body: JSON.stringify({
            uuid,
            title,
            description,
            event_uuid,
            newLocation,
            newTime,
            modifyReason,
            sticky
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