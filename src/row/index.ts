import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

export interface Entrance {
    uuid: string;
    name: string;
}

export interface BaseSeat {
    uuid: string;
    number: number;
    is_reserved: boolean;
}


export type SimpleSeat = {
    row_uuid: string;
} & BaseSeat;

export type TicketSeat = {
    row: {
        'uuid': string;
        'row_number': number;
        'entrance': Entrance;
    }
} & BaseSeat;

export type AvailabilitySeat = {
    taken: boolean;
    row: BaseRow;
    ticket_id: number|null;
} & BaseSeat;

/*
export interface Row {
    uuid: string;
    x: number;
    y: number;
    is_horizontal: boolean;
    seatmap_uuid: string;
    ticket_type_uuid: string|null;
    row_number: number;
}*/

interface BaseRow {
    uuid: string;
    row_number: number;
    x: number;
    y: number;
    is_horizontal: boolean;
    ticket_type_uuid: string|null; //ticket typen som eventuelt er den eneste som kan seate der
}

export type AvailabilityRow = {
    seats: Array<AvailabilitySeat>;
} & BaseRow;

export type FullRow = {
    entrance: Entrance;
    seats: Array<SimpleSeat>;
    seatmap_uuid: string;
} & BaseRow;

export type SimpleRow = {
    entrance_uuid: string|null;
    seats: Array<SimpleSeat>;
    seatmap_uuid: string;
} & BaseRow;

interface RowUpdatableFields {
    x: number;
    y: number;
    is_horizontal: boolean;
    row_number: number;
}

export const updateRow = async (uuid: string, options: RowUpdatableFields) => {
    const response = await fetch(`${getApiServer()}/row/${uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify(options)
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to create seatmap');
    }

    return (await response.json()) as SimpleRow;
}

export const addSeat = async (rowUuid: string) => {
    const response = await fetch(`${getApiServer()}/row/${rowUuid}/seat`, {
        method: 'PUT',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to add seat');
    }
    return true;
}