import jwt_decode from "jwt-decode";

import { getApiServer } from '../../meta/api';
import {AuthError, RefreshError} from "../../errors";

type TokensUpdatedCallback = (new_access_token: string, new_refresh_token: string) => void;

let TOKEN = "";
let REFRESH_TOKEN = "";
let ON_TOKENS_UPDATED: TokensUpdatedCallback|null = null;

export interface JWTPayload {
	sub: string;
	exp: number;
	iat: number;
	roles: string[];
}

export const authenticateByCode = async (code: string) => {
	const result = await fetch(`${getApiServer()}/oauth/token`, {
		method: 'POST',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded'
		  },    
		  body: new URLSearchParams({
			grant_type: 'authorization_code',
			code
		  })
	});

	if(result.status !== 200) {
		return false;
	}

	const response = await result.json() as {
		access_token: string,
		refresh_token: string
	}

	TOKEN = response.access_token;
	REFRESH_TOKEN = response.refresh_token;

	if(ON_TOKENS_UPDATED) {
		ON_TOKENS_UPDATED(TOKEN, REFRESH_TOKEN);
	}
	return true;
}

const refreshToken = async () => {
	const result = await fetch(`${getApiServer()}/oauth/token`, {
		method: 'POST',
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: REFRESH_TOKEN
		})
	});

	if(result.status !== 200) {
		throw new RefreshError("Unable to authenticate");
	}

	const tokens = await result.json();

	TOKEN = tokens.access_token;

	if(tokens.refresh_token) {
		console.log("New refresh token too")
		REFRESH_TOKEN = tokens.refresh_token;
	}
	if(ON_TOKENS_UPDATED) {
		ON_TOKENS_UPDATED(TOKEN, REFRESH_TOKEN);
	}
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

export const getAuthHeaders = async () => {
	const token = await getToken();
	return {
		"Authorization": `Bearer ${token}`
	}
}

export const getRefreshToken = async () => {
	return REFRESH_TOKEN;
}

export const setAuthState = async (token: string|undefined, refreshToken: string) => {
	console.log(`Received auth state: ${token} refresn ${refreshToken}`)
	TOKEN = token ?? "";
	REFRESH_TOKEN = refreshToken;

	await getToken();
}

export const setTokensUpdateCallback = (onTokensUpdatedCallback: TokensUpdatedCallback) => {
	ON_TOKENS_UPDATED = onTokensUpdatedCallback;
}

export const getTokenPayload = async () => {
	return jwt_decode(await getToken()) as JWTPayload;
}