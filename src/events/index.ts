import {getApiServer} from "../meta";
import {ApiGetError} from "../errors";
import { BasicUserWithSecretFields, Oauth } from "../user";
import { BasicTicket } from "../ticket";
import { TicketType } from "../ticketType";

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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get the events tickets");
    }

    return (await response.json()) as Array<BasicTicket>;
};
