import { Profile } from '../models/profile.model';

export const PROFILE_LIST: Profile[] = [
    {
        id: 0,
        name: 'Admin',
        lastName: 'Root',
        role: 'admin',
        SHOW_POP_UP_TIMER: 99999999999,
        NUMBER_OF_ANSWERS_DISPLAYED: 10,
        REMOVE_WRONG_ANSWER_INTERVAL: 999999999,
        SHOW_HINT_TIMER: 5,
        NUMBER_OF_HINTS_DISPLAYED: 9999,
        profilePicture: "empty_path"
    },
    {
        id: -1,
        name: 'Guest',
        lastName: 'User',
        role: 'user',
        SHOW_POP_UP_TIMER: 15000,
        NUMBER_OF_ANSWERS_DISPLAYED: 4,
        REMOVE_WRONG_ANSWER_INTERVAL: 10000,
        SHOW_HINT_TIMER: 5,
        NUMBER_OF_HINTS_DISPLAYED: 5,
        profilePicture: "empty_path"
    },
    {
        id: 1,
        name: "Lionel",
        lastName: "Messi",
        role: 'user',
        SHOW_POP_UP_TIMER: 15000,
        REMOVE_WRONG_ANSWER_INTERVAL: 5000,
        NUMBER_OF_ANSWERS_DISPLAYED: 3,
        SHOW_HINT_TIMER: 5,
        NUMBER_OF_HINTS_DISPLAYED: 0,
        profilePicture: "empty_path"
    },
    {
        id: 2,
        name: "Christiano",
        lastName: "Ronaldo",
        role: 'user',
        SHOW_POP_UP_TIMER: 15000,
        REMOVE_WRONG_ANSWER_INTERVAL: 10000,
        NUMBER_OF_ANSWERS_DISPLAYED: 3,
        SHOW_HINT_TIMER: 5,
        NUMBER_OF_HINTS_DISPLAYED: 10,
        profilePicture: "empty_path"
    },
    {
        id: 3,
        name: "Kylian",
        lastName: "Mbappé",
        role: 'user',
        SHOW_POP_UP_TIMER: 10000,
        REMOVE_WRONG_ANSWER_INTERVAL: 5000,
        SHOW_HINT_TIMER: 5,
        NUMBER_OF_ANSWERS_DISPLAYED: 4,
        NUMBER_OF_HINTS_DISPLAYED: 4,
        profilePicture: "empty_path"
    },
    {
        id: 4,
        name: "Neymar",
        lastName: "Jr.",
        role: 'user',
        SHOW_POP_UP_TIMER: 30000,
        REMOVE_WRONG_ANSWER_INTERVAL: 7000,
        SHOW_HINT_TIMER: 15,
        NUMBER_OF_ANSWERS_DISPLAYED: 4,
        NUMBER_OF_HINTS_DISPLAYED: 2,
        profilePicture: "empty_path"
    },
    {
        id: 5,
        name: "Erling",
        lastName: "Haaland",
        role: 'user',
        NUMBER_OF_ANSWERS_DISPLAYED: 4,
        SHOW_POP_UP_TIMER: 30000,
        REMOVE_WRONG_ANSWER_INTERVAL: 15000,
        SHOW_HINT_TIMER: 5,
        NUMBER_OF_HINTS_DISPLAYED: 5,
        profilePicture: "empty_path"
    },
  {
    id: 0,
    name: 'Admin',
    lastName: 'Root',
    role: 'admin',
    SHOW_POP_UP_TIMER: 99999999999,
    NUMBER_OF_ANSWERS_DISPLAYED: 10,
    REMOVE_WRONG_ANSWER_INTERVAL: 999999999,
    SHOW_HINT_TIMER: 5,
    NUMBER_OF_HINTS_DISPLAYED: 9999,
    profilePicture: "empty_path"
  },
  {
    id: 0,
    name: 'Admin',
    lastName: 'Root',
    role: 'admin',
    SHOW_POP_UP_TIMER: 99999999999,
    NUMBER_OF_ANSWERS_DISPLAYED: 10,
    REMOVE_WRONG_ANSWER_INTERVAL: 999999999,
    SHOW_HINT_TIMER: 5,
    NUMBER_OF_HINTS_DISPLAYED: 9999,
    profilePicture: "empty_path"
  },
  {
    id: 0,
    name: 'Admin',
    lastName: 'Root',
    role: 'admin',
    SHOW_POP_UP_TIMER: 99999999999,
    NUMBER_OF_ANSWERS_DISPLAYED: 10,
    REMOVE_WRONG_ANSWER_INTERVAL: 999999999,
    SHOW_HINT_TIMER: 5,
    NUMBER_OF_HINTS_DISPLAYED: 9999,
    profilePicture: "empty_path"
  },
  {
    id: 0,
    name: 'Admin',
    lastName: 'Root',
    role: 'admin',
    SHOW_POP_UP_TIMER: 99999999999,
    NUMBER_OF_ANSWERS_DISPLAYED: 10,
    REMOVE_WRONG_ANSWER_INTERVAL: 999999999,
    SHOW_HINT_TIMER: 5,
    NUMBER_OF_HINTS_DISPLAYED: 9999,
    profilePicture: "empty_path"
  },
]

export const GUEST_PROFILE: Profile = {
    id: -1,
    name: 'Guest',
    lastName: 'User',
    role: 'user',
    SHOW_POP_UP_TIMER: 15000,
    NUMBER_OF_ANSWERS_DISPLAYED: 4,
    REMOVE_WRONG_ANSWER_INTERVAL: 10000,
    SHOW_HINT_TIMER: 5,
    NUMBER_OF_HINTS_DISPLAYED: 5,
    profilePicture: "empty_path"
};

export const ADMIN_PROFILE: Profile = {
    id: 0,
    name: 'Admin',
    lastName: 'Root',
    role: 'admin',
    SHOW_POP_UP_TIMER: 99999999999,
    NUMBER_OF_ANSWERS_DISPLAYED: 10,
    REMOVE_WRONG_ANSWER_INTERVAL: 999999999,
    SHOW_HINT_TIMER: 5,
    NUMBER_OF_HINTS_DISPLAYED: 9999,
    profilePicture: "empty_path"
}
