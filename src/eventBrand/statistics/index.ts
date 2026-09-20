import { ApiGetError } from "../../errors/ApiGetError";
import { Event } from "../../events"
import { getApiServer } from "../../meta/api";
import { Oauth } from "../../user";

interface TicketSaleDay {
    idx: number;
    day: string;
    count: number;
}

interface TicketSaleStats {
    event: Event;
    days: TicketSaleDay[];
}

interface UserbaseStats {
    event: Event;
    counts: number[];
    crew_counts: number[];
}

interface AgeDistributionStats {
    event: Event;
    counts: number[];
    crew_counts: number[];
}

export const getTicketSaleData = async (event_brand_uuid: string, include_free: boolean): Promise<TicketSaleStats[]> => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/statistics/ticket_sales${include_free?"?include_free":""}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(await Oauth.getAuthHeaders()),
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


export const getUserbaseStatistics = async (event_brand_uuid: string): Promise<UserbaseStats[]> => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/statistics/participant_history`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiGetError('Unable to get userbase stats');
        }

        throw new ApiGetError(error);
    }
    return await response.json() as UserbaseStats[]
}

export const getAgeDistributionStats = async (event_brand_uuid: string): Promise<AgeDistributionStats[]> => {
    const response = await fetch(`${getApiServer()}/event_brand/${event_brand_uuid}/statistics/age_distribution`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(await Oauth.getAuthHeaders()),
        }
    });

    if (!response.ok) {
        let error = ""
        try {
            error = (await response.json())['error']
        } catch (e) {
            throw new ApiGetError('Unable to get age distribution stats');
        }

        throw new ApiGetError(error);
    }
    return await response.json() as AgeDistributionStats[]
}
