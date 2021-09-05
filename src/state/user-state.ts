import { userInterface } from "../pages/Info"

const initUser = { email: ``, pass: ``, faculty: ``, image: ``, username: ``, number: `` }


const actions = {
    update_user: (payload: userInterface) => ({ type: `update_user`, payload })
}

const reducers = {

}


function userReducers(state = initUser, action: { type: string, payload: any }) {

   
    switch (action.type) {
        case `update_user`:  return action.payload || state;

        default: return state;
    }
}

export const selectUser= (state:any)=>state.userReducers

export const { update_user } = actions

export default userReducers

