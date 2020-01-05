redux-simple-async
=============

Simple library for creating and firing off asynchronous actions in redux.

## Install

```js
npm install --save redux-simple-async
```

## Adding as middleware

```ts
import { compose, applyMiddleware } from 'redux';
import { asyncMiddleware } from 'redux-simple-async'
...
const enhancers = [someMiddleware, someOtherMiddleware, asyncMiddleware, yetAnotherPieceOfMiddleware];
...
const store = createStore(rootReducer, compose(applyMiddleware(...enhancers)));
```

## Usage
### With no payload:
```ts
// getUsers.ts
export const getUsers = createAsyncAction('GET_USERS',
    async (dispatch, getState) => {
        try {
            const state = getState(); // use getState to get the state of the redux store
            const token = getToken(state);
            const users = await getUsersFromApi(token); // fire off and wait for other async actions.
            dispatch(storeUsers(users));
        }
        catch (e) {
            dispatch(storeError(e));
        }
    }

// userPage.container.ts
const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(getUsers())
});
```

### With Payload:
```ts
// editUser.ts
export const editUser = createAsyncAction('EDIT_USER',
    async (dispatch, getState, payload: User) => {
        try {
            const state = getState();
            const token = getToken(state);
            await editUserFromApi(payload, token);
        }
        catch (e) {
            dispatch(storeError(e));
        }
    });

//userPage.container.ts
const mapDispatchToProps = dispatch => ({
    editUser: (user) => dispatch(editUser(user))
});
```