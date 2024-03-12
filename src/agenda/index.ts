import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiDeleteError, ApiGetError, ApiPutError} from "../errors";

interface AgendaEntry {
    uuid: string;
    time: number;
    title: string;
    description: string;
}

export const getAgenda = async (): Promise<Array<AgendaEntry[]>> => {
    const response = await fetch(`${getApiServer()}/agenda/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get agenda');
    }

    return (await response.json()) as Array<AgendaEntry[]>;
};

export const getAgendaElement = async (uuid: string): Promise<AgendaEntry[]> => {
    const response = await fetch(`${getApiServer()}/agenda/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get agenda element.');
    }

    return (await response.json()) as AgendaEntry[];
};

export const createAgendaEntry = async (
        event_uuid: string, 
        title: string, 
        description: string, 
        location: string, 
        time: number, 
        duration: number,
        pinned: boolean
    ) => {
    const response = await fetch(`${getApiServer()}/agenda`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders())
        },
        body: JSON.stringify({
            event_uuid,
            title,
            description,
            location,
            time,
            duration,
            pinned
        })
    })

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error'];
        } catch (e) {
            throw new ApiPutError('Unable to create a new agenda entry.');
        }

        throw new ApiPutError(error);
    } else {
        return await response.json() as AgendaEntry;
    }
}

export const modifyAgendaEntry = async (
        uuid: string, 
        event_uuid: string, 
        title: string, 
        description: string, 
        time: number,
        duration: number,
        location: string,
        deviating_time_unknown: boolean,
        deviating_location: string,
        deviating_information: string,
        pinned: boolean,
        cancelled: boolean,
        deviating_time?: number
    ) => {
    const response = await fetch(`${getApiServer()}/agenda/${uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders())
        },
        body: JSON.stringify({
            uuid,
            event_uuid,
            title,
            description,
            time,
            duration,
            location,
            deviating_time_unknown,
            deviating_location,
            deviating_information,
            pinned,
            cancelled,
            deviating_time
        })
    })
    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error'];
        } catch (e) {
            throw new ApiPutError('Unable to modify requested agenda entry.');
        }
        throw new ApiPutError(error);
    } else {
        return await response.json() as AgendaEntry;
    }
}

export const deleteAgendaEntry = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/agenda/${uuid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders())
        }
    })
    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error'];
        } catch (e) {
            throw new ApiDeleteError('Unable to delete requested agenda entry.');
        }
        throw new ApiDeleteError(error);
    } else {
        return await response.json() as AgendaEntry;
    }
}