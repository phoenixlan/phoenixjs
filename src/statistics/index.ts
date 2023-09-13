import { ApiGetError } from "../errors/ApiGetError";
import { Event } from "../events"
import { getApiServer } from "../meta/api";
import { Oauth } from "../user";

interface TicketSaleDay {
    idx: number;
    day: string;
    count: number;
}

interface TicketSaleStats {
    event: Event;
    days: TicketSaleDay[];
}

export const getTicketSaleData = async (include_free: boolean): Promise<TicketSaleStats[]> => {
    const response = await fetch(`${getApiServer()}/statistics/ticket_sales${include_free?"?include_free":""}`, {
        method: 'GET',
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
            throw new ApiGetError('Unable to get ticket stats');
        }

        throw new ApiGetError(error);
    }
    return await response.json() as TicketSaleStats[]
}