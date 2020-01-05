import { MiddlewareAPI, Dispatch, AnyAction } from "redux";
import { asyncMiddleware } from "../src";

describe('asyncMiddleware', () => {
    test('Passes action to next when action.async is undefined', async () => {
        let mwApiDispatchCalled = false;
        let getStateCalled = false;
        let nextDispatchCalled = false;
        const mwApi: MiddlewareAPI<Dispatch<AnyAction>> = {
            dispatch: (action: AnyAction) => {
                mwApiDispatchCalled = true;
                return <any>{};
            },
            getState: () => {
                getStateCalled = true;
                return {}
            }
        };
        const next: Dispatch<AnyAction> =  (action: AnyAction) => {
            nextDispatchCalled = true;
            return <any>{};
        }
        const action = {};

        await asyncMiddleware(mwApi)(next)(action);
        expect(mwApiDispatchCalled).toBe(false);
        expect(getStateCalled).toBe(false);
        expect(nextDispatchCalled).toBe(true);
    });

    test('Crashes and burns when action.async exists but is not an async function', async () => {
        const mwApi: MiddlewareAPI<Dispatch<AnyAction>> = {
            dispatch: (action: AnyAction) => {
                return <any>{};
            },
            getState: () => {
                return {}
            }
        };
        const next: Dispatch<AnyAction> =  (action: AnyAction) => {
            return <any>{};
        }
        const action = { async: 'I am not an async function' }
        expect(asyncMiddleware(mwApi)(next)(action)).rejects.toBeTruthy();
    });

    test('Passes action to next and calls async function when action.async is an async function', async () => {
        let mwApiDispatchCalled = false;
        let getStateCalled = false;
        let nextDispatchCalled = false;
        const mwApi: MiddlewareAPI<Dispatch<AnyAction>> = {
            dispatch: (action: AnyAction) => {
                mwApiDispatchCalled = true;
                return <any>{};
            },
            getState: () => {
                getStateCalled = true;
                return {}
            }
        };
        const next: Dispatch<AnyAction> =  (action: AnyAction) => {
            nextDispatchCalled = true;
            return <any>{};
        }
        const action = { 
            async: async (dispatch: Dispatch<AnyAction>, getState: () => {}) => {
                dispatch({type: "type"});
                getState();
            }
        }

        await asyncMiddleware(mwApi)(next)(action);
        expect(mwApiDispatchCalled).toBe(true);
        expect(getStateCalled).toBe(true);
        expect(nextDispatchCalled).toBe(true);
    });
});