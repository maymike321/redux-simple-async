import { createAsyncAction } from '../src/index';
import { AnyAction, Dispatch } from 'redux';

describe('Create async action', () => {
    const type = 'type';
    const defaultPayload = 1;

    test('has correct type and payload', () => {
        const asyncAction = createAsyncAction<number>(type, async (dispatch, getState, payload) => {})(defaultPayload);
        expect(asyncAction.type).toBe(type);
        expect(asyncAction.payload).toBe(defaultPayload);
    });

    test('works without payload', () => {
        const asyncAction = createAsyncAction(type, async (dispatch, getState) => {})();
        expect(asyncAction.type).toBe(type);
        expect((asyncAction as any).payload).toBeUndefined();
    })

    test('has async parameter that will execute async function with payload', async (done) => {
        let dispatchCalled = false;
        let getStateCalled = false;
        const dispatch = (action: AnyAction) => {
            dispatchCalled = true;
            return <any>{}
        }
        const getState = () => getStateCalled = true;
        const asyncFunction = async (dispatch: Dispatch<AnyAction>, getState: () => any, payload: number) => {
            dispatch({type});
            getState();
            expect(payload).toEqual(defaultPayload);
            expect(dispatchCalled).toBeTruthy();
            expect(getStateCalled).toBeTruthy();
            done();
        }
        const asyncAction = createAsyncAction(type, asyncFunction)(defaultPayload);
        asyncAction.async(dispatch, getState);
    });

    test('has async parameter that will execute async function without payload', async (done) => {
        let dispatchCalled = false;
        let getStateCalled = false;
        const dispatch = (action: AnyAction) => {
            dispatchCalled = true;
            return <any>{}
        }
        const getState = () => getStateCalled = true;
        const asyncFunction = async (dispatch: Dispatch<AnyAction>, getState: () => any) => {
            dispatch({type});
            getState();
            expect(dispatchCalled).toBeTruthy();
            expect(getStateCalled).toBeTruthy();
            done();
        }
        const asyncAction = createAsyncAction(type, asyncFunction)();
        asyncAction.async(dispatch, getState);
    });
});