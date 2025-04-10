type ReserveTableParams = Record<string, never>;
type ReserveTableResponse = {
  success: boolean;
  message: string;
  data?: {
    id: number;
    numberOfGuests: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    cancelledAt?: Date | null;
    restaurantId: number;
    userId: number;
    restaurant?: {
      id: number;
      name: string;
      location: string;
      cuisine: string[];
      totalSeats: number;
      seatsAvailable: number;
    };
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
  error?: string;
};
type ReserveTableBody = {
  restaurantId: number;
  userId: number;
  numberOfGuests: number;
};
type ReserveTableQuery = Record<string, never>;

type CancelReservationParams = Record<string, never>;
type CancelReservationResponse = {
  success: boolean;
  message: string;
  error?: string;
};
type CancelReservationBody = {
  bookingId: number;
};
type CancelReservationQuery = Record<string, never>;

type GetAllReservationsParams = {
  userId: string;
};
type GetAllReservationsResponse = {
  success: boolean;
  message?: string;
  count?: number;
  data?: {
    all: Array<{
      id: number;
      numberOfGuests: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      cancelledAt?: Date | null;
      restaurantId: number;
      userId: number;
      restaurant: {
        id: number;
        name: string;
        location: string;
        cuisine: string[];
        totalSeats: number;
        seatsAvailable: number;
      };
    }>;
    active: Array<{
      id: number;
      numberOfGuests: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      cancelledAt?: Date | null;
      restaurantId: number;
      userId: number;
      restaurant: {
        id: number;
        name: string;
        location: string;
        cuisine: string[];
        totalSeats: number;
        seatsAvailable: number;
      };
    }>;
    completed: Array<{
      id: number;
      numberOfGuests: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      cancelledAt?: Date | null;
      restaurantId: number;
      userId: number;
      restaurant: {
        id: number;
        name: string;
        location: string;
        cuisine: string[];
        totalSeats: number;
        seatsAvailable: number;
      };
    }>;
    cancelled: Array<{
      id: number;
      numberOfGuests: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      cancelledAt?: Date | null;
      restaurantId: number;
      userId: number;
      restaurant: {
        id: number;
        name: string;
        location: string;
        cuisine: string[];
        totalSeats: number;
        seatsAvailable: number;
      };
    }>;
  };
  error?: string;
};
type GetAllReservationsBody = Record<string, never>;
type GetAllReservationsQuery = Record<string, never>;

export { ReserveTableParams, ReserveTableResponse, ReserveTableBody, ReserveTableQuery };
export {
  CancelReservationParams,
  CancelReservationResponse,
  CancelReservationBody,
  CancelReservationQuery,
};

export {
  GetAllReservationsParams,
  GetAllReservationsResponse,
  GetAllReservationsBody,
  GetAllReservationsQuery,
};
