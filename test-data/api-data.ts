// Test data shared across all API tests (reqres.in)

export const USERS_ENDPOINT = "/api/users";

// Payload for the POST /api/users scenario
export const NEW_USER = {
  name: "morpheus",
  job: "leader",
};

// Used for the chained create-then-verify flow
export const UPDATED_JOB = "zion resident";

// Fields every user object must contain
export const REQUIRED_USER_FIELDS = ["id", "email", "first_name", "last_name"];
