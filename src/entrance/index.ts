import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError} from "../errors";

interface Entrance{
    uuid: string,
    name: string
}

export const getEntrances = async () => {
    const response = await fetch(`${getApiServer()}/entrance/`, {
        method: 'GET',
        headers: {
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get entrances');
    }

    return (await response.json()) as Array<Entrance>;
}