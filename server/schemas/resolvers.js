
const { User } = require('../models');
const { AuthenticationError, signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
    },

    Mutation: {
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });

            if (!user) {
                throw AuthenticationError
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { userId, input }) => {
            return User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { savedBooks: input } },
                {
                    new: true,
                    runValidators: true,
                }
            );
        },
        removeBook: async (parent, { userId, bookId }, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            } catch (err) {
                console.error(err)
            }
        }
    },
};

module.exports = resolvers;