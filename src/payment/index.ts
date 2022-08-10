/*
 * @created 31/05/2021 - 15:43
 * @project phoenixjs-1.0
 * @author andreasjj
 */
import {getApiServer} from "../meta";
import * as Oauth from "../user/oauth";
import {ApiGetError, ApiPostError} from "../errors";
import { BasicTicket } from '../ticket';

export * from './storeSession';

export type VippsPayment = {
    slug: string,
    url: string,
}

export type VisaPayment = {
    client_secret: string,
}

export interface PaymentInfo {
    created: number,
    price: number,
    provider: string,
    state: string,
    store_session_uuid: string,
    user_uuid: string,
    uuid: string,
    tickets: Array<BasicTicket>
}

export const createPayment = async (store_session: string, provider: string) => {
    const response = await fetch(`${getApiServer()}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify({
            store_session,
            provider,
        })
    });

    if(response.status !== 200) {
        throw new ApiPostError("Unable to create payment");
    }

    return await response.json() as PaymentInfo;
}

export const initiatePayment = async (paymentUuid: string, fallbackUrl?: string) => {
    const body: {fallback_url?: string} = {}
    if (fallbackUrl) {
        body.fallback_url = fallbackUrl
    }
    const response = await fetch(`${getApiServer()}/payment/${paymentUuid}/initiate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-Phoenix-Auth": await Oauth.getToken(),
        },
        body: JSON.stringify(body)
    });

    if(response.status !== 200) {
        throw new ApiPostError("Unable to create payment initiation");
    }

    return await response.json();
}

export const initiateVippsPayment = async (paymentUuid: string, fallbackUrl: string) => {
    const payment = initiatePayment(paymentUuid, fallbackUrl);
    return payment as unknown as VippsPayment;
}

export const initiateVisaPayment = async (paymentUuid: string) => {
    const payment = initiatePayment(paymentUuid);
    return payment as unknown as VisaPayment;
}

export const poll = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/payment/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Phoenix-Auth': await Oauth.getToken(),
        },
    });

    if(response.status !== 200) {
        throw new ApiGetError("Unable to get payment data");
    }

    return await response.json() as PaymentInfo;
}

