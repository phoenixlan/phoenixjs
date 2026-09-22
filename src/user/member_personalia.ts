import { getApiServer } from '../meta/api';
import * as Oauth from './oauth'

import {ApiGetError, AuthError, ApiPutError, ApiPatchError} from "../errors";

interface MemberPersonalia {
	phone: string;

	address: string;
	postal_code: string;
	country_code: string;
}


export const getMemberPersonalia = async (user_uuid: string): Promise<MemberPersonalia|null> => {
	const response = await fetch(`${getApiServer()}/user/${user_uuid}/member_personalia`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(await Oauth.getAuthHeaders())
		},
	});

	if(response.status == 404) {
		return null;
	}

	if (!response.ok) {
		throw new ApiGetError("Unable to get the user's member personalia");
	}

	return (await response.json()) as MemberPersonalia;
};

export const upsertMemberPersonalia = async (user_uuid: string, phone: string, address: string, postal_code: string): Promise<MemberPersonalia> => {
    const response = await fetch(`${getApiServer()}/user/${user_uuid}/member_personalia`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
					phone,
					address,
					postal_code
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPutError('Unable upsert member personalia');
        }

        throw new ApiPutError(error);
    }

    return (await response.json()) as MemberPersonalia;
}
