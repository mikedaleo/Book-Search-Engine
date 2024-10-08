const typeDefs = `
input BookInput {
    authors: [String]!
    description: String!
    bookId: String!
    image: String!
    link: String
    title: String!
}

type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]!
    description: String
    title: String!
    image: String
    link: String
}

type Auth {
    token: String!
    user: User
}

type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(userId: ID!, input: BookInput): User
    removeBook(userId: ID!, bookId: String!): User
}`

module.exports = typeDefs;