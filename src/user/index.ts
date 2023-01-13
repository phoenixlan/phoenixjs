import * as Oauth from './oauth'


import { getApiServer } from '../meta/api';
import {ApiGetError, AuthError} from "../errors";

import {Avatar} from '../avatar';
import { FullTicket, FullTicketTransfer } from "../ticket";
import { BasicPosition } from '../position';
import { PositionFacingPositionMapping } from '../position_mapping';

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

export const getOwnedTickets = async (uuid: string): Promise<Array<FullTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/owned_tickets`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get the user's tickets");
	}

	return (await response.json()) as Array<FullTicket>;
};

export const getPurchasedTickets = async (uuid: string): Promise<Array<FullTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/purchased_tickets`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get the user's tickets");
	}

	return (await response.json()) as Array<FullTicket>;
};

export const getTicketTransfers = async (uuid: string): Promise<Array<FullTicketTransfer>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/ticket_transfers`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get ticket transfers");
	}

	return (await response.json()) as Array<FullTicketTransfer>;
};
export const getSeatableTickets = async (uuid: string, event_uuid?: string): Promise<Array<FullTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/seatable_tickets${event_uuid?"?event_uuid=" + event_uuid:''}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get seatable tickets");
	}

	return (await response.json()) as Array<FullTicket>;
};

export const getAuthenticatedUser = async () => {
	const result = await fetch(`${getApiServer()}/user/current`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get current user");
	}

	return await result.json() as FullUser;
}

export const getUserMembershipStatus = async (uuid: string, year?: number) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}/membership${year?'?year='+year:""}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get membership status");
	}

	return (await result.json()).is_member as boolean;
}

export const getUser = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get user");
	}

	return await result.json() as FullUser;
}

export const getUserActivationState = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}/activation`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get authentication token");
	}

	return (await result.json()).activated as boolean;
}

export const activateUser = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}/activation`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get authentication token");
	}
}

export const searchUsers = async (query: string) => {
	const result = await fetch(`${getApiServer()}/user/search?query=${encodeURIComponent(query)}`, {
		method: 'GET',
		headers: {
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to search");
	}

	return await result.json() as Array<BasicUser>;
}

// TODO add users
export const getUsers = async () => {
	const result = await fetch(`${getApiServer()}/user`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get users");
	}

	return await result.json() as BasicUser[];
}

export const createDiscordMappingOauthUrl = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}/discord_mapping`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(!result.ok) {
		try {
			throw new ApiGetError((await result.json())['error']);
		} catch (e) {
			throw new ApiGetError("Unable to create discord mapping");
		}
	}

	return await result.json() as DiscordMappingCreationInformation;
}

export const revokeDiscordMapping = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}/discord_mapping`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})

	if(!result.ok) {
		throw new ApiGetError("Unable to revoke Discord mapping");
	}
}

export const getDiscordMapping = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}/discord_mapping`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	})
	if(result.status === 404) {
		return null;
	}

	if(!result.ok) {
		throw new ApiGetError("Unable to get discord mapping");
	}

	return await result.json() as DiscordMapping;
}

export const getAuthenticationUrl = (callback: string, clientId: string) => {
	return `${getApiServer()}/static/login.html?redirect_uri=${encodeURIComponent(callback)}&client_id=${encodeURIComponent(clientId)}`
}

export const getFullName = (user: BasicUser) => {
	return `${user.firstname} ${user.lastname}`
}

export { Oauth };