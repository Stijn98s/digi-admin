import {
    FetchAPI, UsersApiFactory, PlayersApiFactory, AuthenticationApiFactory, TagsApiFactory, OrganismsApiFactory, CatchzonesApiFactory, AreasApiFactory
} from './api';

import {Configuration} from './configuration'


const url = 'https://megain.xyz:4000';

function getConfig() {
    // @ts-ignore
    return new Configuration({apiKey: () => `Bearer ${localStorage.getItem('key')}`, basePath: url});
}

export function Resolve<T>(toursGet: (fetch?: FetchAPI, basePath?: string) => Promise<T>) {

}

export function AuthenticationApiClient() {
    return AuthenticationApiFactory(getConfig(), undefined, url);
}

export function UserApiClient() {
    return UsersApiFactory(getConfig(), undefined, url);
}

export function TagsApiClient() {
    return TagsApiFactory(getConfig(), undefined, url);
}

export function PlayerApiClient() {
    return PlayersApiFactory(getConfig(), undefined, url);
}

export function OrganismApiClient() {
    return OrganismsApiFactory(getConfig(), undefined, url);
}

export function CatchZoneApiClient() {
    return CatchzonesApiFactory(getConfig(), undefined, url);
}

export function AreaApiClient() {
    return AreasApiFactory(getConfig(), undefined, url);
}

