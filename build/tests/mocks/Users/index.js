import { faker } from "@faker-js/faker";
import { Roles } from "../../../src/types/enum.js";
export function createRandomUser() {
    return {
        userName: faker.internet.displayName(),
        email: faker.internet.email(),
        profilePicture: faker.image.avatar(),
        password: faker.internet.password(),
        fullName: faker.internet.userName(),
        role: Roles.USER,
    };
}
export const createMultipleRandomUsers = (cantidad) => {
    const users = faker.helpers.multiple(createRandomUser, {
        count: cantidad,
    });
    return users;
};
