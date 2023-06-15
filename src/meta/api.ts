import {InitError} from "../errors";

let BASE_URL = ""

export const getApiServer = () => {
	if(BASE_URL === "") {
		throw new InitError("Base URL is not set - remember to init the api before using it");
	}
	return BASE_URL;
}

export const init = (baseUrl: string) => {
	BASE_URL = baseUrl;
}