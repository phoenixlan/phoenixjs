import { getApiServer } from "../meta";
import { BasicUser, Oauth } from "../user";
import { ApiGetError, ApiPostError, ApiPutError } from "../errors";

export const emailDryrun = async (recipient_category: string, subject: string, body: string, argument?: string) => {
    const response = await fetch(`${getApiServer()}/email/dryrun`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }, body: JSON.stringify({
            recipient_category,
            subject,
            body,
            argument
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to do e-mail dry-run');
        }
        throw new ApiPostError(error);
    }
    return await response.json()
}

export const sendEmails = async (recipient_category: string, subject: string, body: string, argument?: string) => {
    const response = await fetch(`${getApiServer()}/email/send`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Phoenix-Auth": await Oauth.getToken(),
        }, body: JSON.stringify({
            recipient_category,
            subject,
            body,
            argument
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to do e-mail dry-run');
        }
        throw new ApiPostError(error);
    }
    return await response.json()
}