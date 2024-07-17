const BASE_URL = 'https://4d07-2407-c00-5002-411a-20c0-60ff-c968-135f.ngrok-free.app/api';

export const LOGIN_ENDPOINT = `${BASE_URL}/Auth/login`;
export const USER_PROFILE_ENDPOINT = `${BASE_URL}/Auth/userProfile`;
export const UPLOAD_PROFILE_PICTURE_ENDPOINT = `${BASE_URL}/Auth/UpdateDriverProfilePicture`;
export const RESET_PASSWORD_ADMIN = `${BASE_URL}/Notification/send-reset-password-notification`;
export const CHANGE_ENDPOINT = `${BASE_URL}/Auth/change-password`;
export const TRIP_ENDPOINT = `${BASE_URL}/Trips`;
export const GET_ALL_VEHICLES_ENDPOINT = `${BASE_URL}/Vehicle`;
// Add more endpoints as needed
