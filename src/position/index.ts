import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

interface Position{

}

export const getPositions = async () => {
    const response = await fetch(`${getApiServer()}/position/`, {
        method: 'GET',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get positions');
    }

    return (await response.json()) as Array<Position>;
}