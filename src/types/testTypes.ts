// Reservation Test Types

export interface TestUser {
  body: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface TestRestaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string[];
  totalSeats: number;
  seatsAvailable: number;
}

export interface TestUserId {
  id: number;
  name: string;
  email: string;
  password?: string;
}

// Restaurant Test Types
export interface TestUser {
  body: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}
