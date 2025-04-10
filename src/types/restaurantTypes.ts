type Restaurant = {
  id: number;
  name: string;
  location: string;
  cuisine: string[];
  totalSeats: number;
  seatsAvailable: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateRestaurantParams = Record<string, never>;
type CreateRestaurantResponse = {
  success: boolean;
  message: string;
  data?: Restaurant;
  error?: string;
};
type CreateRestaurantBody = {
  name: string;
  location: string;
  cuisine: string[];
  totalSeats: number;
  seatsAvailable: number;
};
type CreateRestaurantQuery = Record<string, never>;

type GetAllRestaurantsParams = Record<string, never>;
type GetAllRestaurantsResponse = {
  success: boolean;
  count?: number;
  data?: Restaurant[];
  error?: string;
  message?: string;
};
type GetAllRestaurantsBody = Record<string, never>;
type GetAllRestaurantsQuery = Record<string, never>;

type GetRestaurantByIdParams = {
  id: string;
};
type GetRestaurantByIdResponse = {
  success: boolean;
  data?: Restaurant;
  message?: string;
  error?: string;
};
type GetRestaurantByIdBody = Record<string, never>;
type GetRestaurantByIdQuery = Record<string, never>;

export {
  Restaurant,
  CreateRestaurantParams,
  CreateRestaurantResponse,
  CreateRestaurantBody,
  CreateRestaurantQuery,
};
export {
  GetAllRestaurantsParams,
  GetAllRestaurantsResponse,
  GetAllRestaurantsBody,
  GetAllRestaurantsQuery,
};
export {
  GetRestaurantByIdParams,
  GetRestaurantByIdResponse,
  GetRestaurantByIdBody,
  GetRestaurantByIdQuery,
};
