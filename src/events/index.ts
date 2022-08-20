import {getApiServer} from "../meta";
import {ApiGetError} from "../errors";
import { Oauth } from "../user";
import { BasicTicket } from "../ticket";
import { TicketType } from "../ticketType";

export interface Event {
    name: string;
    booking_time: number;
    cancellation_reason: null | string;
    end_time: number;
    max_participants: number;
    priority_seating_time_delta: number;
    seating_time_delta: number;
    seatmap: {
        background_mage: string;
        event_uuid: string;
        uuid: string;
    };
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