import jwt_decode from "jwt-decode";

import { getApiServer } from '../../meta/api';
import {AuthError, RefreshError} from "../../errors";

let TOKEN = "";
let REFRESH_TOKEN = "";

export interface JWTPayload {
	sub: string;
	exp: number;
	iat: number;
	roles: string[];
}

export const authenticateByCode = async (code: string) => {
	const result = await fetch(`${getApiServer()}/oauth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			grant_type: 'code',
			code
		})
	});

	if(result.status !== 200) {
		return false;
	}

	const response = await result.json() as {
		token: string,
		refresh_token: string
	}

	TOKEN = response.token;
	REFRESH_TOKEN = response.refresh_token;
	return true;
}

const refreshToken = async () => {
	const result = await fetch(`${getApiServer()}/oauth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			grant_type: 'refresh_token',
			refresh_token: REFRESH_TOKEN
		})
	});

	if(result.status !== 200) {
		throw new RefreshError("Unable to authenticate");
	}

	TOKEN = (await result.json()).token;
}

const checkExpiry = (token: JWTPayload) => {
	const now = new Date().getTime()/1000;

	//If the token expires within 5 seconds, we treat it as expired
	if(token.exp - 5 < now) {
		return false;
	}

	return true;
}

export const getToken = async () => {
	if(REFRESH_TOKEN === "") {
		throw new AuthError("Not authenticated");
	}

	if(TOKEN === "") {
		await refreshToken();	
	} else {
		//Check expiration
		const decoded = jwt_decode(TOKEN) as JWTPayload;
		if(!checkExpiry(decoded)) {
			await refreshToken();
		}
	}

	return TOKEN;
}

export const getRefreshToken = async () => {
	return REFRESH_TOKEN;
}

export const setAuthState = async (token: string|undefined, refreshToken: string) => {
	TOKEN = token ?? "";
	REFRESH_TOKEN = refreshToken;

	await getToken();
}

export const getTokenPayload = async () => {
	return jwt_decode(await getToken()) as JWTPayload;
}