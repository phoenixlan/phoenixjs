import {getApiServer} from "../meta";
import {ApiDeleteError, ApiGetError, ApiPatchError, ApiPostError, ApiPutError} from "../errors";
import { BasicUserWithMembershipPersonalia , Oauth } from "../user";
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
    // Maximum number of tickets that can be sold per sales cap group
    ticket_sales_caps: Record<string, number>;
    priority_seating_time_delta: number;
    seating_time_delta: number;
    seatmap_uuid: string;
    start_time: number;
    theme: null | string;
    uuid: string;
}

export interface TicketTypeAvailability {
    ticket_type_mapping_uuid: string;
    ticket_type: TicketType;
    // The sales cap groups buying this ticket type counts towards
    groups: Array<string>;
    // How many tickets of this type can be bought. null if nothing limits the ticket type
    remaining: number | null;
}

export interface GroupAvailability {
    group: string;
    remaining: number;
}

export interface TicketAvailability {
    ticket_types: Array<TicketTypeAvailability>;
    // One entry per group configured in the event's ticket_sales_caps
    groups: Array<GroupAvailability>;
}

export interface EventTicketTypeMapping {
    uuid: string;
    event_uuid: string;
    ticket_type: TicketType;
    // Maximum number of tickets of this type that can be sold. null means the ticket type has no cap of its own
    sales_cap: number | null;
    sales_cap_groups: Array<string>;
    // If set, the ticket type is hidden until a user unlocks it with this code
    access_code: string | null;
    created: number;
    modified: number;
}

export interface NewEventTicketTypeMapping {
    ticket_type_uuid: string;
    // A mapping for a ticket type that grants admission must have a sales_cap or belong to at least one group.
    // Other ticket types may have neither, in which case they can be sold without limit
    sales_cap_groups: Array<string>;
    sales_cap?: number | null;
    generate_code?: boolean;
}

export interface NewEvent {
    name: string;
    start_time: number;
    end_time: number;
    booking_time: number;
    priority_seating_time_delta: number;
    seating_time_delta: number;
    ticket_sales_caps?: Record<string, number>;

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
    ticket_sales_caps?: Record<string, number>;
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

// Ticket types with an access code are only returned if the logged in user has unlocked them
export const getEventTicketTypes = async (uuid: string): Promise<Array<TicketType>> => {
    let authHeaders = {};
    try {
        authHeaders = await Oauth.getAuthHeaders();
    } catch (e) {
        // Not logged in - only publicly available ticket types are returned
    }

    const response = await fetch(`${getApiServer()}/event/${uuid}/ticketType`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get the event's ticket types");
    }

    return (await response.json()) as Array<TicketType>;
};

export const getEventTicketTypeMappings = async (event_uuid: string): Promise<Array<EventTicketTypeMapping>> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/ticket_type_mapping`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get the event's ticket type mappings");
    }

    return (await response.json()) as Array<EventTicketTypeMapping>;
};

export const createEventTicketTypeMapping = async (event_uuid: string, mapping: NewEventTicketTypeMapping): Promise<EventTicketTypeMapping> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/ticket_type_mapping`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify(mapping)
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPutError('Unable to create ticket type mapping');
        }

        throw new ApiPutError(error);
    }

    return (await response.json()) as EventTicketTypeMapping;
};

// Fails if tickets of the type have been sold or are reserved for the event
export const deleteEventTicketTypeMapping = async (mapping_uuid: string): Promise<void> => {
    const response = await fetch(`${getApiServer()}/event_ticket_type_mapping/${mapping_uuid}`, {
        method: 'DELETE',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiDeleteError('Unable to delete ticket type mapping');
        }

        throw new ApiDeleteError(error);
    }
};

// Replaces the access code with a new one. Users who unlocked the ticket type with the old code keep access.
// Fails if the mapping has no access code
export const rotateEventTicketTypeMappingAccessCode = async (mapping_uuid: string): Promise<EventTicketTypeMapping> => {
    const response = await fetch(`${getApiServer()}/event_ticket_type_mapping/${mapping_uuid}/rotate`, {
        method: 'POST',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to rotate access code');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as EventTicketTypeMapping;
};

// Returns true if the code unlocked a ticket type, false if the code is invalid
export const unlockEventTicketType = async (event_uuid: string, code: string): Promise<boolean> => {
    const response = await fetch(`${getApiServer()}/event/${event_uuid}/unlock_ticket_type`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            code
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to unlock ticket type');
        }

        throw new ApiPostError(error);
    }

    return (await response.json())['success'] as boolean;
};

export const getEventNewMembers = async (uuid: string): Promise<Array<BasicUserWithMembershipPersonalia>> => {
    const response = await fetch(`${getApiServer()}/event/${uuid}/new_memberships`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (response.status !== 200) {
        throw new ApiGetError("Unable to get new memberships");
    }

    return (await response.json()) as Array<BasicUserWithMembershipPersonalia>;
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

// Only contains ticket types the logged in user can see. Works without being logged in
export const getEventTicketAvailability = async (uuid: string): Promise<TicketAvailability> => {
    let authHeaders = {};
    try {
        authHeaders = await Oauth.getAuthHeaders();
    } catch (e) {
        // Not logged in - only publicly available ticket types are returned
    }

    const response = await fetch(`${getApiServer()}/event/${uuid}/ticket_availability`, {
        method: 'GET',
        headers: {
            ...authHeaders,
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
