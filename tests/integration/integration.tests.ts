import { createAsyncAction, asyncMiddleware } from "../../src";
import { MiddlewareAPI, Dispatch, AnyAction } from "redux";

describe('asyncMiddleware and createAsyncAction', () => {
    test('when asyncMiddleware is passed an action created by createAsyncAction with no payload, it properly handles the async action', async () => {
        const type = 'type';
        let dispatchCalled = false;
        let getStateCalled = false;
        let nextCalled = false;
        const noPayloadMwApi: MiddlewareAPI<Dispatch<AnyAction>> = {
            dispatch: (action: AnyAction) => {
                dispatchCalled = true;
                return <any>{}
            },
            getState: () => {
                getStateCalled = true;
                return {}
            }
        };
        const next: Dispatch<AnyAction> = (action: any) => {
            nextCalled = true;
            return <any>{};
        }
        const action = async (dispatch: Dispatch<AnyAction>, getState: () => any) => {
            dispatch({type: type});
            getState();
        };
        const asyncAction = createAsyncAction(type, action)();

        await asyncMiddleware(noPayloadMwApi)(next)(asyncAction);

        expect(dispatchCalled).toBe(true);
        expect(getStateCalled).toBe(true);
        expect(nextCalled).toBe(true);
    });

    test('when asyncMiddleware is passed an action created by createAsyncAction with payload, it properly handles the async action', async () => {
        const type = 'type';
        let dispatchCalled = false;
        let getStateCalled = false;
        let nextCalled = false;
        const noPayloadMwApi: MiddlewareAPI<Dispatch<AnyAction>> = {
            dispatch: (action: AnyAction) => {
                dispatchCalled = true;
                return <any>{}
            },
            getState: () => {
                getStateCalled = true;
                return {}
            }
        };
        const next: Dispatch<AnyAction> = (action: any) => {
            nextCalled = true;
            return <any>{};
        }
        const action = async (dispatch: Dispatch<AnyAction>, getState: () => any, payload: number) => {
            dispatch({type: type});
            getState();
        };
        const asyncAction = createAsyncAction(type, action)(1);

        await asyncMiddleware(noPayloadMwApi)(next)(asyncAction);

        expect(dispatchCalled).toBe(true);
        expect(getStateCalled).toBe(true);
        expect(nextCalled).toBe(true);
    });
});