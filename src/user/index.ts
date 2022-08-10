import * as Oauth from './oauth'


import { getApiServer } from '../meta/api';
import {ApiGetError, AuthError} from "../errors";
import {BasicPosition} from "../crew";

import {Avatar} from '../avatar';
import { BasicTicket } from "../ticket";

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

export type BasicUser = {
} & BaseUser;

export type BasicUserWithPositions = {
	positions: Array<BasicPosition>;
} & BasicUser;

export type FullUser = {
	birthdate: string;
	phone: string;
	address: string;
	postal_code: string;
	country_code: string;
	tos_level: number;
	positions: Array<BasicPosition>;
	avatar_uuid?: string;
	owned_tickets: Array<BasicTicket>;
} & BaseUser;


export const getOwnTickets = async (uuid: string): Promise<Array<BasicTicket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/tickets`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get the user's tickets");
	}

	return (await response.json()) as Array<BasicTicket>;
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
		throw new AuthError("Unable to get authentication token");
	}

	return await result.json() as FullUser;
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
		throw new AuthError("Unable to get authentication token");
	}

	return await result.json() as FullUser;
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

export const getAuthenticationUrl = (callback: string, clientId: string) => {
	return `${getApiServer()}/static/login.html?redirect_uri=${encodeURIComponent(callback)}&client_id=${encodeURIComponent(clientId)}`
}

export const getFullName = (user: BasicUser) => {
	return `${user.firstname} ${user.lastname}`
}

export { Oauth };