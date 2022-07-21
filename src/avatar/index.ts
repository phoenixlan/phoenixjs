import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiPostError} from "../errors";

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
			"X-Phoenix-Auth": await Oauth.getToken()
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
			"X-Phoenix-Auth": await Oauth.getToken()
		}
	});

	if(result.status !== 200) {
		throw new ApiPostError("Failed to delete avatar");
	}
}