import {getApiServer} from "../meta";
import {ApiGetError, ApiPatchError} from "../errors";
import { BasicUserWithSecretFields, Oauth } from "../user";
import { BasicTicket } from "../ticket";
import { TicketType } from "../ticketType";
import { BasicApplication } from "../crew/applications";

export interface Event {
    name: string;
    participant_age_limit_inclusive: number;
    crew_age_limit_inclusive: number;
    booking_time: number;
    cancellation_reason: null | string;
    end_time: number;
    max_participants: number;
    priority_seating_time_delta: number;
    seating_time_delta: number;
    seatmap_uuid: string;
    start_time: number;
    theme: null | string;
    uuid: string;
}


export const getCurrentEvent = async (): Promise<Event> => {
    const response = await fetch(`${getApiServer()}/event/current`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get the current event');
    }

    return (await response.json()) as Event;
};

export const getEvents = async (): Promise<Array<Event>> => {
    const response = await fetch(`${getApiServer()}/event/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get all events');
    }

    return (await response.json()) as Array<Event>;
};

export const getEvent = async (uuid: string): Promise<Event> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get the event');
    }

    return (await response.json()) as Event;
};

type ModifyEventKeys = "name" | "start_time" | "end_time" | "booking_time" | "priority_seating_time_delta" | "seating_time_delta" | "max_participants" | "participant_age_limit_inclusive" | "crew_age_limit_inclusive" | "theme" | "location" | "cancellation_reason";
export const modifyEvent = async (
    uuid: string,
    values?: Record<ModifyEventKeys, string>) => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/edit`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        ...(await Oauth.getAuthHeaders())
    },
    body: JSON.stringify({
        uuid,
        ...values
    })})
    
    if (response.status === 403) {
        throw new ApiPatchError("You do not have access to edit event information.")
    } 
    else if (!response.ok) {
        throw new ApiPatchError((await response.json())['error']);
    } 
    else {
        return await response.json();
    }
}

export const getEventTicketTypes = async (uuid: string): Promise<Array<TicketType>> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/ticketType`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get the event's ticket types");
    }

    return (await response.json()) as Array<TicketType>;
};

export const addEventTicketType = async (event_uuid: string, ticket_type_uuid: string): Promise<Array<TicketType>> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/ticketType`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            ticket_type_uuid
        })
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get the event's ticket types");
    }

    return (await response.json()) as Array<TicketType>;
};

export const getEventMembersRequiringMembership = async (uuid: string): Promise<Array<BasicUserWithSecretFields>> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/customers_requiring_memberships`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get customers requiring memberships");
    }

    return (await response.json()) as Array<BasicUserWithSecretFields>;
};

export const getEventNewMembers = async (uuid: string): Promise<Array<BasicUserWithSecretFields>> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/new_memberships`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get new memberships");
    }

    return (await response.json()) as Array<BasicUserWithSecretFields>;
};

export const getEventTickets = async (uuid: string): Promise<Array<BasicTicket>> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/ticket`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get the events tickets");
    }

    return (await response.json()) as Array<BasicTicket>;
};

export const getApplicationsByEvent = async (event_uuid: string): Promise<Array<BasicApplication>> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/applications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get applications');
    }

    return (await response.json()) as Array<BasicApplication>;
};