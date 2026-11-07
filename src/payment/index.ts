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

export type StripePayment = {
    client_secret: string,
}

export interface PaymentInfo {
    created: number,
    price: number,
    refunded_amount: number,
    provider: string,
    state: string,
    store_session_uuid: string,
    user_uuid: string,
    uuid: string,
    tickets: Array<BasicTicket>
}

export const createPayment = async (store_session: string, provider: string) => {
    const response = await fetch(`${getApiServer()}/store_session/${store_session}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
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
            ...(await Oauth.getAuthHeaders()),
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

export const initiateStripePayment = async (paymentUuid: string) => {
    const payment = initiatePayment(paymentUuid);
    return payment as unknown as StripePayment;
}

// Free payments have nothing to pay, so initiating one mints the tickets right away
export const initiateFreePayment = async (paymentUuid: string) => {
    const payment = initiatePayment(paymentUuid);
    return payment as unknown as PaymentInfo;
}

// Refunds the given tickets. Refunding every remaining ticket of a payment refunds it in full.
// Tickets that are checked in, non-refundable, created from a voucher or no longer owned by the buyer can't be refunded.
export const refundPayment = async (paymentUuid: string, ticketIds: Array<number>): Promise<PaymentInfo> => {
    const response = await fetch(`${getApiServer()}/payment/${paymentUuid}/refund`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
        body: JSON.stringify({
            tickets: ticketIds,
        })
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiPostError('Unable to refund payment');
        }

        throw new ApiPostError(error);
    }

    return (await response.json()) as PaymentInfo;
}

export const poll = async (uuid: string) => {
    const response = await fetch(`${getApiServer()}/payment/${uuid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(await Oauth.getAuthHeaders()),
        },
    });

    if(response.status !== 200) {
        throw new ApiGetError("Unable to get payment data");
    }

    return await response.json() as PaymentInfo;
}

