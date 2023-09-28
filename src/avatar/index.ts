import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError, ApiPostError} from "../errors";

export type AvatarState = 'AvatarState.accepted' | 'AvatarState.rejected' | 'AvatarState.uploaded';

export interface Avatar {
	uuid: string;
	user_uuid: string;
	state: AvatarState;
	urls: {
		hd: string;
		sd: string;
		thumb: string;
	}
}

export const createAvatar = async (file: File, x: number, y: number, w: number, h: number, uuid: string) => {
	const data = new FormData();
	data.set("file", file);
	data.set("x", x.toString());
	data.set("y", y.toString());
	data.set("w", w.toString());
	data.set("h", h.toString());
	const result = await fetch(`${getApiServer()}/user/${uuid}/avatar`, {
		method: 'POST',
		headers: {
			...(await Oauth.getAuthHeaders())
		},
		body: data,
	});

	if(result.status !== 200) {
		throw new ApiPostError("Failed to create avatar");
	}
}

export const deleteAvatar = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/avatar/${uuid}`, {
		method: 'DELETE',
		headers: {
			...(await Oauth.getAuthHeaders())
		}
	});

	if(result.status !== 200) {
		throw new ApiPostError("Failed to delete avatar");
	}
}

export const getAvatar = async (uuid: string) => {
	const result = await fetch(`${getApiServer()}/avatar/${uuid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(result.status !== 200) {
		throw new ApiGetError("Unable to get avatar");
	}

	return await result.json() as Avatar;
}


export const getAvatars = async () => {
	const result = await fetch(`${getApiServer()}/avatar`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(result.status !== 200) {
		throw new ApiGetError("Unable to get avatars");
	}

	return await result.json() as Array<Avatar>;
}

export const getPendingAvatars = async () => {
	const result = await fetch(`${getApiServer()}/avatar/pending`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		}
	})
	if(result.status !== 200) {
		throw new ApiGetError("Unable to get pending avatars");
	}

	return await result.json() as Array<Avatar>;
}

export const setApproved = async (uuid: string, state: boolean) => {
	const result = await fetch(`${getApiServer()}/avatar/${uuid}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
		body: JSON.stringify({
			new_state: state ? "accepted": "rejected"
		})
	})
	if(result.status !== 200) {
		throw new ApiGetError("Unable to set avatar approval status");
	}
}
