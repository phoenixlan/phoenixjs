import * as Oauth from './oauth'


import { getApiServer } from '../meta/api';
import {ApiGetError, AuthError, ApiPutError, ApiPatchError} from "../errors";

import {Avatar} from '../avatar';
import { FullTicket, FullTicketTransfer } from "../ticket";
import { BasicPosition } from '../position';
import { PositionFacingPositionMapping } from '../position_mapping';
import { BasicTicketVoucher } from '../ticketVoucher';
import { Friendship } from '../friend_request';

interface UserConsent {
	consent_type: string;
	source: string;
	created: number;
}

export interface BaseUser {
	uuid: string;
	username: string;
	firstname: string;
	lastname: string;
	gender: string;
	avatar_urls: {
		sd: string;
		hd: string;
		thumb: string;
	}
}

export type BasicUserWithSecretFields = {
	birthdate: string;
	email: string;
	phone: string;
	address: string;
	postal_code: string;
} & BaseUser;

export type BasicUser = {
} & BaseUser;

export type BasicUserWithPositionMappings = {
	position_mappings: Array<PositionFacingPositionMapping>;
} & BasicUser;

export type FullUser = {
	birthdate: string;
	phone: string;
	address: string;
	postal_code: string;
	country_code: string;
	tos_level: number;
	position_mappings: Array<PositionFacingPositionMapping>;
	avatar_uuid?: string;

	consents: Array<UserConsent>;
} & BaseUser;

export interface DiscordMapping {
	discord_id: string;
	username: string;
	avatar: string;
}

interface DiscordMappingCreationInformation {
	url: string;
}

export const getFriendships = async (uuid: string): Promise<Array<Friendship>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/friendships`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get the user's active friendships");
	}

	return (await response.json()) as Array<Friendship>;
};

export const getFriendRequests = async (uuid: string): Promise<Array<Friendship>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/friend_requests`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get the user's active friend requests");
	}

	return (await response.json()) as Array<Friendship>;
};

export const getOwnedTickets = async (uuid: string): Promise<Array<FullTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/owned_tickets`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get the user's tickets");
	}

	return (await response.json()) as Array<FullTicket>;
};

export const getPurchasedTickets = async (uuid: string): Promise<Array<FullTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/purchased_tickets`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get the user's tickets");
	}

	return (await response.json()) as Array<FullTicket>;
};

export const getTicketVouchers = async (uuid: string): Promise<Array<BasicTicketVoucher>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/ticket_vouchers`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get the user's ticket_vouchers");
	}

	return (await response.json()) as Array<BasicTicketVoucher>;
};

export const getTicketTransfers = async (uuid: string): Promise<Array<FullTicketTransfer>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/ticket_transfers`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get ticket transfers");
	}

	return (await response.json()) as Array<FullTicketTransfer>;
};
export const getSeatableTickets = async (uuid: string, event_uuid?: string): Promise<Array<FullTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/seatable_tickets${event_uuid?"?event_uuid=" + event_uuid:''}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if (!response.ok) {
		throw new ApiGetError("Unable to get seatable tickets");
	}

	return (await response.json()) as Array<FullTicket>;
};

export const getAuthenticatedUser = async () => {
	const response = await fetch(`${getApiServer()}/user/current`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(!response.ok) {
		throw new AuthError("Unable to get current user");
	}

	return await response.json() as FullUser;
}

export const getUserMembershipStatus = async (uuid: string, year?: number) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/membership${year?'?year='+year:""}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(!response.ok) {
		throw new AuthError("Unable to get membership status");
	}

	return (await response.json()).is_member as boolean;
}

export const getUser = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(response.status === 403) {
		throw new ApiGetError("You do not have access to view this user.");
	}
	else if(!response.ok) {
		throw new ApiGetError("We were unable to get information about this user.");
	}

	return await response.json() as FullUser;
}

type ModifyUserKeys = "firstname" | "lastname" | "username" | "email" | "phone" | "guardian_phone" | "address" | "postal_code" | "birthdate" | "gender";
export const modifyUser = async (
    uuid: string,
    values?: Record<ModifyUserKeys, string>) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}`, {
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
		throw new ApiPatchError("You do not have access to edit user information.")
	} 
	else if (!response.ok) {
		throw new ApiPatchError((await response.json())['error']);
	} 
	else {
		return await response.json();
	}
}

export const getUserActivationState = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/activation`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(response.status === 403) {
		throw new ApiGetError("You do not have access to view a user's activation status.");
	}
	else if(!response.ok) {
		throw new ApiGetError("We were unable to get this user's activation status.");
	}

	return (await response.json()).activated as boolean;
}

export const activateUser = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/activation`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(!response.ok) {
		throw new AuthError("Unable to activate this user.");
	}
}

export const searchUsers = async (query: string) => {
	const response = await fetch(`${getApiServer()}/user/search?query=${encodeURIComponent(query)}`, {
		method: 'GET',
		headers: {
			...(await Oauth.getAuthHeaders())
		}
	})
	if(!response.ok) {
		throw new AuthError("Unable to search");
	}

	return await response.json() as Array<BasicUser>;
}

// TODO add users
export const getUsers = async () => {
	const response = await fetch(`${getApiServer()}/user`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(!response.ok) {
		throw new AuthError("Unable to get users");
	}

	return await response.json() as BasicUser[];
}

export const createDiscordMappingOauthUrl = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/discord_mapping`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(!response.ok) {
		try {
			throw new ApiGetError((await response.json())['error']);
		} catch (e) {
			throw new ApiGetError("Unable to create discord mapping");
		}
	}

	return await response.json() as DiscordMappingCreationInformation;
}

export const revokeDiscordMapping = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/discord_mapping`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})

	if(!response.ok) {
		throw new ApiGetError("Unable to revoke Discord mapping");
	}
}

export const getDiscordMapping = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/discord_mapping`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(response.status === 404) {
		return null;
	}

	if(!response.ok) {
		throw new ApiGetError("Unable to get discord mapping");
	}

	return await response.json() as DiscordMapping;
}

export const getCrewCard = async (uuid: string) => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/crew_card`, {
		method: "GET",
		headers: {
			...(await Oauth.getAuthHeaders())
		}
	})
	return response
}

export const getAuthenticationUrl = (callback: string, clientId: string) => {
	return `${getApiServer()}/static/login.html?redirect_uri=${encodeURIComponent(callback)}&client_id=${encodeURIComponent(clientId)}`
}

export const getFullName = (user: BasicUser) => {
	return `${user.firstname} ${user.lastname}`
}

export { Oauth };