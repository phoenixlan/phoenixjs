import { getApiServer } from '../meta/api';
import * as Oauth from './oauth'

import {ApiGetError, AuthError, ApiPutError, ApiPatchError} from "../errors";

export interface MembershipPersonalia {
	address: string;
	postal_code: string;
	country_code: string;
}


export const getMembershipPersonalia = async (user_uuid: string): Promise<MembershipPersonalia|null> => {
	const response = await fetch(`${getApiServer()}/user/${user_uuid}/membership_personalia`, {
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
		throw new ApiGetError("Unable to get the user's membership personalia");
	}

	return (await response.json()) as MembershipPersonalia;
};

export const upsertMembershipPersonalia = async (user_uuid: string, address: string, postal_code: string): Promise<MembershipPersonalia> => {
    const response = await fetch(`${getApiServer()}/user/${user_uuid}/membership_personalia`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
					address,
					postal_code
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPutError('Unable upsert membership personalia');
        }

        throw new ApiPutError(error);
    }

    return (await response.json()) as MembershipPersonalia;
}
