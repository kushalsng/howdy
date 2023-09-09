export const getReceiver = (loggedInUser, users) => {
  return users[0]._id === loggedInUser._id ? users[1] : users[0]
}