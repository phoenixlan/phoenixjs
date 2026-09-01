import { JWTPayload } from "../user/oauth";

export type Permission = string;

export const ADMIN: Permission = "admin";
export const BRAND_ADMIN: Permission = "admin";

export const CHIEF: Permission = "chief";
export const MEMBER: Permission = "member";

export const TICKET_ADMIN: Permission = "ticket_admin";
export const TICKET_CHECKIN: Permission = "ticket_checkin";
export const INFO_ADMIN: Permission = "info_admin";
export const COMPO_ADMIN: Permission = "compo_admin";
export const NFC_ADMIN: Permission = "nfc_admin";
export const HR_ADMIN: Permission = "hr_admin";
export const CREW_CARD_PRINTER: Permission = "crew_card_printer";

export const TICKET_WHOLESALE: Permission = "ticket_wholesale";
export const TICKET_BYPASS_TICKETSALE_START_RESTRICTION: Permission = "ticket_bypass_ticketsale_start_restriction";

export const globalRole = (permission: Permission) => `global:${permission}`;
export const brandRole = (brandUuid: string, permission: Permission) => `brand:${brandUuid}:${permission}`;

const has = (payload: JWTPayload, role: string) => payload.roles.indexOf(role) !== -1;

export const hasGlobalRole = (payload: JWTPayload, permission: Permission) =>
    has(payload, globalRole(permission));

export const hasBrandRole = (payload: JWTPayload, brandUuid: string, permission: Permission) =>
    has(payload, brandRole(brandUuid, permission));

export const isAdmin = (payload: JWTPayload) => hasGlobalRole(payload, ADMIN);

export const isBrandAdmin = (payload: JWTPayload, brandUuid: string) =>
    hasBrandRole(payload, brandUuid, BRAND_ADMIN);

export const isMemberOfAnyCrew = (payload: JWTPayload) => has(payload, MEMBER);

export const isMemberOfBrand = (payload: JWTPayload, brandUuid: string) =>
    hasBrandRole(payload, brandUuid, MEMBER);

export const isChiefOfAnyCrew = (payload: JWTPayload) => has(payload, CHIEF);

export const isChiefOfBrand = (payload: JWTPayload, brandUuid: string) =>
    hasBrandRole(payload, brandUuid, CHIEF);

export const isChiefOfCrew = (payload: JWTPayload, crewUuid: string) =>
    has(payload, `chief:${crewUuid}`);

export const getBrandsWhere = (payload: JWTPayload, permission: Permission): Array<string> => {
    const suffix = `:${permission}`;
    return payload.roles
        .filter(role => role.startsWith("brand:") && role.endsWith(suffix))
        .map(role => role.slice("brand:".length, role.length - suffix.length))
        .filter(brandUuid => brandUuid.length > 0 && brandUuid.indexOf(":") === -1);
}

export const getUserUuid = (payload: JWTPayload): string | null => {
    const role = payload.roles.find(entry => entry.startsWith("user:"));
    return role ? role.slice("user:".length) : null;
}
