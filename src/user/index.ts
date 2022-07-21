import * as Oauth from './oauth'


import { getApiServer } from '../meta/api';
import {ApiGetError, AuthError} from "../errors";
import {BasicPosition} from "../crew";

import {Avatar} from '../avatar';
import {Ticket} from "../payment";

export interface User {
	uuid: string;
	username: string;
	birthdate: string;
	firstname: string;
	lastname: string;
	gender: string;
	phone: string;
	address: string;
	postal_code: string;
	country_code: string;
	tos_level: number;
	positions: Array<BasicPosition>;
	avatar?: Avatar
}

export const getOwnTickets = async (uuid: string): Promise<Array<Ticket>> => {
	const response = await fetch(`${getApiServer()}/user/${uuid}/tickets`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Infected-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get the user's tickets");
	}

	return (await response.json()) as Array<Ticket>;
};

export const getAuthenticatedUser = async () => {
	const result = await fetch(`${getApiServer()}/user/current`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Infected-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get authentication token");
	}

	return await result.json() as User;
}

export const getUser = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/user/${uuid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Infected-Auth": await Oauth.getToken()
		}
	})
	if(result.status !== 200) {
		throw new AuthError("Unable to get authentication token");
	}

	return await result.json() as User;
}

export const getAuthenticationUrl = (callback: string, clientId: string) => {
	return `${getApiServer()}/static/login.html?redirect_uri=${encodeURIComponent(callback)}&client_id=${encodeURIComponent(clientId)}`
}

export { Oauth };