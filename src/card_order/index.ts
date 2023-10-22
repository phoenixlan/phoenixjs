import { ApiPostError, ApiGetError } from "../errors";

import { getApiServer } from "../meta";
import { Oauth } from "../user"

import { BasicUser } from "../user";

export enum OrderStates {
    CREATED     = "CREATED",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED    = "FINISHED",
    CANCELLED   = "CANCELLED",
}

interface BaseCardOrder {
    uuid: string;
    
    created: number;
    state: OrderStates
    last_updated: number;
}

export type BasicCardOrder = BaseCardOrder & {
    event_uuid: string;
    subject_user: BasicUser;
    creator_user: BasicUser;
    
    updated_by_user: BasicUser;
}

//? init
export const createCardOrder = async (user_uuid: string) => {
    const response = await fetch(`${getApiServer()}/card_order`, {
        method: "POST",
        headers: {
			"Content-Type": "application/json",
			...(await Oauth.getAuthHeaders())
		},
        body: JSON.stringify({
            user_uuid: user_uuid
        })
    });

    if (!response.ok) {
            let error = ""
            try {
                error = (await response.json())["error"]
            } catch (e) {
                throw new ApiPostError("Unable to create card order");
            }

            throw new ApiPostError(error);
        }
    return await response.json() as BasicCardOrder;
}

export const getAllCardOrders = async (event_uuid:string|null) => {
    const response = await fetch(`${getApiServer()}/card_order/?event_uuid=${event_uuid}`, { // Idk if this works
		method: "GET",
        headers: {
			"Content-Type": "application/json",
			...(await Oauth.getAuthHeaders())
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get all card orders for event");
	}

	return (await response.json()) as Array<BasicCardOrder>;
};

//? instance
export const getCardOrder = async (uuid:string) => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}`, {
		method: "GET",
        headers: {
			"Content-Type": "application/json",
			...(await Oauth.getAuthHeaders())
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get specified card order");
	}

	return (await response.json()) as BasicCardOrder;
};

export const generateCardFromOrder = async (uuid: string) => {
    const result = await fetch(`${getApiServer()}/card_order/${uuid}/generate`, {
        method: "PATCH",
        headers: {
			"Content-Type": "application/json",
			...(await Oauth.getAuthHeaders())
		},
    });
    return result
}

export const finishCardOrder = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}/finish`, {
        method: "PATCH",
        headers: {
			"Content-Type": "application/json",
			...(await Oauth.getAuthHeaders())
		},
    });
    return (await response.json()) as BasicCardOrder;
}

export const cancelCardOrder = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/card_order/${uuid}/cancel`, {
        method: "PATCH",
        headers: {
			"Content-Type": "application/json",
			...(await Oauth.getAuthHeaders())
		},
    });
    return (await response.json()) as BasicCardOrder;
}
