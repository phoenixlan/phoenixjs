import { ApiPostError, ApiGetError } from "../errors";

import { getApiServer } from "../meta";
import { Oauth } from "../user"

import { BasicUser } from "../user";

interface Friendship{
    uuid: string;

    source_user: BasicUser;
    recipient_user: BasicUser;

    created: number;
    
    accepted?: number;
    revoked?: number;
}

export const createFriendRequest = async (user_email: string) => {
    const response = await fetch(`${getApiServer()}/friend_request`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            user_email: user_email
        })
    });

    if (!response.ok) {
            let error = ""
            try {
                error = (await response.json())['error']
            } catch (e) {
                throw new ApiPostError('Unable to create friend request');
            }

            throw new ApiPostError(error);
        }
    return await response.json() as Friendship
}

export const viewFriendRequest = async (uuid: string): Promise<Friendship> => {
	const response = await fetch(`${getApiServer()}/friend_request/${uuid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			"X-Phoenix-Auth": await Oauth.getToken()
		},
	});

	if (response.status !== 200) {
		throw new ApiGetError("Unable to get the friend request");
	}

	return (await response.json()) as Friendship;
};

export const revokeFriendRequest = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/friend_request/${uuid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (!response.ok) {
            let error = ""
            try {
                error = (await response.json())['error']
            } catch (e) {
                throw new ApiPostError('Unable to revoke friend request');
            }

            throw new ApiPostError(error);
        }
    return await response.json() as Friendship
}

export const acceptFriendRequest = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/friend_request/${uuid}/accept`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }
    });

    if (!response.ok) {
            let error = ""
            try {
                error = (await response.json())['error']
            } catch (e) {
                throw new ApiPostError('Unable to accept friend request');
            }

            throw new ApiPostError(error);
        }
    return await response.json() as Friendship
}
