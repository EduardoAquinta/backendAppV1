const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');

//closes all databases after the test suite has run.
afterAll(() => {
     db.end();
})

//seeds the test database for utilisation in the tests. 
beforeEach(() => {
return seed(testData)
});

//An initial test to ensure the database setup is working correctly. 
describe ("GET: /api", () => {
    test("status 200: returns a message as an JSON object", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then (({ body }) => {
            expect (body).toEqual({"message" : "all working well"})
        });
    });
});

//A test battery that ensures the categories get requests are working correctly, with appropriate error messaging tests. 
describe("GET: /api/categories", () => {
    test("status 200: response with an array of category objects with slug and desciption properties", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then (({ body }) => {
            const {categories} = body;
            expect(categories).toBeInstanceOf(Array);
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
                expect(category).toEqual(expect.objectContaining(
                    {
                        slug: expect.any(String),
                        description: expect.any(String),
                    }
                ));
            });
        });
    });
    test("404: responds with an error message when given a bad route", () => {
        return request(app)
        .get("/api/elephant")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found");
        });
    });
});

//A test battery that ensures the review_id endpoint requests are correctly returned, with appropriate error messaging tests. 

describe("GET /api/reviews/:review_id", () => {
    test("status 200: responds with an object with the appropriate properties", () => {
        return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
            expect(body.review).toEqual({
                review_id: 3,
                title: 'Ultimate Werewolf',
                category: 'social deduction',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_body: "We couldn't find the werewolf!",
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: `2021-01-18T10:01:41.251Z`,
                votes: 5
            })
        });
    });
    test("status 400: returns a bad request message when an invalid id is passed", () => {
        return request(app)
        .get("/api/reviews/elephant")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        });
    });
    test("status 404: returns a page not found message when am inputted review doesnt exist", () => {
        return request(app)
        .get("/api/reviews/9898797")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found");
        });
    });
});

//A test battery that ensures the vote numbers increment or decrement as the user input suggests.

describe("PATCH /api/review/:review_id", () => {
    test("Status 200: votes are altered by the correct positive amount", () => {
        const reviewVoteUpdate = {
            inc_votes: 10,
        }
        return request(app)
        .patch("/api/reviews/3")
        .send(reviewVoteUpdate)
        .expect(200)
        .then (({body}) => {
            expect(body.review).toEqual({
                review_id: 3,
                title: 'Ultimate Werewolf',
                category: 'social deduction',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_body: "We couldn't find the werewolf!",
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: `2021-01-18T10:01:41.251Z`,
                votes: 15,    
            });       
        });
    });
    test("Status 200: votes are altered by the correct negative amount", () => {
        const reviewVoteUpdate = {
            inc_votes: -10,
        }
        return request(app)
        .patch("/api/reviews/3")
        .send(reviewVoteUpdate)
        .expect(200)
        .then (({body}) => {
            expect(body.review).toEqual({
                review_id: 3,
                title: 'Ultimate Werewolf',
                category: 'social deduction',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_body: "We couldn't find the werewolf!",
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: `2021-01-18T10:01:41.251Z`,
                votes: -5,    
            });       
        });
    });
    test("Status 400: something that is not a number is passed as the id in the path", () => {
        const reviewVoteUpdate = {
            inc_votes: -10,
        }
        return request(app)
        .patch("/api/reviews/elephant")
        .send(reviewVoteUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        })
    })
    test("Status 400: user passes something not a number in inc_votes", () => { 
        const reviewVoteUpdate = {
            inc_votes: 'dave',
        }
        return request(app)
        .patch("/api/reviews/3")
        .send(reviewVoteUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        })
    })
    
});