import {getApiServer} from "../meta";
import {ApiGetError, ApiPatchError, ApiPutError} from "../errors";
import { BasicUserWithSecretFields, Oauth } from "../user";
import { BasicTicket } from "../ticket";
import { TicketType } from "../ticketType";
import { BasicApplication } from "../crew/applications";

export interface Event {
    name: string;
    event_brand_uuid: string;
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

export interface TicketAvailability {
    total: number;
}

export interface NewEvent {
    name: string;
    start_time: number;
    end_time: number;
    booking_time: number;
    priority_seating_time_delta: number;
    seating_time_delta: number;
    max_participants: number;

    participant_age_limit_inclusive?: number;
    crew_age_limit_inclusive?: number;
    theme?: string;
    location_uuid?: string;
    seatmap_uuid?: string;
}

export interface EventChanges {
    name?: string;
    start_time?: number;
    end_time?: number;
    booking_time?: number;
    priority_seating_time_delta?: number;
    seating_time_delta?: number;
    max_participants?: number;
    participant_age_limit_inclusive?: number;
    crew_age_limit_inclusive?: number;
    theme?: string | null;
    cancellation_reason?: string | null;
    seatmap_uuid?: string | null;
}


export const getCurrentEvent = async (event_brand_uuid: string): Promise<Event | null> => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/current_event`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError('Unable to get the current event');
    }

    return (await response.json()) as Event | null;
};

export const createEvent = async (event_brand_uuid: string, event: NewEvent): Promise<Event> => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/event`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify(event)
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPutError('Unable to create event');
        }

        throw new ApiPutError(error);
    }

    return (await response.json()) as Event;
};

export const updateEvent = async (uuid: string, changes: EventChanges): Promise<Event> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify(changes)
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPatchError('Unable to update event');
        }

        throw new ApiPatchError(error);
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

export const getEventTicketAvailability = async (uuid: string): Promise<TicketAvailability> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/ticket_availability`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get ticket availability");
    }

    return (await response.json()) as TicketAvailability;
};

export const getEventCrewCard = async (event_uuid: string, user_uuid: string) => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/crew_card?user_uuid=${encodeURIComponent(user_uuid)}`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        }
    });

    return response;
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