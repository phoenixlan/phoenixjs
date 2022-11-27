import { BasePosition } from "../position";
import { BaseUser } from "../user";

export interface BasePositionMapping {
    uuid: string;
    created: number;
}

export type SimplePositionMapping = BasePositionMapping & {
    position_uuid: string;
    user_uuid: string;
    event_uuid: string;
}

export type PositionFacingPositionMapping = BasePositionMapping & {
    position: BasePosition;
    user_uuid: string;
    event_uuid: string;
}

export type UserFacingPositionMapping = BasePositionMapping & {
    position_uuid: string;
    user: BaseUser;
    event_uuid: string;
}