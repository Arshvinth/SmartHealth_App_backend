const userStates = {};

export const getUserState = (user) => userStates[user] || (userStates[user] = { step: 0, data: {} });
export const resetUserState = (user) => delete userStates[user];
