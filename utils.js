// import faker
const { faker } = require('@faker-js/faker');

// console.log('first name', faker.person.firstName());
// console.log('last name', faker.person.lastName());
// console.log('email', faker.internet.email());
// console.log('job title', faker.person.jobTitle());
// console.log('birthdate', faker.date.birthdate());
// console.log('street address', faker.location.streetAddress());
// console.log('city', faker.location.city());
// console.log('state', faker.location.state());
// console.log('zip code', faker.location.zipCode());
// console.log('phone number', faker.phone.number());

// create a function that returns an object of a random user with name in email
function createRandomUser() {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    // split the faker email
    let email = `${firstName}.${lastName}@${faker.internet.email().split('@')[1]}`

    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        jobTitle: faker.person.jobTitle(),
        birthdate: faker.date.birthdate(),
        address: {
            streetAddress: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode('#####')
        },
        number: faker.phone.number()
    }
}

module.exports = {
    createRandomUser,
}