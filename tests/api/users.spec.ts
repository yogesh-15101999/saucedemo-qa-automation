import { test, expect } from "@playwright/test";
import * as apiData from "../../test-data/api-data";

test.describe("Users API (reqres.in)", () => {
  // Scenario 6: GET /api/users?page=2
  test("GET /api/users?page=2 returns 200 and a list of valid users", async ({
    request,
  }) => {
    const response = await request.get(`${apiData.USERS_ENDPOINT}?page=2`);

    await test.step("Verify status code", async () => {
      expect(response.status()).toBe(200);
    });

    const body = await response.json();

    await test.step('Verify the response has a non-empty "data" array', async () => {
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.page).toBe(2);
    });

    await test.step("Verify every user has id, email, first_name and last_name", async () => {
      for (const user of body.data) {
        for (const field of apiData.REQUIRED_USER_FIELDS) {
          expect(user, `User ${user.id} is missing "${field}"`).toHaveProperty(
            field,
          );
        }
      }
    });

    console.log(
      `✅ Case 6: GET users page 2 returned ${body.data.length} valid users - Passed`,
    );
  });

  // Scenario 7: POST /api/users
  test("POST /api/users creates a user and echoes the payload", async ({
    request,
  }) => {
    const response = await request.post(apiData.USERS_ENDPOINT, {
      data: apiData.NEW_USER,
    });

    await test.step("Verify status code 201", async () => {
      expect(response.status()).toBe(201);
    });

    const body = await response.json();

    await test.step("Verify name and job are echoed back", async () => {
      expect(body.name).toBe(apiData.NEW_USER.name);
      expect(body.job).toBe(apiData.NEW_USER.job);
    });

    await test.step("Verify id and createdAt are generated", async () => {
      expect(body.id).toBeTruthy();
      expect(body.createdAt).toBeTruthy();
      // createdAt must be a valid ISO date
      expect(Number.isNaN(Date.parse(body.createdAt))).toBe(false);
    });

    console.log(`✅ Case 7: POST created user id=${body.id} - Passed`);
  });

  // Scenario 8 (Bonus): create-then-verify flow.
  // Reqres does not persist data, so instead of a real GET we chain a PUT that
  // reuses the id returned by POST. This shows how a real create-then-verify
  // flow would be structured.
  test("Chain: create a user, then update it using the returned id", async ({
    request,
  }) => {
    let createdId: string;

    await test.step("Create the user (POST)", async () => {
      const createResponse = await request.post(apiData.USERS_ENDPOINT, {
        data: apiData.NEW_USER,
      });
      expect(createResponse.status()).toBe(201);

      const created = await createResponse.json();
      createdId = created.id;
      expect(createdId).toBeTruthy();
    });

    await test.step("Update the same user using the id from step 1 (PUT)", async () => {
      const updateResponse = await request.put(
        `${apiData.USERS_ENDPOINT}/${createdId}`,
        {
          data: { name: apiData.NEW_USER.name, job: apiData.UPDATED_JOB },
        },
      );
      expect(updateResponse.status()).toBe(200);

      const updated = await updateResponse.json();
      expect(updated.name).toBe(apiData.NEW_USER.name);
      expect(updated.job).toBe(apiData.UPDATED_JOB);
      expect(updated.updatedAt).toBeTruthy();
    });

    console.log("✅ Case 8 (Bonus): Create-then-update chain - Passed");
  });

  // Extra 1: Single user lookup
  test("GET /api/users/2 returns a single user", async ({ request }) => {
    const response = await request.get(`${apiData.USERS_ENDPOINT}/2`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(2);
    for (const field of apiData.REQUIRED_USER_FIELDS) {
      expect(body.data).toHaveProperty(field);
    }

    console.log("✅ Extra 1: GET single user - Passed");
  });

  // Extra 2: Negative test
  test("GET /api/users/23 returns 404 for a user that does not exist", async ({
    request,
  }) => {
    const response = await request.get(`${apiData.USERS_ENDPOINT}/23`);

    expect(response.status()).toBe(404);

    console.log("✅ Extra 2: Unknown user returns 404 - Passed");
  });

  // Extra 3: Delete
  test("DELETE /api/users/2 returns 204 with no content", async ({
    request,
  }) => {
    const response = await request.delete(`${apiData.USERS_ENDPOINT}/2`);

    expect(response.status()).toBe(204);

    console.log("✅ Extra 3: DELETE user returns 204 - Passed");
  });
});
