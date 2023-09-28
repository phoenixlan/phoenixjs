import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

import { SimpleRow, AvailabilityRow } from '../row';

interface SeatmapBase {
    uuid: string;
    width: number;
    height: number;
}

interface SeatmapBackground {
    uuid: string;
    url: string;
}

export type Seatmap = {
    name: string;
    description: string;
    background: SeatmapBackground|null;
//    events: Array<Event>;
    rows: Array<SimpleRow>;
} & SeatmapBase;

export type SeatmapAvailability = {
    background_url: string|null;
    rows: Array<AvailabilityRow>;
} & SeatmapBase;

export const createSeatmap = async (name: string, description: string) => {
    const response = await fetch(`${getApiServer()}/seatmap`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            name,
            description
        })
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to create seatmap');
    }

    return (await response.json()) as Seatmap;
}
export const getSeatmap = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/seatmap/${uuid}`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get seatmap');
    }

    return (await response.json()) as Seatmap;
}

export const getSeatmapAvailability = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/seatmap/${uuid}/availability`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get seatmap availability');
    }

    return (await response.json()) as SeatmapAvailability;
}

export const getSeatmaps = async () => {
    const response = await fetch(`${getApiServer()}/seatmap/`, {
        method: 'GET',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get seatmaps');
    }

    return (await response.json()) as Array<Seatmap>;
}


export const addRow = async (seatmapUuid: string, rowNumber: number, x: number, y: number, horizontal: boolean, entrance?: string, ticketType?: string) => {
    const response = await fetch(`${getApiServer()}/seatmap/${seatmapUuid}/row`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            row_number: rowNumber,
            x,
            y,
            horizontal,
            entrance,
            ticket_type: ticketType
        })
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to add row');
    }
    return true;
}


export const uploadBackground = async (uuid: string, body: FormData) => {
    const response = await fetch(`${getApiServer()}/seatmap/${uuid}/background`, {
        method: 'PUT',
        headers: {
            ...(await Oauth.getAuthHeaders()),
        },
        body
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to upload background');
    }

    return (await response.json()) as Seatmap;
}