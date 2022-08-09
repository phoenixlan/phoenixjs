import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

interface Seat {
    uuid: string;
    number: number;
    is_reserved: boolean;
    row_uuid: string;
}

export interface Row {
    uuid: string;
    x: number;
    y: number;
    is_horizontal: boolean;
    seatmap_uuid: string;
    entrance_uuid: string|null;
    ticket_type_uuid: string|null;
    row_number: number;
    seats: Array<Seat>;
}

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

    return (await response.json()) as Row;
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