const BASE_URL = 'https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api';

export const LOGIN_ENDPOINT = `${BASE_URL}/Auth/login`;
export const USER_PROFILE_ENDPOINT = `${BASE_URL}/Auth/userProfile`;
export const UPLOAD_PROFILE_PICTURE_ENDPOINT = `${BASE_URL}/Auth/UpdateDriverProfilePicture`;
export const RESET_PASSWORD_ADMIN = `${BASE_URL}/Notification/send-reset-password-notification`;
export const CHANGE_ENDPOINT = `${BASE_URL}/Auth/change-password`;
export const TRIP_ENDPOINT = `${BASE_URL}/Trip`;
export const GET_ALL_VEHICLES_ENDPOINT = `${BASE_URL}/Vehicles`;
export const ADD_FUEL_REFILL_ENDPOINT = `${BASE_URL}/FuelRefill`;
export const ADD_VEHICLE_MAINTENANCE_ENDPOINT = `${BASE_URL}/VehicleMaintenance`;
export const GET_MAINTENANCE_TYPES_ENDPOINT = `${BASE_URL}/VehicleMaintenanceType`;
export const ADD_ACCIDENT_ENDPOINT = `${BASE_URL}/Accidents`;

// Add more endpoints as needed
