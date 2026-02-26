export * from './api'

import {getApiServer} from "../meta";
import {ApiGetError} from "../errors";

export interface SiteConfig {
    name: string;
    logo: string;
    contact: string;
    features: string[];
}


export const getSiteConfig = async (): Promise<SiteConfig> => {
    const response = await fetch(`${getApiServer()}/config`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new ApiGetError('Unable to get current site config');
    }

    return (await response.json()) as SiteConfig;
};

