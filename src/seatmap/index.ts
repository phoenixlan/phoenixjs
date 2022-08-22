import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

import { Row, AvailabilityRow } from '../row';

interface SeatmapBase {
    uuid: string;
    background: string|null;
    width: number;
    height: number;
}

export type Seatmap = {
    name: string;
    description: string;
//    events: Array<Event>;
    rows: Array<Row>;
} & SeatmapBase;

export type SeatmapAvailability = {
    rows: Array<AvailabilityRow>;
} & SeatmapBase;

export const createSeatmap = async (name: string, description: string) => {
    const response = await fetch(`${getApiServer()}/seatmap`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
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
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to upload background');
    }

    return (await response.json()) as Seatmap;
}