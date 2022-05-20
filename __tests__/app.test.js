const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
require("jest-sorted");

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
            expect(body.review).toEqual(expect.objectContaining ({
                review_id: 3,
                title: 'Ultimate Werewolf',
                category: 'social deduction',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_body: "We couldn't find the werewolf!",
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: `2021-01-18T10:01:41.251Z`,
                votes: 5
            }))
        });
    });
    test("status 200: returns an object with the additional comment_count property attached, with the correct value", () => {
        return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then (({ body }) => {
            expect(body.review).toHaveProperty("comment_count");
        })
    })
    test("status 400: returns a bad request message when an invalid id is passed", () => {
        return request(app)
        .get("/api/reviews/elephant")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        });
    });
    test("status 404: returns a page not found message when an inputted review doesnt exist", () => {
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
    });
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
        });
    });
    test("Status 404: valid number in path but doesn't match a review.", () => {
        const reviewVoteUpdate = {
            inc_votes: 10,
        }
        return request(app)
        .patch("/api/reviews/5654343")
        .send(reviewVoteUpdate)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found");
        });
    });
    test("Status 400: user passes an empty object in inc_votes ", () => {
        const reviewVoteUpdate = {
            
        }
        return request(app)
        .patch("/api/reviews/3")
        .send(reviewVoteUpdate)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        });
   })  
    
});

//A test battery that ensures that the user endpoint responds with an array the appropirate objects.
describe("GET /api/users", () => {
    test("status 200: responds with an array of user objects containing username, name and avatar_url", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then (({ body }) => {
            const {users} = body;
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(4);
            users.forEach((user) => {
                expect(user).toEqual(expect.objectContaining(
                    {
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                    }
                ));
            });
        });
    });
});

//A test battery thats ensures that the review requests are working correctly, given in date order (descending).
describe("GET: /api/reviews", () => {
    test("Status 200: responds with an array of objects containing the appropriate properties", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body}) => {
            const {reviews} = body;
            expect(reviews).toBeInstanceOf(Array);
            expect(reviews).toHaveLength(13);
            reviews.forEach((review) => {
                expect(review).toEqual(expect.objectContaining(
                    {
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        category: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),    
                        comment_count: expect.any(Number),
                }
                ));
            });
         });
    });
    test("Status 200: responds with an array of objects in descending date order", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body}) => {
            const {reviews} = body;
            expect(reviews).toBeSorted({ key: 'created_at', descending: true})
        });
    });
    test("Status 200: responds with an array of objects that are sorted by column, with date as the default", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
            const {reviews} = body;
            expect(reviews).toBeSorted({ key: 'created_at', descending: true})
        });
    });
    test("Status 200 :responds with an array of objects that are sorted by ascending date when user requests this", () => {
        return request(app)
        .get("/api/reviews?sort_by=owner&order=ASC")
        .expect(200)
        .then(({ body }) => {
            const {reviews} = body;
            expect(reviews).toBeSorted({ key: 'owner', ascending: true})
        });
    });
    test("Status 200: responds with an array of objects that are filtered by the topic value specified in the query", () => {
        return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({ body }) => {
            console.log(body.reviews, "<--- test output");
            const categories = body.reviews;
            expect(categories).toBeInstanceOf(Array);
            //expect(categories).toHaveLength(11);
            categories.forEach((category) => {
                expect(category).toEqual(expect.objectContaining(
                {
                category: "social deduction"
                }));
            });
        });
    });
    test("Status 400: user tries to enter a non-valid sort_by query", () => {
        return request(app)
        .get("/api/reviews?sort_by=shoe")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        });
    });
    test("Status 400: user tries to enter a non-valid order query", () => {
        return request(app)
        .get("/api/reviews?sort_by=owner&&order=shoes")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        });
    });
    test("Status 404: user tries to enter a non-existant category", () => {
        return request(app)
        .get("/api/reviews?category=shoe")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found");
        });
    });
});

//A test battery thats ensures the review_id/comments endpoint returns the correct propeties.
describe("GET: /api/reviews/:reviews_id/comments", () => {
    test("Status 200: responds with an array of objects containing the appropriate properties", () => {
        return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
            const {comment} = body;
            expect(comment).toBeInstanceOf(Array);
            expect(comment).toHaveLength(3);
                comment.forEach((comments) => {
                expect(comments).toEqual(expect.objectContaining(
                    {
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: expect.any(Number),
                    }
                ))
            });
        });
    });
    test("Status 200: found a review but no comments to show", () => {
        return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comment).toEqual([])

        })
    })
    test("Status 400: something not a number passed as the id in path", () => {
        return request(app)
        .get("/api/reviews/shoes/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("bad request");
        })
    })
    test("Status 404: valid number but not a number that matches an id in path", () => {
        return request(app)
        .get("/api/reviews/4152547/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found");
        })
    })
});

//A test battery that creates a new comment on a review_id endpoint, with the correct properties.
describe("POST: /api/review/:review_id/comments", () => {
    test("status 201: posts a new comment with the appropriate properties", () => {
        const newComment = {
            username: "mallionaire",
            body: "maaa maaaa.... pwwwhhh.... ba!"
        }
        return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(201)
        .then (({ body}) => {
            expect(body.comment).toEqual(expect.objectContaining({
                review_id: 3,
                author: "mallionaire",
                body: "maaa maaaa.... pwwwhhh.... ba!"
            }));
        });
    });
    test("Status 400: body does not contain a body key", () => {
        const newComment = {
            username: "mallionaire"
        }
        return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(400)
        .then (({ body }) => {
            expect(body.msg).toBe("bad request");
        }); 
    });
    test("Status 400: body does not contain a username key", () => {
        const newComment = {
            body: "maaa maaaa.... pwwwhhh.... ba!"
        }
        return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(400)
        .then (({ body }) => {
            expect(body.msg).toBe("bad request");
        }); 
    });
    test("Status 404: review_id path does not exist", () => {
        const newComment = {
            username: "mallionaire",
            body: "maaa maaaa.... pwwwhhh.... ba!"
        }
        return request(app)
        .post("/api/reviews/12132546/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found");
        });
    });
    test("Status 404: user not in the database tries to post", () => {
        const newComment = {
            username: "eden",
            body: "maaa maaaa.... pwwwhhh.... ba!"
        }
        return request(app)
        .post("/api/reviews/3/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("page not found")
        })
    })
}); 

//A test battery that ensures a comment is removed when a user asks to delete it. 
describe("DELETE: /api/comments/:comment_id", () => {
    test.only("Status 204: no content", () => {
        return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then(({ body }) => {
            expect(body.msg).toBe("content removed");
        })
    });
    test("Status 404: comment_id in path does not exist", () => {
        return request(app)
        .delete("/api/comments/65637836")
        .expect(404)
        .then(({ body }) => {
            console.log(body);
            expect(body.msg).toBe("page not found")
        });
    });
    test("Status 400: comment_id path is not a number", () => {
        return request(app)
        .delete("/api/comments/dave!")
        .expect(400)
        .then(({ body}) => {
            expect(body.msg).toBe("bad request");
        });
    });
}); 